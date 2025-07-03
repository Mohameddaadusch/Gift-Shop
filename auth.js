import express from 'express';
import sessions from 'express-session';
import pgSession from 'connect-pg-simple';
import { Pool } from 'pg';
import cors from 'cors';
import bcrypt from 'bcrypt';
import admin from 'firebase-admin';

// Initialize Firebase Admin SDK
// You'll need to download your service account key from Firebase Console
// and place it in your project root or update the path below
try {
  // Option 1: Use service account key file (recommended for production)
  // const serviceAccount = require('./firebase-service-account.json');
  // admin.initializeApp({
  //   credential: admin.credential.cert(serviceAccount),
  // });

  // Option 2: Use default credentials or environment variables (for development)
  admin.initializeApp({
    projectId: 'giftshop-69609', // Your Firebase project ID
  });
  console.log('Firebase Admin initialized successfully');
} catch (error) {
  console.log('Firebase Admin initialization skipped:', error.message);
}

const app = express();
const port = 3001;

app.use(express.json());

app.use(
  cors({
    origin: 'http://localhost:5173',
    credentials: true,
  })
);

// PostgreSQL connection pool
const pool = new Pool({
    host: "localhost",
    user: "postgres",
    port: 5432,
    password: "Serenity222",
    database: "postgres"
});

// Initialize session store using connect-pg-simple
const PgStore = pgSession(sessions);

// Define the session middleware separately
const sessionParser = sessions({
    store: new PgStore({
        pool : pool,
        tableName : 'user_sessions',
        createTableIfMissing: true // Ensure table is created if missing (useful for dev)
    }),
    secret: 'GvkoP7Xrq6SY7cBY2F8U7T',
    cookie: {
        maxAge: 1000 * 60 * 60 * 24, // 24 hours
        httpOnly: true,
        sameSite: 'lax', // 'lax' for typical web apps, 'none' + secure:true for cross-site iframes
        // secure: process.env.NODE_ENV === 'production' ? true : false, // Uncomment in production with HTTPS
    },
    resave: false,
    saveUninitialized: false,
    name: 'connect.sid', // Explicitly set cookie name (default, but good to be explicit)
    proxy: true // Crucial: Set to true if you are behind a proxy (even localhost setup can behave this way)
});

// Apply the session middleware
app.use(sessionParser);

// Middleware to log session on every request (for debugging purposes)
// This log runs *after* sessionParser has attempted to populate req.session
app.use((req, res, next) => {
    console.log(`[DEBUG-SESSION] Path: ${req.path}, Method: ${req.method}`);
    console.log(`[DEBUG-SESSION] Session ID (from cookie): ${req.sessionID}`);
    console.log(`[DEBUG-SESSION] Session User (from req.session):`, req.session.user);
    // You can also check if the store is connected:
    // console.log(`[DEBUG-SESSION] Store connected:`, req.sessionStore && req.sessionStore.client);
    next();
});

// API endpoint to add a user to the database
app.post('/api/signup', async (req, res) => {
    const user = req.body;
    try {
        const checkUserQuery = 'SELECT id FROM "user" WHERE mail = $1';
        const userExists = await pool.query(checkUserQuery, [user.mail]);

        if (userExists.rows.length > 0) {
            return res.status(409).json({ message: 'Email already exists.' });
        }

        user.password = await bcrypt.hash(user.password, 10);

        await pool.query(
            'INSERT INTO "user" (mail, password, name, age, gender, hobbies) VALUES ($1, $2, $3, $4, $5, $6)',
            [user.mail, user.password, user.name, user.age, user.gender, user.hobbies]
        );
        res.status(200).json({ message: 'User added successfully!' });
    } catch (error) {
        console.error('Error adding user:', error);
        res.status(500).json({ error: 'Failed to add user: ' + error.message });
    }
});

