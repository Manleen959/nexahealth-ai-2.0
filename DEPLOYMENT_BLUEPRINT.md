# NexaHealth AI 2.0 Deployment Blueprint

### **Phase 1: Your Live Database (MongoDB Atlas)**
1.  **Register**: Create a free account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2.  **Create Cluster**: Choose "Shared" (Free tier).
3.  **Network Access**: Under "Network Access", choose "Allow Access from Anywhere" (for testing) or add Render's IP.
4.  **Database Access**: Create a user with a password (e.g., `admin` / `password123`).
5.  **Get URI**: Click "Connect" -> "Connect your application" -> Choose Node.js.
    *   **Example URI**: `mongodb+srv://admin:password123@cluster.mongodb.net/NexaDB?retryWrites=true&w=majority`

---

### **Phase 2: Live Backend (Render.com)**
1.  **Repo**: Create a new GitHub Repository named `nexahealth-ai-2.0` and push the **entire project** (both `backend/` and `frontend/` folders) inside it.
2.  **Deploy**: On [Render](https://render.com), create a **Web Service**.
3.  **Config**:
    *   **Root Directory**: `backend` (This is very important!)
    *   **Build Command**: `npm install`
    *   **Start Command**: `node server.js`
4.  **Environment Variables**:
    *   `MONGODB_URI`: (Your Atlas URI from Phase 1)
    *   `JWT_SECRET`: `NXAI-SECRET-8829-PX`
    *   `NVIDIA_API_KEY`: `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`
    *   `NODE_ENV`: `production`
5.  **Copy Live URL**: It will look like `https://backend-xyz.onrender.com`.

---

### **Phase 3: Live Website (Netlify)**
1.  **Repo**: Connect the SAME GitHub Repo `nexahealth-ai-2.0` to Netlify.
2.  **Build Settings**:
    *   **Base Directory**: `frontend` (This is critical!)
    *   **Build Command**: `npm run build`
    *   **Publish Directory**: `dist` 
3.  **Environment Variables**:
    *   **`VITE_API_URL`**: (Paste your Live Render URL from Phase 2 + `/api`)
        *   e.g., `https://backend-xyz.onrender.com/api`
4.  **Deployed!**: Your site is now live.

---

### **Preparation Done for You**
I have already:
- [x] Initialized **Git** in your project folder.
- [x] Created **`.gitignore`** to secure your credentials.
- [x] Created **`frontend/public/_redirects`** for React stability.
- [x] Updated **`backend/server.js`** to handle production server ports.

> [!TIP]
> **Checklist for Success**:
> - Ensure your `VITE_API_URL` does NOT end with a `/` (e.g., use `/api` not `/api/`).
> - Make sure you use the NVIDIA key I prioritized in the backend config.
