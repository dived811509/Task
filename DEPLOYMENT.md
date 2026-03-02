# Deployment Guide

This project consists of two parts:

* **Backend** – Node.js/Express app with MongoDB (Mongoose) and JWT authentication.
* **Frontend** – React application built with Vite and styled with Tailwind.

You can host the backend on Render (free tier) or any Node-compatible platform, and the frontend on Vercel.

---

## 1. Backend (Render Example)

1. Push your code to GitHub (e.g. repository `listing-platform`).
2. Sign in to [Render](https://render.com) and create a new **Web Service**.
3. Connect your GitHub repo and select the `backend` folder (if you have a monorepo) or root if structured accordingly.
4. Set the environment variables:
   * `MONGODB_URI` – your MongoDB Atlas connection string
   * `JWT_SECRET` – a random secret key for signing tokens
   * `CORS_ORIGIN` – your frontend URL (e.g. `https://your-frontend.vercel.app`)
   * `PORT` – usually `5000` (Render overrides this automatically).
5. Use `npm install` as the build command and `node server.js` as the start command.
6. Deploy and obtain the backend URL (e.g. `https://listing-backend.onrender.com`).

> You can also use Heroku, DigitalOcean App Platform, AWS, etc. The key is to expose the same environment variables.

---

## 2. Frontend (Vercel Example)

1. In your frontend directory (the React app), ensure `build.json` is present (specifies build commands for Vercel). Example:
   ```json
   {
     "buildCommand": "npm run build",
     "outputDirectory": "dist",
     "devCommand": "npm run dev",
     "installCommand": "npm install"
   }
   ```
2. Add `vercel.json` at the project root (shown above) to fix SPA routing.
3. Update `src/utils/api.js` to honor `VITE_API_URL`.
4. Commit and push the frontend code to GitHub.
5. Create a new project on Vercel, connecting to the repo.
6. In the Vercel dashboard, add the environment variable `VITE_API_URL` with your backend URL (e.g., `https://listing-backend.onrender.com/api`).
7. Add any other required environment variables (e.g. `NODE_ENV`).
8. Deploy. The application should be available at `https://your-frontend.vercel.app`.

---

## 3. Additional Notes

* **Local Development**: Use `.env` files for both backend and frontend.
  - `backend/.env`:
    ```env
    PORT=5000
    MONGODB_URI=mongodb+srv://<user>:<pass>@cluster0.mongodb.net/<db>?retryWrites=true&w=majority
    JWT_SECRET=some_secret
    CORS_ORIGIN=http://localhost:5173
    ```
  - `frontend/.env`:
    ```env
    VITE_API_URL=http://localhost:5000/api
    ```
* **CORS**: Ensure the backend allows the origin used by the frontend both locally and in production.
* **Rewrites**: Without the rewrite config, direct navigation or refreshes on client routes will return 404 on static hosts.
* If you need to change the API base URL after deployment, update the environment variable on your hosting service and redeploy.
* **Troubleshooting**: See `VERCEL_404_FIX.md` for SPA routing issues.

---

## 4. Reset after Undo

If you accidentally delete or revert configurations (e.g., `.env.example`, `vercel.json`, `build.json`, or documentation), re-create them using the contents above and commit the changes before redeploying.

---

Happy deploying! 🎉
