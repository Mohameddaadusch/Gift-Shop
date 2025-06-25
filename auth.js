import express from 'express';
import sessions from 'express-session'
import { Pool } from 'pg';
import cors from 'cors'; // Import the cors middleware
import bcrypt from 'bcrypt'

const app = express();
const port = 3001; // Choose a port for your backend (different from your React app's port, usually 3000)

// Middleware to parse JSON request bodies
app.use(express.json());

// Enable CORS for all origins (for development - adjust as needed for production)
app.use(cors());

app.use(
    sessions({
        secret: 'GvkoP7Xrq6SY7cBY2F8U7T',
        cookie: {
            maxAge: 1000 * 60 * 5
        },
        resave: true,
        saveUninitialized: false
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


// API endpoint to add a user to the database
app.post('/api/signup', async (req, res) => {
    const user = req.body;
    

    try {
        // check if user exists
        const checkUserQuery = 'SELECT id FROM "user" WHERE mail = $1';
        const userExists = await pool.query(checkUserQuery, [user.mail]);

        if (userExists.rows.length > 0) {
            return res.status(409).json({ message: 'email already exists.' });
        }

        user.password = await bcrypt.hash(user.password, 10); // encrypt password

        const result = await pool.query(
            'INSERT INTO "user" (mail, password, name, age, gender, hobbies) VALUES ($1, $2, $3, $4, $5, $6)',
            [user.mail, user.password, user.name, user.age, user.gender, user.hobbies]
        );
        res.status(200).json({ message: 'User added successfully!' });
    } catch (error) {
        console.error('Error adding user:', error);
        res.status(500).json({ error: 'Failed to add user: ' + error.message });
    }
});

app.post('/api/signin', async (req, res) => {
    const user = req.body;

    try {
        const getUserQuery = 'SELECT mail, password FROM "user" WHERE mail = $1';
        const result = await pool.query(getUserQuery, [user.mail]);

        const dbUser = result.rows[0];

        if (result.rows.length == 0) {
            // Use a generic message for security
            return res.status(401).json({ message: 'Invalid credentials.' });
        }

        // Compare passwords
        const isMatch = await bcrypt.compare(user.password, dbUser.password);

        if (isMatch) {
            console.log(`User ${user.username} logged in successfully.`);
            // Authentication successful
            // generate a session or JWT here.
            res.status(200).json({
                message: 'Login successful!',
            });

            req.session.userid = req.body.mail;

        } else {
            return res.status(401).json({ message: 'Invalid credentials.' });
        }
    } catch (error) {
        console.error('Error logging in user:', error);
        res.status(500).json({ error: 'Failed to log in: ' + error.message });
    }
 


});


app.listen(port, () => {
    console.log(`Backend server listening at http://localhost:${port}`);
});