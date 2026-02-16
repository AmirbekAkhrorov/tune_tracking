const path = require('path');
const fs = require('fs');
const bcrypt = require('bcrypt');

const dataDir = path.join(__dirname, '../data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const dbPath = path.join(dataDir, 'tracker.db');

// ─── SQL.js wrapper ───────────────────────────────────────────────────────────
// Provides a better-sqlite3-compatible synchronous API on top of sql.js.
// Routes require this module and call db.prepare(sql).get/all/run() exactly
// as they would with better-sqlite3. The only difference is that db.ready
// must resolve before the server starts accepting requests (handled in index.js).

class Db {
  constructor() {
    this._sql = null;
    this.ready = this._init();
  }

  async _init() {
    const initSqlJs = require('sql.js');
    const SQL = await initSqlJs();

    if (fs.existsSync(dbPath)) {
      const buf = fs.readFileSync(dbPath);
      this._sql = new SQL.Database(buf);
    } else {
      this._sql = new SQL.Database();
    }

    this._createTables();
    this._save();
    await this._seedIfEmpty();
  }

  _save() {
    const data = this._sql.export();
    fs.writeFileSync(dbPath, Buffer.from(data));
  }

  _createTables() {
    this._sql.run(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        full_name TEXT NOT NULL,
        role TEXT NOT NULL DEFAULT 'developer',
        avatar_initials TEXT,
        job_title TEXT,
        color TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);
    this._sql.run(`
      CREATE TABLE IF NOT EXISTS projects (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        color TEXT,
        description TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);
    this._sql.run(`
      CREATE TABLE IF NOT EXISTS tasks (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        description TEXT,
        status TEXT DEFAULT 'todo',
        priority TEXT DEFAULT 'medium',
        project_id INTEGER REFERENCES projects(id),
        assigned_to INTEGER REFERENCES users(id),
        due_date TEXT,
        tags TEXT DEFAULT '[]',
        timer_start TEXT DEFAULT NULL,
        timer_total INTEGER DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);
    // Migrate existing DB — safe no-op if columns already exist
    try { this._sql.run('ALTER TABLE tasks ADD COLUMN timer_start TEXT DEFAULT NULL'); } catch(e) {}
    try { this._sql.run('ALTER TABLE tasks ADD COLUMN timer_total INTEGER DEFAULT 0'); } catch(e) {}
    try { this._sql.run('ALTER TABLE tasks ADD COLUMN started_at TEXT DEFAULT NULL'); } catch(e) {}
    try { this._sql.run('ALTER TABLE users ADD COLUMN avatar_url TEXT DEFAULT NULL'); } catch(e) {}
  }

  async _seedIfEmpty() {
    // No seed data — real company data will be added via the app
  }

  // ─── Public better-sqlite3-compatible API ──────────────────────────────────

  pragma(str) {
    this._sql.run(`PRAGMA ${str}`);
  }

  exec(sql) {
    this._sql.exec(sql);
    this._save();
  }

  prepare(sql) {
    const self = this;
    return {
      get(...args) {
        const params = args.flat();
        const stmt = self._sql.prepare(sql);
        if (params.length > 0) stmt.bind(params);
        let row;
        if (stmt.step()) row = stmt.getAsObject();
        stmt.free();
        return row;
      },
      all(...args) {
        const params = args.flat();
        const stmt = self._sql.prepare(sql);
        if (params.length > 0) stmt.bind(params);
        const rows = [];
        while (stmt.step()) rows.push(stmt.getAsObject());
        stmt.free();
        return rows;
      },
      run(...args) {
        const params = args.flat();
        const stmt = self._sql.prepare(sql);
        if (params.length > 0) stmt.bind(params);
        stmt.step();
        stmt.free();
        const rowsModified = self._sql.getRowsModified();
        const lastStmt = self._sql.prepare('SELECT last_insert_rowid() as id');
        lastStmt.step();
        const { id } = lastStmt.getAsObject();
        lastStmt.free();
        self._save();
        return { lastInsertRowid: id, changes: rowsModified };
      },
    };
  }
}

module.exports = new Db();
