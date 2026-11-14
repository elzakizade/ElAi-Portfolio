# ElAi — AI & Automation Studio

A responsive Persian/English portfolio and service website for ElAi, featuring AI and data services, Telegram/Bale bot development, n8n workflow automation, and two public project case studies.

## Repository structure

- `index.html` — main website
- `elai-avatar.webp` — optimized hero avatar (required)
- `fashion-ai-stylist.html` — fashion assistant case study
- `bakery-order-automation.html` — Bale cake ordering case study
- `api/consult.js` — AI consultant endpoint (Vercel serverless function)
- `api/lead.js` — project inquiry endpoint (Vercel serverless function)
- `supabase-schema.sql` — database table setup for inquiries
- `vercel.json` — deployment/security headers
- `.env.example` — environment variable names only (NO secrets)

## Upload to GitHub

1. Open your existing GitHub repository (or create one).
2. Choose **Add file → Upload files**. Upload the **contents** of this package at the repository root, keeping `api/` as a folder.
3. Commit with `Prepare optimized ElAi website for Vercel deployment`.
4. If your Vercel project is already connected to that repository, a push to its production branch should trigger a new deployment.

**Important:** If you upload using GitHub's web interface, make sure `api/consult.js` and `api/lead.js` retain their folder structure. GitHub's drag-and-drop of a whole folder may depend on your browser. Using GitHub Desktop or git CLI is more reliable.

## Vercel environment variables

Add these in **Vercel → Project → Settings → Environment Variables** and redeploy:

- `OPENAI_API_KEY` — for AI consultant
- `OPENAI_MODEL` — a model available to your API account
- `SUPABASE_URL` — Supabase project URL
- `SUPABASE_SERVICE_ROLE_KEY` — server-side service key, NEVER expose it in HTML or GitHub

The public website can load without these variables, but the AI consultant and lead submission endpoints need them. Run `supabase-schema.sql` in Supabase SQL Editor before accepting leads. Never commit `.env` or actual secrets.

## Quick validation

- Open the homepage on mobile and desktop.
- Confirm the avatar and both case-study links load.
- Test the language switch and mobile menu.
- Test the consultant and lead form after configuring Vercel environment variables.

This is a static HTML website with Vercel serverless API routes; no frontend build step is required.
