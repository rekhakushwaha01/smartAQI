const express = require('express');
const cors = require('cors');
const multer = require('multer');
const postModel = require('./models/post.model');
const uploadFile = require('./services/storage.service');
const authRoutes = require('./routes/auth.routes');
const healthRoutes = require('./routes/health.routes');
const aqiRoutes = require('./routes/aqi.routes');
const weatherRoutes = require('./routes/weather.routes');
const doctorsRoutes = require('./routes/doctors.routes');
const statusRoutes = require('./routes/status.routes');
const citiesRoutes = require('./routes/cities.routes');
const config = require('./config/env');

const app = express();

app.use(cors({ origin: true, credentials: true }));
app.use(express.json({ limit: '2mb' }));

app.get('/api/health-check', (_req, res) => {
  res.json({ ok: true, service: 'smart-aqi-backend' });
});
app.use('/api/status', statusRoutes);

app.use('/api/auth', authRoutes);
app.use('/api/health', healthRoutes);
app.use('/api/aqi', aqiRoutes);
app.use('/api/weather', weatherRoutes);
app.use('/api/doctors', doctorsRoutes);
app.use('/api/cities', citiesRoutes);

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
});

app.post('/create-post', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Image file is required' });
    }
    const result = await uploadFile(req.file.buffer);
    const post = await postModel.create({
      image: result.url,
      caption: req.body.caption || '',
    });
    res.status(201).json({
      message: 'Post created successfully',
      post,
    });
  } catch (error) {
    res.status(500).json({ message: error.message || 'Upload failed' });
  }
});

app.get('/posts', async (req, res) => {
  const posts = await postModel.find();
  return res.json({
    message: 'post fetched successfully',
    posts,
  });
});

module.exports = app;
