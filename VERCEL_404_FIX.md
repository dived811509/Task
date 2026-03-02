# Fixing 404 Errors on Vercel

When you deploy the frontend of the listing platform to Vercel, you may encounter `404 Not Found` errors when navigating directly to client-side routes (e.g. `/listings/123`).

## Cause

Vercel serves static files by default. Without additional configuration, requests for nested paths are treated as missing files, so the Single Page Application (SPA) can't handle the route and returns a 404.

## Solution

1. **Add a rewrite rule** in `vercel.json` at the project root:

   ```json
   {
     "rewrites": [
       { "source": "/(.*)", "destination": "/index.html" }
     ]
   }
   ```

   This ensures all requests are redirected to the React app, which then uses the client router to display the correct page.

2. **Update API configuration**:
   * In `src/utils/api.js` (frontend), use an environment variable instead of a hardcoded `/api` path:
     ```js
     const apiBaseURL = import.meta.env.VITE_API_URL || "/api";
     // …
     axios.create({ baseURL: apiBaseURL });
     ```
   * Add a `.env` or `.env.local` file during development with `VITE_API_URL=http://localhost:5000/api`.
   * On Vercel, set `VITE_API_URL` to your backend URL (e.g. `https://your-backend.onrender.com/api`).

3. **Ensure CORS allows the frontend origin**:
   * Backend `server.js` now reads `CORS_ORIGIN` from environment and passes it to `cors()`.
   * On deploy, set `CORS_ORIGIN` to your frontend URL (`https://your-frontend.vercel.app`).

4. **Re-deploy** your application. The 404 error should disappear and client-side navigation will work as expected.

> ⚠️ If you reset your workspace or remove files, remember to recreate `vercel.json` and reconfigure the environment variables.
