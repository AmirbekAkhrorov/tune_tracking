const express = require('express');
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const db = require('../db');
const { authenticateToken, requireAdmin } = require('../auth');

const router = express.Router();
router.use(authenticateToken);

// Ensure avatars directory exists
const avatarsDir = path.join(__dirname, '../../data/avatars');
if (!fs.existsSync(avatarsDir)) fs.mkdirSync(avatarsDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, avatarsDir),
  destination: (req, file, cb) => cb(null, avatarsDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase() || '.jpg';
    cb(null, `user_${req.params.id}${ext}`);
  },
});
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith('image/')) return cb(new Error('Only images allowed'));
    cb(null, true);
  },
});

router.get('/', (req, res) => {
  const users = db.prepare(
    'SELECT id, username, full_name, role, avatar_initials, job_title, color, avatar_url FROM users ORDER BY id ASC'
  ).all();
  res.json(users);
});

// POST /api/users/:id/avatar  — admin only
router.post('/:id/avatar', requireAdmin, (req, res) => {
  // Remove old avatar file for this user first
  const existing = db.prepare('SELECT avatar_url FROM users WHERE id = ?').get(req.params.id);
  if (existing && existing.avatar_url) {
    const oldFile = path.join(__dirname, '../../data', existing.avatar_url.replace('/avatars/', 'avatars/'));
    try { fs.unlinkSync(oldFile); } catch (_) {}
  }

  upload.single('avatar')(req, res, (err) => {
    if (err) return res.status(400).json({ error: err.message });
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

    const avatarUrl = `/avatars/${req.file.filename}`;
    db.prepare('UPDATE users SET avatar_url = ? WHERE id = ?').run(avatarUrl, req.params.id);
    const user = db.prepare('SELECT id, username, full_name, role, avatar_initials, job_title, color, avatar_url FROM users WHERE id = ?').get(req.params.id);
    res.json(user);
  });
});

module.exports = router;
