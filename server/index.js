require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const express = require('express');
const cors = require('cors');
const path = require('path');

const db = require('./db');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Serve uploaded avatars
app.use('/avatars', express.static(path.join(__dirname, '../data/avatars')));

// Telegram Mini App — served before SPA catch-all
app.get('/tg', (req, res) => {
  res.sendFile(path.join(__dirname, 'tg-app.html'));
});

// Routes are wired once DB is ready
const authRoutes = require('./routes/auth');
const taskRoutes = require('./routes/tasks');
const projectRoutes = require('./routes/projects');
const userRoutes = require('./routes/users');
const dashboardRoutes = require('./routes/dashboard');
const tgRoutes = require('./routes/tg');

app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/users', userRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/tg', tgRoutes);

// Serve built frontend in production
if (process.env.NODE_ENV === 'production') {
  const distPath = path.join(__dirname, '../client/dist');
  app.use(express.static(distPath));
  app.get('*', (req, res) => {
    res.sendFile(path.join(distPath, 'index.html'));
  });
}

// Wait for DB init, then start server + bot
db.ready
  .then(() => {
    app.listen(PORT, () => {
      console.log(`\n  TUNE Task Tracker`);
      console.log(`  Server:  http://localhost:${PORT}`);
      console.log(`  Mini App: http://localhost:${PORT}/tg?key=tune2026tg`);
      console.log(`  Mode:    ${process.env.NODE_ENV || 'development'}\n`);
    });
    // Start Telegram bot
    try {
      const { startBot } = require('./bot');
      startBot();
    } catch(e) {
      console.warn('  Bot failed to start:', e.message);
    }
    // Prevent unhandled bot errors from crashing the server
    process.on('unhandledRejection', (err) => {
      if (err && err.constructor && err.constructor.name === 'TelegramError') {
        console.warn('  Bot error (non-fatal):', err.message);
      }
    });
  })
  .catch(err => {
    console.error('Failed to initialize database:', err);
    process.exit(1);
  });
