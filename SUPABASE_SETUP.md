# Supabase Setup Guide for Finquest

## Database Setup

You need to create a table in your Supabase database to store user progress. Follow these steps:

### 1. Go to Supabase SQL Editor

1. Log in to your Supabase dashboard at https://supabase.com
2. Select your project: `hkjwhbezlujqlwqmkrlh`
3. Click on "SQL Editor" in the left sidebar
4. Click "New Query"

### 2. Create the `user_profiles` Table

Copy and paste this SQL code into the editor and click "Run":

```sql
-- Create user_profiles table
CREATE TABLE user_profiles (
    id BIGSERIAL PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    full_name TEXT,
    email TEXT,
    modules_completed INTEGER DEFAULT 0,
    quizzes_passed INTEGER DEFAULT 0,
    time_spent INTEGER DEFAULT 0,
    completed_modules INTEGER[] DEFAULT '{}',
    streak INTEGER DEFAULT 0,
    last_active_date TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id)
);

-- Enable Row Level Security (RLS)
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Create policies for user_profiles
-- Users can read their own profile
CREATE POLICY "Users can view own profile"
    ON user_profiles
    FOR SELECT
    USING (auth.uid() = user_id);

-- Users can insert their own profile
CREATE POLICY "Users can insert own profile"
    ON user_profiles
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Users can update their own profile
CREATE POLICY "Users can update own profile"
    ON user_profiles
    FOR UPDATE
    USING (auth.uid() = user_id);

-- Create index for faster queries
CREATE INDEX idx_user_profiles_user_id ON user_profiles(user_id);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_user_profiles_updated_at
    BEFORE UPDATE ON user_profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
```

### 3. Enable Email Authentication

1. Go to "Authentication" → "Providers" in your Supabase dashboard
2. Make sure "Email" is enabled
3. You can disable "Confirm email" for testing (but enable it for production)

### 4. Test the Setup

1. Open your Finquest website
2. Click "Sign Up" and create a test account
3. Check the Supabase dashboard → "Authentication" → "Users" to see if the user was created
4. Check "Table Editor" → "user_profiles" to see if the profile was created

## Features Implemented

✅ **User Authentication**
- Email/password signup and login
- Secure session management with Supabase Auth
- Automatic logout functionality

✅ **Protected Content**
- All modules require login to access
- Users are redirected to login if they try to access modules without authentication

✅ **Progress Tracking**
- User progress is saved to Supabase database
- Tracks: modules completed, quizzes passed, time spent, streak
- Progress syncs across devices (same account)

✅ **User Profile Display**
- Shows user name and email in navigation
- Displays user initial in avatar circle
- Logout button in navigation

## How It Works

1. **Sign Up**: New users create an account with email/password
   - Account is created in Supabase Auth
   - User profile is created in `user_profiles` table

2. **Login**: Existing users log in with their credentials
   - Session is created and stored by Supabase
   - User progress is loaded from database

3. **Module Access**: When users try to open a module
   - System checks if user is authenticated
   - If not logged in, shows login modal
   - If logged in, opens the module

4. **Progress Saving**: When users complete quizzes or modules
   - Progress is automatically saved to Supabase
   - Updates: modules_completed, quizzes_passed, streak, etc.

5. **Logout**: When users log out
   - Supabase session is cleared
   - Navigation returns to Login/Sign Up buttons

## Security Notes

- All database operations use Row Level Security (RLS)
- Users can only read/write their own data
- API keys are safe to expose in frontend (anon key only has limited permissions)
- Passwords are hashed and managed by Supabase Auth

## Troubleshooting

**Problem**: Users can't sign up
- Check if email provider is enabled in Supabase
- Check browser console for errors
- Verify Supabase URL and API key are correct

**Problem**: Progress not saving
- Check if `user_profiles` table exists
- Check if RLS policies are set up correctly
- Open browser console to see error messages

**Problem**: Can't access modules after login
- Check browser console for errors
- Verify `checkAuthState()` is being called
- Check if session is being created in Supabase

## Next Steps (Optional Enhancements)

- Add password reset functionality
- Add social login (Google, GitHub, etc.)
- Add email verification
- Add user profile editing
- Add leaderboard to compare progress with other users
- Add achievements and badges

