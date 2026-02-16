const express = require('express');
const db = require('../db');
const TG_KEY = process.env.TG_KEY || 'tune2026tg';

const router = express.Router();

// Simple key-based auth — no JWT needed for read-only bot view
router.use((req, res, next) => {
  if (req.query.key !== TG_KEY) return res.status(401).json({ error: 'Unauthorized' });
  next();
});

router.get('/dashboard', (req, res) => {
  // Stats
  const total    = db.prepare("SELECT COUNT(*) as n FROM tasks").get().n;
  const progress = db.prepare("SELECT COUNT(*) as n FROM tasks WHERE status='progress'").get().n;
  const review   = db.prepare("SELECT COUNT(*) as n FROM tasks WHERE status='review'").get().n;
  const done     = db.prepare("SELECT COUNT(*) as n FROM tasks WHERE status='done'").get().n;

  // Developers with their active task
  const developers = db.prepare(
    "SELECT id, full_name, avatar_initials, color, avatar_url, job_title FROM users WHERE role='developer' ORDER BY id ASC"
  ).all().map(u => {
    const tasks = db.prepare(`
      SELECT t.id, t.title, t.status, t.priority, t.timer_start, t.timer_total, t.started_at,
             p.name as project_name, p.color as project_color
      FROM tasks t LEFT JOIN projects p ON t.project_id = p.id
      WHERE t.assigned_to = ? ORDER BY t.updated_at DESC
    `).all(u.id);

    const activeTask = tasks.find(t => t.status === 'progress') || null;
    const doneCount  = tasks.filter(t => t.status === 'done').length;
    const totalCount = tasks.length;

    return { ...u, active_task: activeTask, done_count: doneCount, total_count: totalCount, tasks };
  });

  // Recent activity (last 12 tasks updated)
  const recent = db.prepare(`
    SELECT t.id, t.title, t.status, t.priority, t.updated_at, t.started_at,
           t.timer_total, t.timer_start,
           u.full_name as dev_name, u.color as dev_color, u.avatar_initials,
           p.name as project_name
    FROM tasks t
    LEFT JOIN users u ON t.assigned_to = u.id
    LEFT JOIN projects p ON t.project_id = p.id
    ORDER BY t.updated_at DESC LIMIT 12
  `).all();

  res.json({ stats: { total, progress, review, done }, developers, recent });
});

module.exports = router;
