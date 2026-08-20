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

The complete forward-only migration is in `supabase/migrations/20260820000000_create_finance_schema.sql`.
Run it from the Supabase SQL Editor, or with the Supabase CLI after linking this project. It creates only the `categories` and `expenses` tables; Supabase Auth continues to own users in `auth.users`.

The migration also creates indexes, category ownership foreign keys, and separate SELECT, INSERT, UPDATE, and DELETE RLS policies for each table. No existing data is dropped or altered.

## Step 4: Enable Email/Password Authentication

1. In Supabase dashboard, go to **Authentication** > **Providers**
2. Make sure "Email" is enabled (it should be by default)
3. Go to **Authentication** > **Policies** (if needed for custom rules)

## Step 5: Test the Integration

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
