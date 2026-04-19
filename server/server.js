require('dotenv').config();
const express  = require('express');
const mongoose = require('mongoose');
const cors     = require('cors');
const helmet   = require('helmet');
const path     = require('path');
const fs       = require('fs');
const multer   = require('multer');

const app = express();

/* ─── CORS — allow ALL origins (fixes cross-domain API calls) ─── */
app.use(cors({
  origin: '*',
  methods: ['GET','POST','PUT','PATCH','DELETE','OPTIONS'],
  allowedHeaders: ['Content-Type','Authorization'],
  credentials: false,
}));
app.options('*', cors());

app.use(helmet({
  contentSecurityPolicy: false,
  crossOriginResourcePolicy: { policy: 'cross-origin' },
  crossOriginOpenerPolicy: false,
}));

app.use(express.json({ limit: '15mb' }));
app.use(express.urlencoded({ extended: true, limit: '15mb' }));

/* ─── Static uploads ─── */
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });
app.use('/uploads', express.static(uploadsDir));

/* ─── Multer image upload ─── */
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadsDir),
  filename:    (req, file, cb) => cb(null, `img-${Date.now()}${path.extname(file.originalname).toLowerCase()}`),
});
const upload = multer({
  storage,
  fileFilter: (req, file, cb) => cb(null, ['image/jpeg','image/jpg','image/png','image/gif','image/webp'].includes(file.mimetype)),
  limits: { fileSize: 5 * 1024 * 1024 },
});

const auth = require('./middleware/auth');
app.post('/api/upload', auth, upload.single('image'), (req, res) => {
  if (!req.file) return res.status(400).json({ message: 'No image received.' });
  const base = process.env.SERVER_URL || 'https://portfulio-server.onrender.com';
  res.json({ url: `${base}/uploads/${req.file.filename}` });
});

/* ─── API Routes ─── */
app.use('/api/auth',      require('./routes/auth'));
app.use('/api/projects',  require('./routes/projects'));
app.use('/api/education', require('./routes/education'));
app.use('/api/reviews',   require('./routes/reviews'));
app.use('/api/contact',   require('./routes/contact'));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', mongo: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected' });
});

/* ─── Serve frontend (if built together) ─── */
const clientBuild = path.join(__dirname, '../client/dist');
if (fs.existsSync(path.join(clientBuild, 'index.html'))) {
  app.use(express.static(clientBuild));
  app.get(/^(?!\/api|\/uploads).*/, (req, res) => {
    res.sendFile(path.join(clientBuild, 'index.html'));
  });
  console.log('✅ Serving frontend from client/dist');
} else {
  app.get('/', (req, res) => res.json({ status: 'ok', message: 'GovindPortfolio API running 🚀' }));
  console.log('ℹ️  API-only mode (no client/dist)');
}

/* ─── Error handler ─── */
app.use((err, req, res, next) => {
  if (err.code === 'LIMIT_FILE_SIZE') return res.status(400).json({ message: 'File too large. Max 5MB.' });
  console.error(err.message);
  res.status(500).json({ message: 'Internal server error' });
});

/* ─── Start ─── */
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB connected');
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, '0.0.0.0', () => console.log(`🚀 Server on port ${PORT}`));
  })
  .catch(err => { console.error('❌ MongoDB failed:', err.message); process.exit(1); });
