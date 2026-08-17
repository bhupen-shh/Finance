# Supabase Integration Setup Guide

This guide will help you set up Supabase for the Finance Dashboard.

## Step 1: Create a Supabase Account and Project

1. Go to [https://supabase.com](https://supabase.com)
2. Sign up or log in with your account
3. Click "New Project"
4. Enter a project name (e.g., "Finance Dashboard")
5. Set a strong database password
6. Select your region
7. Click "Create new project" and wait for it to initialize

## Step 2: Get Your API Credentials

1. In your Supabase dashboard, go to **Settings** > **API**
2. Copy your **Project URL** (e.g., `https://xxx.supabase.co`)
3. Copy your **anon** key (under "Project API keys")
4. Update your `.env.local` file:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

## Step 3: Create Database Tables

In your Supabase dashboard, go to **SQL Editor** and run the following SQL to create the necessary tables:

### Users Table (Already managed by Supabase Auth)
Supabase Auth automatically creates and manages the users table.

### Expenses Table

```sql
-- Create expenses table
CREATE TABLE IF NOT EXISTS expenses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title VARCHAR NOT NULL,
  amount DECIMAL(10, 2) NOT NULL,
  category_id UUID NOT NULL,
  payment_method VARCHAR NOT NULL,
  date DATE NOT NULL,
  type VARCHAR NOT NULL DEFAULT 'one-time',
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT expense_user_fk FOREIGN KEY (user_id) REFERENCES auth.users(id)
);

-- Create index for faster queries
CREATE INDEX idx_expenses_user_id ON expenses(user_id);
CREATE INDEX idx_expenses_date ON expenses(date);
```

### Categories Table

```sql
-- Create categories table
CREATE TABLE IF NOT EXISTS categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name VARCHAR NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT category_user_fk FOREIGN KEY (user_id) REFERENCES auth.users(id)
);

-- Create index for faster queries
CREATE INDEX idx_categories_user_id ON categories(user_id);
```

### Enable Row Level Security (RLS)

```sql
-- Enable RLS on expenses table
ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;

-- Create RLS policy for expenses (users can only see their own)
CREATE POLICY "Users can only view their own expenses"
ON expenses FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can only insert their own expenses"
ON expenses FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can only update their own expenses"
ON expenses FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can only delete their own expenses"
ON expenses FOR DELETE
USING (auth.uid() = user_id);

-- Enable RLS on categories table
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for categories (users can only see their own)
CREATE POLICY "Users can only view their own categories"
ON categories FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can only insert their own categories"
ON categories FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can only update their own categories"
ON categories FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can only delete their own categories"
ON categories FOR DELETE
USING (auth.uid() = user_id);
```

## Step 4: Enable Email/Password Authentication

1. In Supabase dashboard, go to **Authentication** > **Providers**
2. Make sure "Email" is enabled (it should be by default)
3. Go to **Authentication** > **Policies** (if needed for custom rules)

## Step 5: Create a Demo User (Optional)

In the **Authentication** > **Users** section, you can create a test user:
- Email: `test@example.com`
- Password: `Test123!@#`

## Step 6: Test the Integration

1. Start your development server: `npm run dev`
2. Visit `http://localhost:3000/login`
3. Try to sign up with a new email or use your test user
4. After successful login, you should see the Finance Dashboard
5. Add expenses and verify they appear in your Supabase database

## Troubleshooting

### Environment Variables Not Loading
- Make sure you've restarted the dev server after updating `.env.local`
- Check that variable names start with `NEXT_PUBLIC_` for client-side access

### Database Connection Errors
- Verify your Supabase URL and anon key are correct
- Check that RLS policies are set up properly
- Ensure your user is authenticated before making database calls

### Authentication Issues
- Check browser console for error messages
- Verify email confirmation is not required (or configure it in Supabase settings)
- Make sure cookies/storage is enabled in your browser

## Next Steps

The integration is now set up to use Supabase for:
- ✅ User authentication (email/password)
- ✅ Expense data storage
- ✅ Categories management
- ✅ Row-level security for data isolation

Your application will now store all data in Supabase instead of localStorage!
