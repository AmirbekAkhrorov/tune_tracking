const express = require('express');
const db = require('../db');
const { authenticateToken, requireAdmin } = require('../auth');
const { notify } = require('../notifier');

const router = express.Router();
router.use(authenticateToken);

router.get('/', (req, res) => {
  const { project, assignee, status } = req.query;
  let query = `
    SELECT t.*,
      u.full_name as assignee_name, u.avatar_initials, u.color as assignee_color, u.avatar_url as assignee_avatar_url,
      p.name as project_name, p.color as project_color, p.logo_url as project_logo
    FROM tasks t
    LEFT JOIN users u ON t.assigned_to = u.id
    LEFT JOIN projects p ON t.project_id = p.id
    WHERE 1=1
  `;
  const params = [];
  // Developers only see their own tasks
  if (req.user.role !== 'admin') {
    query += ' AND t.assigned_to = ?'; params.push(req.user.id);
  } else {
    if (project) { query += ' AND t.project_id = ?'; params.push(project); }
    if (assignee) { query += ' AND t.assigned_to = ?'; params.push(assignee); }
  }
  if (status) { query += ' AND t.status = ?'; params.push(status); }
  query += ' ORDER BY t.created_at DESC';

  res.json(db.prepare(query).all(...params));
});

router.post('/', requireAdmin, (req, res) => {
  const { title, description, status, priority, project_id, assigned_to, due_date, tags } = req.body;
  if (!title) return res.status(400).json({ error: 'Title is required' });

  const result = db.prepare(`
    INSERT INTO tasks (title, description, status, priority, project_id, assigned_to, due_date, tags)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    title,
    description || '',
    status || 'todo',
    priority || 'medium',
    project_id || null,
    assigned_to || null,
    due_date || null,
    JSON.stringify(tags || [])
  );

  const task = db.prepare(`
    SELECT t.*, u.full_name as assignee_name, u.avatar_initials, u.color as assignee_color, u.avatar_url as assignee_avatar_url,
      p.name as project_name, p.color as project_color, p.logo_url as project_logo
    FROM tasks t
    LEFT JOIN users u ON t.assigned_to = u.id
    LEFT JOIN projects p ON t.project_id = p.id
    WHERE t.id = ?
  `).get(result.lastInsertRowid);

  res.status(201).json(task);
});

router.put('/:id', (req, res) => {
  const task = db.prepare('SELECT * FROM tasks WHERE id = ?').get(req.params.id);
  if (!task) return res.status(404).json({ error: 'Task not found' });

  if (req.user.role !== 'admin') {
    if (task.assigned_to !== req.user.id) {
      return res.status(403).json({ error: 'Нет доступа к этой задаче' });
    }
    const { status } = req.body;
    if (!status) return res.status(400).json({ error: 'Статус обязателен' });
    // Developers: todo→progress or progress→review only
    const allowed = { todo: 'progress', progress: 'review' };
    if (allowed[task.status] !== status) {
      return res.status(403).json({ error: 'Недопустимый переход статуса' });
    }
    const setStarted = task.status === 'todo' && status === 'progress';
    // Auto-stop timer if running when finishing
    if (task.timer_start) {
      const elapsed = Math.floor((Date.now() - new Date(task.timer_start).getTime()) / 1000);
      const newTotal = (task.timer_total || 0) + elapsed;
      db.prepare('UPDATE tasks SET status = ?, timer_start = NULL, timer_total = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?')
        .run(status, newTotal, req.params.id);
    } else if (setStarted) {
      db.prepare('UPDATE tasks SET status = ?, started_at = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?')
        .run(status, new Date().toISOString(), req.params.id);
    } else {
      db.prepare('UPDATE tasks SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?')
        .run(status, req.params.id);
    }
  } else {
    const { title, description, status, priority, project_id, assigned_to, due_date, tags } = req.body;
    db.prepare(`
      UPDATE tasks SET
        title = COALESCE(?, title),
        description = COALESCE(?, description),
        status = COALESCE(?, status),
        priority = COALESCE(?, priority),
        project_id = COALESCE(?, project_id),
        assigned_to = COALESCE(?, assigned_to),
        due_date = COALESCE(?, due_date),
        tags = COALESCE(?, tags),
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).run(
      title || null,
      description || null,
      status || null,
      priority || null,
      project_id || null,
      assigned_to || null,
      due_date || null,
      tags ? JSON.stringify(tags) : null,
      req.params.id
    );
  }

  const updated = db.prepare(`
    SELECT t.*, u.full_name as assignee_name, u.avatar_initials, u.color as assignee_color, u.avatar_url as assignee_avatar_url,
      p.name as project_name, p.color as project_color, p.logo_url as project_logo
    FROM tasks t
    LEFT JOIN users u ON t.assigned_to = u.id
    LEFT JOIN projects p ON t.project_id = p.id
    WHERE t.id = ?
  `).get(req.params.id);

  // ── Notifications ──────────────────────────────────────
  const newStatus = updated.status;
  const devName   = updated.assignee_name || 'Разработчик';
  const taskTitle = updated.title;
  if (req.user.role !== 'admin') {
    if (newStatus === 'progress') {
      notify(`▶️ <b>${devName}</b> начал задачу:\n<i>${taskTitle}</i>`);
    } else if (newStatus === 'review') {
      notify(`✅ <b>${devName}</b> завершил задачу:\n<i>${taskTitle}</i>\n\nЖдёт проверки!`);
    }
  }

  res.json(updated);
});

