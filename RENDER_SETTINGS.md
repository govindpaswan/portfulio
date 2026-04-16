# 🔧 Render Dashboard Settings — Exactly Yahi Set Karo

## Step 1 — Render pe apni Web Service open karo

## Step 2 — Settings tab pe jao

## Step 3 — Build & Deploy section mein YE values set karo:

| Field | Value |
|-------|-------|
| **Root Directory** | *(KHALI RAKHAO — kuch mat likhna)* |
| **Build Command** | `npm run build` |
| **Start Command** | `npm start` |

## Step 4 — Environment Variables mein ye daalo:

| Key | Value |
|-----|-------|
| `NODE_ENV` | `production` |
| `PORT` | `10000` |
| `MONGO_URI` | `mongodb+srv://...` (apna) |
| `JWT_SECRET` | `koi_bhi_secret_string` |
| `ADMIN_EMAIL` | `admin@portfolio.com` |
| `ADMIN_PASSWORD` | `apna_password` |

## Step 5 — "Save Changes" → "Manual Deploy" → "Deploy latest commit"

---

## ✅ Kaise Kaam Karta Hai
Root `package.json` ka `build` script:
1. Server dependencies install karta hai
2. Client dependencies install karta hai  
3. Vite se React build karta hai → `client/dist/` folder mein
4. Express server `client/dist/` serve karta hai

Ek hi URL pe sab kuch kaam karega!

---

## Admin Panel
`https://your-site.onrender.com/admin`
