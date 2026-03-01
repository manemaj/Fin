# How to Reconnect Supabase

Your Supabase project may have been paused or the credentials may have changed. Follow these steps to reconnect:

## Step 1: Check Your Supabase Project

1. **Go to Supabase Dashboard**
   - Visit: https://supabase.com/dashboard
   - Log in to your account

2. **Check Your Project Status**
   - Look for your project: `hkjwhbezlujqlwqmkrlh`
   - If it says "Paused", click to restore it
   - Free tier projects pause after inactivity

## Step 2: Get Your API Keys

1. **In Supabase Dashboard**, select your project
2. Click on the **⚙️ Settings** icon (bottom left)
3. Click on **API** in the left sidebar
4. You'll see two important values:

### Project URL
```
Example: https://your-project-ref.supabase.co
```

### Anon/Public Key
```
Example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## Step 3: Update Your Code

### Option A: I'll Update It For You
**Just tell me:**
1. Your new **Project URL**
2. Your new **anon key** (the long string starting with `eyJ`)

And I'll update the code automatically!

### Option B: Update Manually
1. Open `script.js`
2. Find lines 2-3 at the very top
3. Replace with your new values:

```javascript
const SUPABASE_URL = 'YOUR_PROJECT_URL_HERE';
const SUPABASE_ANON_KEY = 'YOUR_ANON_KEY_HERE';
```

## Step 4: Verify the Database Table Exists

1. In Supabase Dashboard, click **Table Editor** (left sidebar)
2. Check if `user_profiles` table exists
3. If NOT, go to **SQL Editor** and run this:

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
    quizzes_completed INTEGER[] DEFAULT '{}',
    streak INTEGER DEFAULT 0,
    last_active_date TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id)
);

-- Enable Row Level Security
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view own profile"
    ON user_profiles FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own profile"
    ON user_profiles FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own profile"
    ON user_profiles FOR UPDATE
    USING (auth.uid() = user_id);

CREATE INDEX idx_user_profiles_user_id ON user_profiles(user_id);
```

## Step 5: Enable Email Authentication

1. In Supabase Dashboard, go to **Authentication** → **Providers**
2. Make sure **Email** is **enabled**
3. For testing, you can disable "Confirm email"

## Step 6: Test the Connection

1. **Refresh your website**
2. **Open browser console** (F12)
3. Look for: `✅ Supabase initialized successfully`
4. Try signing up with a test account

## Common Issues

### 🔴 Project Paused
- Free tier projects pause after 1 week of inactivity
- Click "Restore" in the dashboard

### 🔴 Invalid API Keys
- Get fresh keys from Settings → API
- Update in `script.js`

### 🔴 Database Not Set Up
- Run the SQL above to create the table
- Check Table Editor to verify

### 🔴 Authentication Disabled
- Enable Email provider in Authentication settings

## Need Help?

**Share with me:**
1. Screenshot of your Supabase dashboard showing project status
2. Any error messages from browser console
3. Your new Project URL and anon key (so I can update the code)

I'm ready to help you reconnect! Just provide your Supabase credentials and I'll update everything for you.

