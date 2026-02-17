import React, { useState, useEffect, useCallback } from 'react'
import Header from '../components/Header.jsx'
import StatsBar from '../components/StatsBar.jsx'
import FilterBar from '../components/FilterBar.jsx'
import BoardView from '../components/BoardView.jsx'
import TeamView from '../components/TeamView.jsx'
import AddTaskModal from '../components/AddTaskModal.jsx'
import { useAuth } from '../context/AuthContext.jsx'

// Deterministic stars so they don't jump on re-render
const STARS = Array.from({ length: 60 }, (_, i) => ({
  top: ((i * 137.508) % 100).toFixed(2),
  left: ((i * 97.318) % 100).toFixed(2),
  size: i % 7 === 0 ? 2 : i % 3 === 0 ? 1.5 : 1,
  opacity: (0.08 + (i % 8) * 0.04).toFixed(2),
}))

export default function Dashboard() {
  const { token, user } = useAuth()
  const [tasks, setTasks] = useState([])
  const [projects, setProjects] = useState([])
  const [users, setUsers] = useState([])
  const [stats, setStats] = useState(null)
  const [view, setView] = useState('board')
  const [filters, setFilters] = useState({ project: null, assignee: null })
  const [showAddModal, setShowAddModal] = useState(false)
  const [editTask, setEditTask] = useState(null)
  const [loading, setLoading] = useState(true)

  const apiHeaders = { Authorization: `Bearer ${token}` }

  const fetchData = useCallback(async () => {
    try {
      const params = new URLSearchParams()
      if (filters.project) params.append('project', filters.project)
      if (filters.assignee) params.append('assignee', filters.assignee)

      const [tasksRes, projectsRes, usersRes, statsRes] = await Promise.all([
        fetch(`/api/tasks?${params}`, { headers: apiHeaders }),
        fetch('/api/projects', { headers: apiHeaders }),
        fetch('/api/users', { headers: apiHeaders }),
        fetch('/api/dashboard/stats', { headers: apiHeaders }),
      ])

      const [tasksData, projectsData, usersData, statsData] = await Promise.all([
        tasksRes.json(), projectsRes.json(), usersRes.json(), statsRes.json(),
      ])

      setTasks(Array.isArray(tasksData) ? tasksData : [])
      setProjects(Array.isArray(projectsData) ? projectsData : [])
      setUsers(Array.isArray(usersData) ? usersData : [])
      setStats(statsData && !statsData.error ? statsData : null)
    } catch (err) {
      console.error('Ошибка загрузки данных:', err)
    } finally {
      setLoading(false)
    }
  }, [filters, token])

  useEffect(() => { fetchData() }, [fetchData])

  async function handleUpdateTaskStatus(taskId, newStatus) {
    try {
      await fetch(`/api/tasks/${taskId}`, {
        method: 'PUT',
        headers: { ...apiHeaders, 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      })
      fetchData()
    } catch (err) { console.error(err) }
  }

  async function handleDeleteTask(taskId) {
    if (!window.confirm('Удалить задачу? Это действие нельзя отменить.')) return
    try {
      await fetch(`/api/tasks/${taskId}`, { method: 'DELETE', headers: apiHeaders })
      fetchData()
    } catch (err) { console.error(err) }
  }

  async function handleTimerStart(taskId) {
    try {
      await fetch(`/api/tasks/${taskId}/timer/start`, { method: 'POST', headers: apiHeaders })
      fetchData()
    } catch (err) { console.error(err) }
  }

  async function handleTimerPause(taskId) {
    try {
      await fetch(`/api/tasks/${taskId}/timer/pause`, { method: 'POST', headers: apiHeaders })
      fetchData()
    } catch (err) { console.error(err) }
  }

  async function handleSaveTask(taskData) {
    try {
      const url = editTask ? `/api/tasks/${editTask.id}` : '/api/tasks'
      const method = editTask ? 'PUT' : 'POST'
      const res = await fetch(url, {
        method,
        headers: { ...apiHeaders, 'Content-Type': 'application/json' },
        body: JSON.stringify(taskData),
      })
      if (res.ok) {
        setShowAddModal(false)
        setEditTask(null)
        fetchData()
      }
    } catch (err) { console.error(err) }
  }

  const developers = users.filter(u => u.role === 'developer')

  return (
    <div style={{ minHeight: '100vh', background: '#050A18', fontFamily: "'DM Sans', sans-serif", position: 'relative' }}>
      {/* ── Cosmic background ─────────────────────── */}
      <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0 }}>
        {/* Stars */}
        {STARS.map((s, i) => (
          <div key={i} style={{
            position: 'absolute',
            width: `${s.size}px`,
            height: `${s.size}px`,
            background: 'white',
            borderRadius: '50%',
            top: `${s.top}%`,
            left: `${s.left}%`,
            opacity: s.opacity,
          }} />
        ))}
        {/* Nebula glows */}
        <div style={{ position: 'absolute', top: '-10%', left: '-5%', width: '45vw', height: '45vw', background: 'radial-gradient(circle, rgba(99,102,241,0.07) 0%, transparent 65%)', borderRadius: '50%' }} />
        <div style={{ position: 'absolute', bottom: '-10%', right: '-5%', width: '40vw', height: '40vw', background: 'radial-gradient(circle, rgba(14,165,233,0.06) 0%, transparent 65%)', borderRadius: '50%' }} />
        <div style={{ position: 'absolute', top: '40%', right: '15%', width: '30vw', height: '30vw', background: 'radial-gradient(circle, rgba(139,92,246,0.05) 0%, transparent 65%)', borderRadius: '50%' }} />
      </div>

      {/* ── Content ───────────────────────────────── */}
      <div style={{ position: 'relative', zIndex: 1 }}>
        <Header
          user={user}
          view={view}
          setView={setView}
          onAddTask={() => { setEditTask(null); setShowAddModal(true) }}
        />
        <div style={{ maxWidth: '1440px', margin: '0 auto', padding: '0 24px 60px' }}>
          {stats && <StatsBar stats={stats} />}
          <FilterBar
            projects={projects}
            users={developers}
            filters={filters}
            setFilters={setFilters}
            isAdmin={user?.role === 'admin'}
          />
          {loading ? (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '100px', gap: '14px' }}>
              <div style={{ width: '20px', height: '20px', border: '2px solid rgba(56,189,248,0.2)', borderTopColor: '#38BDF8', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
              <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: '14px' }}>Загрузка данных...</span>
              <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
            </div>
          ) : view === 'board' ? (
            <BoardView
              tasks={tasks}
              onStatusChange={handleUpdateTaskStatus}
              onDelete={handleDeleteTask}
              onEdit={(task) => { setEditTask(task); setShowAddModal(true) }}
              onTimerStart={handleTimerStart}
              onTimerPause={handleTimerPause}
              isAdmin={user?.role === 'admin'}
            />
          ) : (
            <TeamView
              users={developers}
              tasks={tasks}
              stats={stats}
              isAdmin={user?.role === 'admin'}
              currentUserId={user?.id}
              onAvatarUpdate={fetchData}
            />
          )}
        </div>
      </div>

      {showAddModal && (
        <AddTaskModal
          task={editTask}
          projects={projects}
          users={developers}
          onSave={handleSaveTask}
          onClose={() => { setShowAddModal(false); setEditTask(null) }}
        />
      )}
    </div>
  )
}
