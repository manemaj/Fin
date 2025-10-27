-- Fix for missing quizzes_completed column
-- Run this in your Supabase SQL Editor

-- Add the quizzes_completed column if it doesn't exist
ALTER TABLE user_profiles 
ADD COLUMN IF NOT EXISTS quizzes_completed INTEGER[] DEFAULT '{}';

-- Verify the column was added
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'user_profiles' 
ORDER BY ordinal_position;

