# ⚠️ ADMIN DATA FRONTEND PE NAHI DIKH RAHA — YE KARO

## Problem
Aapka setup:
- Frontend: `portfollio-client.onrender.com` (Static Site)
- Backend: `portfollio-server.onrender.com` (Web Service)

Jab frontend form submit karta hai, API call `/api` pe jaati hai —
lekin Static Site pe koi server nahi hota. Isliye data save bhi nahi hota.

---

## ✅ FIX — Render Static Site pe VITE_API_URL Set Karo

**Step 1:** Render Dashboard → `portfollio-client` (Static Site) pe click karo

**Step 2:** Left sidebar → **Environment** pe click karo

**Step 3:** "Add Environment Variable" click karo:
```
Key:   VITE_API_URL
Value: https://portfollio-server.onrender.com/api
```
(apna actual backend URL daalo — jo `.onrender.com` wala hai)

**Step 4:** **Save Changes** click karo

**Step 5:** Static Site automatically redeploy hoga — wait karo

**Step 6:** Ab test karo — data dikhna chahiye ✅

---

## Alternative: Ek hi Service pe Deploy (Best Option)

Render pe **ek naya Web Service** banao:
```
Service Type: Web Service
Repository: apni same repo
Root Directory: server
Build Command: npm install && cd ../client && npm install && npm run build
Start Command: npm start
```

Environment Variables (saare add karo):
```
NODE_ENV=production
PORT=10000
MONGO_URI=mongodb+srv://...
JWT_SECRET=koi_bhi_secret
ADMIN_EMAIL=admin@portfolio.com
ADMIN_PASSWORD=aapka_password
```

Is ek URL se sab kaam karega — frontend + backend ek saath! ✅

---

## Admin Panel URL
`https://your-site.onrender.com/admin`

## Check Karo API Kaam Kar Rahi Hai
Browser mein open karo:
`https://your-backend.onrender.com/api/projects`

Agar `[]` ya projects ka data aaye → backend theek hai ✅
Agar error aaye → MONGO_URI check karo
