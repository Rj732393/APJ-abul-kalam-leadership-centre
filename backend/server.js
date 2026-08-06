// server.js
import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

import settingsRoutes from './routes/settingsRoutes.js';
import boardRoutes from './routes/boardRoutes.js';
import galleryRoutes from './routes/galleryRoutes.js';
import newsRoutes from './routes/newsRoutes.js';
import programRoutes from './routes/programRoutes.js';
import authRoutes from './routes/authRoutes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// uploaded images ko publicly serve karne ke liye
// browser me: http://localhost:5000/uploads/<filename> se photo khulegi
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// API routes
app.use('/api/settings', settingsRoutes);
app.use('/api/board', boardRoutes);
app.use('/api/gallery', galleryRoutes);
app.use('/api/news', newsRoutes);
app.use('/api/programs', programRoutes);
app.use('/api/auth', authRoutes);

app.get('/', (req, res) => {
  res.send('APJ Abdul Kalam Centre - API is running ✅');
});

// error handler (multer file-type errors yahan aayenge)
app.use((err, req, res, next) => {
  console.error(err);
  res.status(400).json({ error: err.message || 'Something Went Wrong' });
});

app.listen(PORT, () => {
  console.log(`🚀 Server is running: http://localhost:${PORT}`);
});
