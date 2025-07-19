import express from 'express';
import cors from 'cors';
import admin from 'firebase-admin';

// Initialize Firebase Admin SDK
try {
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

app.listen(port, () => {
    console.log(`Backend server listening at http://localhost:${port}`);
});