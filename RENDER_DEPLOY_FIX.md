# 🚀 Render Deployment Fix — Data Not Showing

## Problem
Admin se add kiya data frontend pe nahi dikh rha — ye tab hota hai jab:
- Frontend: Static Site (`portfollio-client.onrender.com`)
- Backend: Web Service (`portfollio-api.onrender.com`)

Frontend ki API calls `/api` ko apne hi domain pe jaati hain, backend server pe nahi.

## ✅ Fix — Option A: Same Service Deploy (Recommended)

**Server already frontend serve karta hai production me.**

Render pe ek hi **Web Service** banao:
```
Name: portfollio
Build Command: cd client && npm install && npm run build
Start Command: cd server && npm install && npm start
Root Directory: (khali rakhao)
```

Environment Variables:
```
MONGO_URI=mongodb+srv://...
JWT_SECRET=your_secret_key
NODE_ENV=production
PORT=10000
```

Ab ek hi URL hoga, sab kuch kaam karega! ✅

---

## ✅ Fix — Option B: Separate Services

Agar frontend Static Site alag hai, to:

1. Render Static Site ke **Environment** me jao
2. Add variable:
   ```
   VITE_API_URL = https://your-backend-name.onrender.com/api
   ```
3. Static Site ko **Redeploy** karo

---

## 🔐 Admin Panel URL
`https://your-site.onrender.com/admin`

Default credentials: jo aapne `.env` me set kiye hain