// ── Timer: start ──────────────────────────────────────────────────────────────
router.post('/:id/timer/start', (req, res) => {
  const task = db.prepare('SELECT * FROM tasks WHERE id = ?').get(req.params.id);
  if (!task) return res.status(404).json({ error: 'Задача не найдена' });
  if (task.assigned_to !== req.user.id && req.user.role !== 'admin')
    return res.status(403).json({ error: 'Нет доступа' });
  if (task.timer_start) return res.status(400).json({ error: 'Таймер уже запущен' });

  db.prepare('UPDATE tasks SET timer_start = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?')
    .run(new Date().toISOString(), req.params.id);

  const updated = db.prepare(`
    SELECT t.*, u.full_name as assignee_name, u.avatar_initials, u.color as assignee_color, u.avatar_url as assignee_avatar_url,
      p.name as project_name, p.color as project_color, p.logo_url as project_logo
    FROM tasks t LEFT JOIN users u ON t.assigned_to = u.id LEFT JOIN projects p ON t.project_id = p.id
    WHERE t.id = ?`).get(req.params.id);

  notify(`⏱ <b>${updated.assignee_name||'Разработчик'}</b> запустил таймер:\n<i>${updated.title}</i>`);
  res.json(updated);
});

// ── Timer: pause ──────────────────────────────────────────────────────────────
router.post('/:id/timer/pause', (req, res) => {
  const task = db.prepare('SELECT * FROM tasks WHERE id = ?').get(req.params.id);
  if (!task) return res.status(404).json({ error: 'Задача не найдена' });
  if (task.assigned_to !== req.user.id && req.user.role !== 'admin')
    return res.status(403).json({ error: 'Нет доступа' });
  if (!task.timer_start) return res.status(400).json({ error: 'Таймер не запущен' });

  const elapsed = Math.floor((Date.now() - new Date(task.timer_start).getTime()) / 1000);
  const newTotal = (task.timer_total || 0) + elapsed;

  db.prepare('UPDATE tasks SET timer_start = NULL, timer_total = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?')
    .run(newTotal, req.params.id);

  const updated = db.prepare(`
    SELECT t.*, u.full_name as assignee_name, u.avatar_initials, u.color as assignee_color, u.avatar_url as assignee_avatar_url,
      p.name as project_name, p.color as project_color, p.logo_url as project_logo
    FROM tasks t LEFT JOIN users u ON t.assigned_to = u.id LEFT JOIN projects p ON t.project_id = p.id
    WHERE t.id = ?`).get(req.params.id);
  res.json(updated);
});

router.delete('/:id', requireAdmin, (req, res) => {
  const task = db.prepare('SELECT * FROM tasks WHERE id = ?').get(req.params.id);
  if (!task) return res.status(404).json({ error: 'Task not found' });
  db.prepare('DELETE FROM tasks WHERE id = ?').run(req.params.id);
  res.json({ message: 'Task deleted successfully' });
});

module.exports = router;
