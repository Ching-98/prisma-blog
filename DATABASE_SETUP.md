# Database Setup for Production

## Problem Identified

Your Next.js application is failing to fetch posts in production because it's configured to use SQLite, which doesn't work in serverless environments like Vercel. SQLite uses a file-based database (`file:./dev.db`), but serverless functions in Vercel don't have persistent file storage between executions.

## Changes Made

1. Created `.env.production` file with a template for PostgreSQL connection
2. Updated `prisma/schema.prisma` to use PostgreSQL instead of SQLite

## Next Steps

To fix the database connection issue in your deployed application, follow these steps:

### 1. Set up a PostgreSQL Database

You need a PostgreSQL database for your production environment. Some options include:

- [Vercel Postgres](https://vercel.com/docs/storage/vercel-postgres)
- [Supabase](https://supabase.com/)
- [Railway](https://railway.app/)
- [Neon](https://neon.tech/)
- [Heroku Postgres](https://www.heroku.com/postgres)

### 2. Update Your Environment Variables in Vercel

After creating your PostgreSQL database:

1. Go to your Vercel project dashboard
2. Navigate to Settings > Environment Variables
3. Add a new environment variable:
   - Name: `DATABASE_URL`
   - Value: Your PostgreSQL connection string (format: `postgresql://username:password@hostname:port/database`)

### 3. Migrate Your Database Schema

You'll need to run Prisma migrations on your PostgreSQL database:

```bash
# Update your local .env file with the PostgreSQL connection string temporarily
# Then run:
npx prisma migrate deploy
```

Alternatively, you can add this to your build command in `vercel.json`:

```json
{
  "buildCommand": "prisma generate && prisma migrate deploy && next build",
  "installCommand": "npm install",
  "framework": "nextjs"
}
```

### 4. Redeploy Your Application

After setting up your database and environment variables, redeploy your application:

```bash
vercel --prod
```

Or trigger a new deployment from the Vercel dashboard.

## Local Development

For local development, you can continue using SQLite. Your `.env` file with `DATABASE_URL="file:./dev.db"` will be used in development mode, while the PostgreSQL connection will be used in production.
