# 🚀 MERN Portfolio + Admin Panel

A full-stack portfolio website built with MongoDB, Express, React, and Node.js — with a protected Admin Panel for managing all content.

---

## 📁 Folder Structure

```
portfolio-mern/
├── client/          ← React + Vite + Tailwind (Frontend)
└── server/          ← Node.js + Express + MongoDB (Backend)
```

---

## ⚙️ Quick Setup

### 1. Clone & install dependencies

```bash
# Install backend deps
cd server
npm install

# Install frontend deps
cd ../client
npm install
```

### 2. Configure environment variables

```bash
cd server
cp .env.example .env
```

Edit `.env` with your values:

```env
PORT=5000
MONGO_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/portfolio
JWT_SECRET=your_super_secret_key_here
ADMIN_EMAIL=admin@portfolio.com
ADMIN_PASSWORD=Admin@123
CLIENT_URL=http://localhost:5173
```

> **MongoDB Atlas:** Create a free cluster at [mongodb.com/atlas](https://www.mongodb.com/atlas), get your connection string, and paste it in `MONGO_URI`.

### 3. Run the project

**Terminal 1 — Backend:**
```bash
cd server
npm run dev
```

**Terminal 2 — Frontend:**
```bash
cd client
npm run dev
```

Open: [http://localhost:5173](http://localhost:5173)  
Admin Panel: [http://localhost:5173/admin](http://localhost:5173/admin)

---

## 🔐 Admin Login

Use the credentials you set in `.env`:
- **Email:** `ADMIN_EMAIL`
- **Password:** `ADMIN_PASSWORD`

The admin user is **auto-created** on first server start.

---

## 🌐 API Endpoints

### Auth
| Method | Route | Access |
|--------|-------|--------|
| POST | `/api/auth/login` | Public |
| GET | `/api/auth/verify` | Admin |

### Projects
| Method | Route | Access |
|--------|-------|--------|
| GET | `/api/projects` | Public |
| POST | `/api/projects` | Admin |
| PUT | `/api/projects/:id` | Admin |
| DELETE | `/api/projects/:id` | Admin |

### Education
| Method | Route | Access |
|--------|-------|--------|
| GET | `/api/education` | Public |
| POST | `/api/education` | Admin |
| PUT | `/api/education/:id` | Admin |
| DELETE | `/api/education/:id` | Admin |

### Reviews
| Method | Route | Access |
|--------|-------|--------|
| GET | `/api/reviews` | Public |
| POST | `/api/reviews` | Admin |
| PUT | `/api/reviews/:id` | Admin |
| DELETE | `/api/reviews/:id` | Admin |

### Contact
| Method | Route | Access |
|--------|-------|--------|
| POST | `/api/contact` | Public |
| GET | `/api/contact` | Admin |
| PATCH | `/api/contact/:id/read` | Admin |
| DELETE | `/api/contact/:id` | Admin |

---

## 🚀 Deployment

### Frontend → Vercel

1. Push `client/` to GitHub
2. Connect repo to [vercel.com](https://vercel.com)
3. Set **Build Command:** `npm run build`
4. Set **Output Directory:** `dist`
5. Add env variable: `VITE_API_URL=https://your-backend.onrender.com/api`

### Backend → Render

1. Push `server/` to GitHub (or root repo)
2. Create a **Web Service** at [render.com](https://render.com)
3. Set **Build Command:** `npm install`
4. Set **Start Command:** `node server.js`
5. Add all environment variables from `.env`

### MongoDB → Atlas

1. [mongodb.com/atlas](https://www.mongodb.com/atlas) → Create free M0 cluster
2. Create database user
3. Whitelist IP: `0.0.0.0/0` (allow all)
4. Copy connection string → paste in `MONGO_URI`

---

## 🎨 Customization

### Update your personal info
Edit these files with your real data:
- `client/src/pages/Home.jsx` — Name, role, tagline
- `client/src/pages/About.jsx` — Bio, skills, experience
- `client/src/components/Footer.jsx` — Social links

### Change color theme
Edit `client/tailwind.config.js`:
```js
colors: {
  primary: { DEFAULT: '#00d4ff' },  // Change accent color
  accent: '#8b5cf6',                // Change secondary color
}
```

---

## 🛡️ Security Features

- ✅ JWT authentication (24h expiry)
- ✅ bcrypt password hashing (12 rounds)
- ✅ Helmet.js security headers
- ✅ CORS restricted to frontend URL
- ✅ Global rate limiter (200 req/15min)
- ✅ Login rate limiter (10 attempts/15min)
- ✅ Contact form rate limiter (5 msgs/hour)
- ✅ Input validation on all routes
- ✅ Protected admin middleware

---

## 📦 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Vite, Tailwind CSS, Framer Motion |
| Backend | Node.js, Express.js |
| Database | MongoDB + Mongoose |
| Auth | JWT + bcryptjs |
| Security | Helmet, express-rate-limit, CORS |
| UI Fonts | Syne (display) + DM Sans (body) |
| Icons | React Icons |

---

## 💡 Features

### Public Portfolio
- Hero with animated sections
- About with skills and experience
- Education timeline (left-right alternating)
- Projects grid with filter (All / Featured)
- Reviews carousel + rating cards
- Contact form with validation

### Admin Panel
- JWT-protected login
- Manage Projects (Add/Edit/Delete)
- Manage Education (Add/Edit/Delete)
- Manage Reviews with star picker (Add/Edit/Delete)
- View Messages with unread badge, mark-as-read, reply via email
- Responsive sidebar with mobile overlay
- Toast notifications throughout
