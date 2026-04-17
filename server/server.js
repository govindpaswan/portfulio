require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const path = require('path');
const multer = require('multer');
const rateLimit = require('express-rate-limit');

const app = express();

app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));

const allowedOrigins = [
  process.env.CLIENT_URL || 'http://localhost:5173',
  /\.onrender\.com$/,
  /localhost/
];
app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    const ok = allowedOrigins.some(o => typeof o === 'string' ? o === origin : o.test(origin));
    callback(null, ok);
  },
  credentials: true
}));

app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 500, standardHeaders: true, legacyHeaders: false }));
app.use(express.json({ limit: '15mb' }));
app.use(express.urlencoded({ extended: true, limit: '15mb' }));

// ── Static uploads directory ──────────────────────────────
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ── Multer — image upload ─────────────────────────────────
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, path.join(__dirname, 'uploads')),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `img-${Date.now()}${ext}`);
  },
});
const fileFilter = (req, file, cb) => {
  const allowed = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
  cb(null, allowed.includes(file.mimetype));
};
const upload = multer({ storage, fileFilter, limits: { fileSize: 5 * 1024 * 1024 } }); // 5MB

// Upload route (protected — requires auth token in header)
const auth = require('./middleware/auth');
app.post('/api/upload', auth, upload.single('image'), (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'No image file received.' });
    // Construct public URL
    const baseUrl = process.env.SERVER_URL || `http://localhost:${process.env.PORT || 5000}`;
    const url = `${baseUrl}/uploads/${req.file.filename}`;
    res.json({ url, filename: req.file.filename });
  } catch (err) {
    res.status(500).json({ message: 'Upload failed.' });
  }
});

// ── API Routes ────────────────────────────────────────────
app.use('/api/auth',      require('./routes/auth'));
app.use('/api/projects',  require('./routes/projects'));
app.use('/api/education', require('./routes/education'));
app.use('/api/reviews',   require('./routes/reviews'));
app.use('/api/contact',   require('./routes/contact'));

// ── Serve frontend in production ──────────────────────────
// Serve frontend - works for both single and separate deploy
const clientBuild = path.join(__dirname, '../client/dist');
const fs = require('fs');

if (fs.existsSync(clientBuild)) {
  app.use(express.static(clientBuild));
  app.get(/^(?!\/api|\/uploads).*/, (req, res) => {
    res.sendFile(path.join(clientBuild, 'index.html'));
  });
  console.log('✅ Serving frontend from', clientBuild);
} else {
  console.log('⚠️  No client/dist found - API only mode');
  app.get('/', (req, res) => res.json({ status: 'ok', message: '🚀 Portfolio API running' }));
}

// Error handler
app.use((err, req, res, next) => {
  if (err.code === 'LIMIT_FILE_SIZE') return res.status(400).json({ message: 'File too large. Max 5MB.' });
  console.error(err.stack);
  res.status(500).json({ message: 'Internal server error' });
});

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB connected');
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`🚀 Server on port ${PORT}`));
  })
  .catch(err => { console.error('❌ MongoDB failed:', err.message); process.exit(1); });
