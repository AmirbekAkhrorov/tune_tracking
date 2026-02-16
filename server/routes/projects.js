const express = require('express');
const db = require('../db');
const { authenticateToken, requireAdmin } = require('../auth');

const router = express.Router();
router.use(authenticateToken);

router.get('/', (req, res) => {
  res.json(db.prepare('SELECT * FROM projects ORDER BY created_at ASC').all());
});

router.post('/', requireAdmin, (req, res) => {
  const { name, color, description } = req.body;
  if (!name) return res.status(400).json({ error: 'Name is required' });

  const result = db.prepare(
    'INSERT INTO projects (name, color, description) VALUES (?, ?, ?)'
  ).run(name, color || '#3B82F6', description || '');

  res.status(201).json(db.prepare('SELECT * FROM projects WHERE id = ?').get(result.lastInsertRowid));
});

module.exports = router;