// Signin endpoint
app.post('/api/signin', async (req, res) => {
    const user = req.body;
    try {
        const getUserQuery = 'SELECT id, mail, name, age, gender, hobbies FROM "user" WHERE mail = $1';
        const result = await pool.query(getUserQuery, [user.mail]);

        const dbUser = result.rows[0];

        if (result.rows.length === 0) {
            return res.status(401).json({ message: 'Invalid credentials.' });
        }

        dbUser.hobbies = convertStringToArray(dbUser.hobbies);

        const getHashQuery = 'SELECT password FROM "user" WHERE mail = $1';
        const hashResult = await pool.query(getHashQuery, [user.mail]);
        const dbHashedPassword = hashResult.rows[0].password;

        const isMatch = await bcrypt.compare(user.password, dbHashedPassword);

        if (isMatch) {
            req.session.user = dbUser;

            req.session.save((err) => { // Explicitly save the session
                if (err) {
                    console.error('[SIGNIN-ERROR] Failed to save session:', err);
                    return res.status(500).json({ message: 'Login failed due to session error.' });
                }
                console.log(`[SIGNIN] User ${dbUser.name} logged in successfully. Session user set and saved.`);
                res.status(200).json({
                    message: 'Login successful!',
                    user: dbUser
                });
            });

        } else {
            console.log('[SIGNIN] Invalid credentials for:', user.mail);
            return res.status(401).json({ message: 'Invalid credentials.' });
        }
    } catch (error) {
        console.error('Error logging in user:', error);
        res.status(500).json({ error: 'Failed to log in: ' + error.message });
    }
});

// Endpoint to check for active session
app.get('/api/me', (req, res) => {
  if (req.session.user) {
    res.status(200).json({ user: req.session.user });
    console.log('[API/ME] User authenticated:', req.session.user.mail);
  } else {
    res.status(401).json({ message: 'Not authenticated' });
    console.log('[API/ME] User NOT authenticated. req.session.user is undefined.');
  }
});

// Logout endpoint
app.post('/api/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) {
      console.error('Error destroying session during logout:', err);
      return res.status(500).json({ message: 'Could not log out, please try again.' });
    }
    res.clearCookie('connect.sid');
    res.status(200).json({ message: 'Logout successful' });
    console.log('[LOGOUT] Session destroyed and cookie cleared.');
  });
});

function convertStringToArray(inputString) {
    const cleanedString = inputString.trim().replace(/^{/, '').replace(/}$/, '').trim();
    if (cleanedString === '') {
        return [];
    }
    const values = cleanedString.split(',').map(value => value.trim());
    if (!inputString.startsWith('{') || !inputString.endsWith('}')) {
        console.warn(`[WARNING] Hobbies string format incorrect: "${inputString}"`);
        return [];
    }
    return values;
}

// Firebase Authentication endpoint
app.post('/api/firebase-signin', async (req, res) => {
    const { idToken } = req.body;
    
    if (!idToken) {
        return res.status(400).json({ message: 'ID token is required' });
    }

    try {
        // Verify the Firebase ID token
        const decodedToken = await admin.auth().verifyIdToken(idToken);
        const { email, name, uid, picture } = decodedToken;

        console.log(`[FIREBASE-SIGNIN] User ${name || email} attempting to sign in with Firebase`);

        // Check if user exists in your database
        const checkUserQuery = 'SELECT id, mail, name, age, gender, hobbies FROM "user" WHERE mail = $1';
        const userResult = await pool.query(checkUserQuery, [email]);

        let dbUser;
        if (userResult.rows.length === 0) {
            // User doesn't exist in your DB, create a new one
            console.log(`[FIREBASE-SIGNIN] Creating new user for ${email}`);
            const insertUserQuery = `
                INSERT INTO "user" (mail, name, age, gender, hobbies, firebase_uid) 
                VALUES ($1, $2, $3, $4, $5, $6) 
                RETURNING id, mail, name, age, gender, hobbies
            `;
            const newUserResult = await pool.query(insertUserQuery, [
                email,
                name || email.split('@')[0], // Use name from Firebase or email prefix
                null, // age - can be updated later
                null, // gender - can be updated later  
                '{}', // empty hobbies array
                uid
            ]);
            dbUser = newUserResult.rows[0];
        } else {
            // User exists, use existing data
            dbUser = userResult.rows[0];
            console.log(`[FIREBASE-SIGNIN] Existing user found for ${email}`);
        }

        // Process hobbies
        dbUser.hobbies = convertStringToArray(dbUser.hobbies);
        
        // Set session
        req.session.user = {
            ...dbUser,
            firebase: true,
            firebaseUid: uid,
            profilePicture: picture
        };

        req.session.save((err) => {
            if (err) {
                console.error('[FIREBASE-SIGNIN] Session save error:', err);
                return res.status(500).json({ message: 'Login failed due to session error.' });
            }
            console.log(`[FIREBASE-SIGNIN] User ${dbUser.name} logged in successfully with Firebase.`);
            res.status(200).json({
                message: 'Firebase login successful!',
                user: req.session.user
            });
        });

    } catch (error) {
        console.error('[FIREBASE-SIGNIN] Firebase authentication error:', error);
        res.status(401).json({ message: 'Invalid Firebase ID token' });
    }
});

app.listen(port, () => {
    console.log(`Backend server listening at http://localhost:${port}`);
});