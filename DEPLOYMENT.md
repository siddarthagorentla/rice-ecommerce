# Deployment Guide (Render.com)

This guide explains how to deploy the Rice Traceability App (Frontend + Backend) using [Render](https://render.com).

## Prerequisites
1.  You have pushed this code to a GitHub repository (which you just did!).
2.  Sign up for a free account on [Render.com](https://render.com).

---

## Step 1: Deploy the Backend (Web Service)

1.  Click **"New +"** and select **"Web Service"**.
2.  Connect your GitHub repository (`rice-ecommerce`).
3.  **Name:** `rice-app-backend` (or similar).
4.  **Region:** Choose one close to you (e.g., Singapore, Frankfurt, Oregon).
5.  **Branch:** `main`.
6.  **Root Directory:** `backend` (Important! This tells Render the app is in the backend folder).
7.  **Runtime:** `Node`.
8.  **Build Command:** `npm install`.
9.  **Start Command:** `npm start`.
10. **Environment Variables:**
    *   Scroll down to "Environment Variables".
    *   Add Key: `GEMINI_API_KEY`
    *   Add Value: (Paste your actual Google Gemini API Key here).
11. Click **"Create Web Service"**.

*Wait for the deployment to finish. Once done, copy the **onrender.com URL** (e.g., `https://rice-app-backend.onrender.com`). You will need this for the frontend.*

---

## Step 2: Deploy the Frontend (Static Site)

1.  Go to your Dashboard, click **"New +"** and select **"Static Site"**.
2.  Connect the SAME GitHub repository (`rice-ecommerce`).
3.  **Name:** `rice-app-frontend` (or similar).
4.  **Branch:** `main`.
5.  **Root Directory:** `.` (Leave empty or dot).
6.  **Build Command:** `npm run build`.
7.  **Publish Directory:** `dist`.
8.  **Environment Variables:**
    *   Add Key: `VITE_API_URL`
    *   Add Value: Paste the Backend URL you copied in Step 1 (e.g., `https://rice-app-backend.onrender.com`). **Do not add a trailing slash.**
9.  Click **"Create Static Site"**.

---

## Step 3: Verify

1.  Once the Frontend is deployed, click the URL provided by Render (e.g., `https://rice-app-frontend.onrender.com`).
2.  Test the **Traceability** feature (try entering a batch ID).
3.  Test the **Price Estimator** (it should connect to your backend).

## Troubleshooting

*   **CORS Errors:** If the frontend says "Network Error" or you see CORS issues in the console:
    *   Go to your Backend code (`backend/server.js`).
    *   Ensure `app.use(cors())` is present (it is by default in this project).
    *   If you restricted origins, make sure to add your new Frontend URL to the allowed origins.
*   **500 Errors:** Check the "Logs" tab in your Render Backend dashboard to see if the server crashed or if the API Key is invalid.
