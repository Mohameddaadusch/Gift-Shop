-- Add Firebase UID column to user table
-- Run this SQL command in your PostgreSQL database

ALTER TABLE "user" ADD COLUMN IF NOT EXISTS firebase_uid VARCHAR(128) UNIQUE;

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_user_firebase_uid ON "user"(firebase_uid);

-- Optional: Add comment to describe the column
COMMENT ON COLUMN "user".firebase_uid IS 'Firebase Authentication UID for users who sign in with Firebase';
