const express = require('express');
const db = require('../db');
const { authenticateToken } = require('../auth');

const router = express.Router();
router.use(authenticateToken);

router.get('/stats', (req, res) => {
  const isAdmin = req.user.role === 'admin';
  const uid = req.user.id;
  const where = isAdmin ? '' : ' WHERE assigned_to = ' + uid;
  const and   = isAdmin ? '' : ' AND assigned_to = ' + uid;

  const total      = db.prepare('SELECT COUNT(*) as count FROM tasks' + where).get().count;
  const inProgress = db.prepare("SELECT COUNT(*) as count FROM tasks WHERE status = 'progress'" + and).get().count;
  const highPriority = db.prepare("SELECT COUNT(*) as count FROM tasks WHERE priority = 'high' AND status != 'done'" + and).get().count;
  const done       = db.prepare("SELECT COUNT(*) as count FROM tasks WHERE status = 'done'" + and).get().count;
  const completionPct = total > 0 ? Math.round((done / total) * 100) : 0;

  const devWorkload = db.prepare(`
    SELECT u.id, u.full_name, u.avatar_initials, u.color, u.job_title,
      COUNT(t.id) as total_tasks,
      SUM(CASE WHEN t.status = 'done' THEN 1 ELSE 0 END) as done_tasks,
      SUM(CASE WHEN t.status = 'progress' THEN 1 ELSE 0 END) as active_tasks
    FROM users u
    LEFT JOIN tasks t ON u.id = t.assigned_to
    WHERE u.role = 'developer'
    GROUP BY u.id
    ORDER BY active_tasks DESC
  `).all();

  res.json({ total, inProgress, highPriority, completionPct, devWorkload });
});

module.exports = router;
