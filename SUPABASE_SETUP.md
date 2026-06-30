# 🔐 MindEase — Supabase Authentication Setup

This guide walks you through setting up **free** secure authentication with Supabase.

---

## Why Supabase?

| Feature | Free Tier |
|---------|-----------|
| Monthly active users | **50,000** |
| Database | **500 MB** PostgreSQL |
| Storage | **1 GB** |
| Auth providers | Email, Google, Apple, GitHub, etc. |
| Row Level Security | ✅ Built-in |
| Password hashing | ✅ bcrypt |
| Email verification | ✅ Included |
| Password reset | ✅ Included |

**Cost: $0/month** for most apps!

---

## Step 1: Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Click **Start your project** (sign in with GitHub)
3. Click **New project**
4. Fill in:
   - **Name:** MindEase
   - **Database Password:** (save this somewhere safe!)
   - **Region:** Choose closest to your users
5. Click **Create new project**
6. Wait ~2 minutes for setup

---

## Step 2: Get Your API Keys

1. In your Supabase dashboard, go to **Settings** → **API**
2. Copy these values:

```
Project URL: https://xxxxxxxxxxxxx.supabase.co
anon (public) key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

3. Add them to your `.env` file:

```env
# .env (or .env.local)
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

## Step 3: Configure Authentication

### Email Auth (Already enabled by default)

In Supabase dashboard: **Authentication** → **Providers** → **Email**

Recommended settings:
- ✅ Enable email confirmations (security)
- ✅ Enable double confirm for email changes
- Minimum password length: **8**

### Google Sign-In (Free)

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project or select existing
3. Go to **APIs & Services** → **Credentials**
4. Click **Create Credentials** → **OAuth client ID**
5. Choose **Web application**
6. Add authorized redirect URI:
   ```
   https://xxxxxxxxxxxxx.supabase.co/auth/v1/callback
   ```
7. Copy **Client ID** and **Client Secret**
8. In Supabase: **Authentication** → **Providers** → **Google**
9. Paste your credentials and enable

### Apple Sign-In (Requires Apple Developer Account)

1. Go to [Apple Developer Portal](https://developer.apple.com)
2. Create a **Services ID** for Sign in with Apple
3. Configure redirect URL:
   ```
   https://xxxxxxxxxxxxx.supabase.co/auth/v1/callback
   ```
4. Generate a **private key**
5. In Supabase: **Authentication** → **Providers** → **Apple**
6. Enter your credentials

---

## Step 4: Configure Email Templates (Optional)

In Supabase: **Authentication** → **Email Templates**

### Confirm signup:
```html
<h2>Welcome to MindEase</h2>
<p>Thanks for signing up! Click below to confirm your email:</p>
<p><a href="{{ .ConfirmationURL }}">Confirm your email</a></p>
<p>Your journey to calm begins now. 🌿</p>
```

### Reset password:
```html
<h2>Reset your password</h2>
<p>Click below to reset your MindEase password:</p>
<p><a href="{{ .ConfirmationURL }}">Reset password</a></p>
<p>If you didn't request this, you can ignore this email.</p>
```

---

## Step 5: Set Up Database Tables

In Supabase: **SQL Editor** → **New query**

Run this SQL to create the MindEase tables:

```sql
-- Users profile (extends Supabase auth.users)
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Moods
CREATE TABLE public.moods (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  value INTEGER NOT NULL CHECK (value >= 1 AND value <= 5),
  label TEXT NOT NULL,
  note TEXT,
  factors JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Journal entries
CREATE TABLE public.journal_entries (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  title TEXT,
  content TEXT NOT NULL,
  mood_label TEXT,
  mood_value INTEGER,
  tags JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Breathing sessions
CREATE TABLE public.breathing_sessions (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  technique TEXT NOT NULL,
  duration_seconds INTEGER NOT NULL,
  completed_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.moods ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.journal_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.breathing_sessions ENABLE ROW LEVEL SECURITY;

-- RLS Policies: Users can only access their own data
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can view own moods" ON public.moods
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own moods" ON public.moods
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own journal" ON public.journal_entries
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own journal" ON public.journal_entries
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own journal" ON public.journal_entries
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own journal" ON public.journal_entries
  FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can view own breathing" ON public.breathing_sessions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own breathing" ON public.breathing_sessions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'full_name');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

---

## Step 6: Configure Redirect URLs

In Supabase: **Authentication** → **URL Configuration**

Add these URLs:

### Site URL:
```
https://your-domain.com
```

### Redirect URLs:
```
https://your-domain.com/auth/callback
http://localhost:3000/auth/callback
```

---

## Step 7: Test It!

1. Start your dev server:
   ```bash
   npm run dev
   ```

2. Go to `/signup` and create an account
3. Check your email for confirmation
4. Log in and verify everything works

---

## Security Features (Automatic)

✅ **Password hashing** — bcrypt with cost factor 10
✅ **HTTPS only** — All API calls encrypted
✅ **JWT tokens** — Short-lived, secure tokens  
✅ **Row Level Security** — Users can only see their data
✅ **Rate limiting** — Prevents brute force attacks
✅ **CSRF protection** — Built into auth flow

---

## Environment Variables Summary

```env
# Required
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Optional (for server-side admin operations)
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

## Troubleshooting

### "Invalid API key"
- Check that NEXT_PUBLIC_SUPABASE_ANON_KEY is correct
- Make sure you're using the `anon` key, not `service_role`

### "Email not confirmed"
- Check spam folder
- In Supabase: Authentication → Users → Confirm manually for testing

### Google/Apple login not working
- Verify redirect URLs match exactly
- Check that OAuth credentials are correct

### "User already registered"
- Email is already in use
- Check Supabase: Authentication → Users

---

## Free Tier Limits

| Resource | Limit |
|----------|-------|
| API requests | Unlimited |
| Auth users | 50,000 MAU |
| Database | 500 MB |
| Storage | 1 GB |
| Edge functions | 500K invocations |
| Realtime | 200 concurrent |

These limits are **very generous** — most apps never exceed them!

---

## Need More?

### Upgrade to Pro ($25/month):
- 100K MAU
- 8 GB database
- 100 GB storage
- Daily backups
- Priority support

### Enterprise:
- Custom limits
- SLA
- Dedicated support

---

## Quick Links

- [Supabase Dashboard](https://app.supabase.com)
- [Supabase Docs](https://supabase.com/docs)
- [Auth Documentation](https://supabase.com/docs/guides/auth)
- [Row Level Security Guide](https://supabase.com/docs/guides/auth/row-level-security)

---

Happy building! 🚀
