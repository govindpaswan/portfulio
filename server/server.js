require('dotenv').config();
const express  = require('express');
const mongoose = require('mongoose');
const cors     = require('cors');
const helmet   = require('helmet');
const path     = require('path');
const fs       = require('fs');
const multer   = require('multer');
const { execSync } = require('child_process');

const app = express();

/* ─────────────────────────────────────────────────────────
   AUTO-BUILD CLIENT if dist doesn't exist
   This runs FIRST so frontend is always available
───────────────────────────────────────────────────────── */
const clientDistPath = path.join(__dirname, '../client/dist');
const clientIndexPath = path.join(clientDistPath, 'index.html');

if (!fs.existsSync(clientIndexPath)) {
  console.log('📦 client/dist not found — building frontend now...');
  try {
    const clientDir = path.join(__dirname, '../client');
    if (fs.existsSync(clientDir)) {
      execSync('npm install', { cwd: clientDir, stdio: 'inherit' });
      execSync('npm run build', { cwd: clientDir, stdio: 'inherit' });
      console.log('✅ Frontend built successfully!');
    }
  } catch (e) {
    console.error('⚠️  Frontend build failed:', e.message);
  }
}

/* ─────────────────────────────────────────────────────────
   SECURITY & MIDDLEWARE
───────────────────────────────────────────────────────── */
app.use(helmet({ contentSecurityPolicy: false, crossOriginResourcePolicy: false }));

// CORS — allow all onrender.com + localhost
app.use(cors({
  origin: (origin, cb) => cb(null, true), // allow all in production
  credentials: true,
  methods: ['GET','POST','PUT','PATCH','DELETE','OPTIONS'],
  allowedHeaders: ['Content-Type','Authorization'],
}));
app.options('*', cors());

app.use(express.json({ limit: '15mb' }));
app.use(express.urlencoded({ extended: true, limit: '15mb' }));

/* ─────────────────────────────────────────────────────────
   FILE UPLOAD — multer
───────────────────────────────────────────────────────── */
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

app.use('/uploads', express.static(uploadsDir));

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadsDir),
  filename:    (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `img-${Date.now()}${ext}`);
  },
});
const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    cb(null, ['image/jpeg','image/jpg','image/png','image/gif','image/webp'].includes(file.mimetype));
  },
  limits: { fileSize: 5 * 1024 * 1024 },
});

const auth = require('./middleware/auth');

// Image upload endpoint
app.post('/api/upload', auth, upload.single('image'), (req, res) => {
  if (!req.file) return res.status(400).json({ message: 'No image received.' });
  const base = process.env.SERVER_URL || `https://portfulio-server.onrender.com`;
  res.json({ url: `${base}/uploads/${req.file.filename}` });
});

/* ─────────────────────────────────────────────────────────
   API ROUTES
───────────────────────────────────────────────────────── */
app.use('/api/auth',      require('./routes/auth'));
app.use('/api/projects',  require('./routes/projects'));
app.use('/api/education', require('./routes/education'));
app.use('/api/reviews',   require('./routes/reviews'));
app.use('/api/contact',   require('./routes/contact'));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString(), mongo: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected' });
});

/* ─────────────────────────────────────────────────────────
   SERVE FRONTEND
───────────────────────────────────────────────────────── */
if (fs.existsSync(clientIndexPath)) {
  app.use(express.static(clientDistPath));
  app.get(/^(?!\/api|\/uploads).*/, (req, res) => {
    res.sendFile(clientIndexPath);
  });
  console.log('✅ Serving frontend from client/dist');
} else {
  app.get('/', (req, res) => res.json({ status: 'ok', message: 'API running — frontend build failed' }));
}

/* ─────────────────────────────────────────────────────────
   ERROR HANDLER
───────────────────────────────────────────────────────── */
app.use((err, req, res, next) => {
  if (err.code === 'LIMIT_FILE_SIZE') return res.status(400).json({ message: 'File too large. Max 5MB.' });
  console.error('Server error:', err.message);
  res.status(500).json({ message: 'Internal server error' });
});

/* ─────────────────────────────────────────────────────────
   CONNECT MONGODB & START
───────────────────────────────────────────────────────── */
mongoose.connect(process.env.MONGO_URI, {
  serverSelectionTimeoutMS: 10000,
})
  .then(() => {
    console.log('✅ MongoDB connected');
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`🌍 URL: ${process.env.SERVER_URL || 'http://localhost:' + PORT}`);
    });
  })
  .catch(err => {
    console.error('❌ MongoDB connection failed:', err.message);
    process.exit(1);
  });
