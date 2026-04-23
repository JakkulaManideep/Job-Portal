# Job Portal (MERN, Free-Tier Ready)

This repository contains a refactored MERN job portal split into two apps:

- `job-portal-client` -> React + Vite frontend
- `job-portal-server` -> Node + Express + Mongoose backend

The stack is optimized for **zero-cost student/portfolio deployment**:

- Database: MongoDB Atlas Free tier (M0)
- Backend: Render Free Web Service
- Frontend: Vercel Hobby
- Auth: Clerk (role-based)

## 1) Project Structure

```text
Job-Portal/
  job-portal-client/
    src/
      api/
      components/
      hooks/
      pages/
      utils/
      Router/
  job-portal-server/
    src/
      config/
      controllers/
      middleware/
      models/
      routes/
      utils/
    index.js
  render.yaml
```

## 2) Local Setup

### Backend

```bash
cd job-portal-server
npm install
cp .env.example .env
npm run dev
```

### Frontend

```bash
cd job-portal-client
npm install
cp .env.example .env
npm run dev
```

Frontend default dev URL: `http://localhost:5173`  
Backend default dev URL: `http://localhost:3000`

## 3) Environment Variables

### Backend (`job-portal-server/.env`)

```env
PORT=3000
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/job_portal?retryWrites=true&w=majority
CLIENT_URL=http://localhost:5173
CLERK_SECRET_KEY=
CLERK_ISSUER=
```

Notes:
- `CLERK_SECRET_KEY` comes from Clerk dashboard.
- `CLERK_ISSUER` is optional. Leave empty to auto-detect from token.

### Frontend (`job-portal-client/.env`)

```env
VITE_API_URL=http://localhost:3000
VITE_CLERK_PUBLISHABLE_KEY=
```

## 4) Role Model

- `jobProvider` -> can post/edit/delete jobs and view own job applications.
- `jobSeeker` -> can apply to jobs.

On first sign-in, users are redirected to `/select-role`.

## 5) MongoDB Atlas Free Setup (M0 only)

1. Create Atlas account.
2. Create a **Free cluster** (M0).
3. Create database user (username/password).
4. Add IP access rule:
   - Development: your current IP
   - Deployment: `0.0.0.0/0` (common for hobby projects; use strong password)
5. Get connection string and set `MONGODB_URI` in backend env.

## 6) Clerk Free Setup (Auth)

1. Create a Clerk account.
2. Create an application (free tier).
3. Copy:
   - Publishable key -> frontend `VITE_CLERK_PUBLISHABLE_KEY`
   - Secret key -> backend `CLERK_SECRET_KEY`
4. Add your local/dev and deployed URLs in Clerk allowed origins/redirects.

## 7) Deploy Backend on Render (Free Web Service)

1. Push repo to GitHub.
2. In Render: `New` -> `Web Service`.
3. Select repo and configure:
   - Root Directory: `job-portal-server`
   - Build Command: `npm install`
   - Start Command: `npm start`
   - Instance Type: `Free`
4. Add env vars in Render dashboard:
   - `PORT`
   - `MONGODB_URI`
   - `CLIENT_URL`
   - `CLERK_SECRET_KEY`
   - `CLERK_ISSUER` (optional)
5. Deploy and verify `/api/health`.

## 8) Deploy Frontend on Vercel (Hobby)

1. Import repository in Vercel.
2. Set project root to `job-portal-client`.
3. Add env vars:
   - `VITE_API_URL`
   - `VITE_CLERK_PUBLISHABLE_KEY`
4. Deploy on Hobby plan.

## 9) API Summary

Base URL: `/api`

- Public:
  - `GET /api/health`
  - `GET /api/jobs`
  - `GET /api/jobs/:id`
- Provider-only:
  - `POST /api/jobs`
  - `PATCH /api/jobs/:id`
  - `DELETE /api/jobs/:id`
  - `GET /api/jobs/my/:email`
  - `GET /api/jobs/:id/applications`
- Seeker-only:
  - `POST /api/jobs/:id/apply`
  - `GET /api/applications/my/:email`

## 10) Notes

- `node_modules` are ignored and not tracked.
- Backend production start uses `node index.js`.
- Frontend API calls use `VITE_API_URL` and send Clerk bearer token automatically.