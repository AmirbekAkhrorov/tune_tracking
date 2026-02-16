import React from 'react'
import TaskCard from './TaskCard.jsx'

const COLUMNS = [
  { id: 'todo',     label: 'К выполнению', color: '#64748B', accent: 'rgba(100,116,139,0.12)' },
  { id: 'progress', label: 'В работе',     color: '#F59E0B', accent: 'rgba(245,158,11,0.1)'  },
  { id: 'review',   label: 'На проверке',  color: '#8B5CF6', accent: 'rgba(139,92,246,0.1)'  },
  { id: 'done',     label: 'Выполнено',    color: '#34D399', accent: 'rgba(52,211,153,0.1)'  },
]

export default function BoardView({ tasks, onStatusChange, onDelete, onEdit, onTimerStart, onTimerPause, isAdmin }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '14px', paddingTop: '16px' }}>
      {COLUMNS.map(col => {
        const colTasks = tasks.filter(t => t.status === col.id)
        return (
          <div
            key={col.id}
            style={{
              background: 'rgba(14,20,40,0.55)',
              border: `1px solid rgba(255,255,255,0.05)`,
              borderTop: `2px solid ${col.color}50`,
              borderRadius: '16px',
              padding: '14px',
              minHeight: '420px',
              backdropFilter: 'blur(6px)',
            }}
          >
            {/* Column header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '7px', height: '7px', borderRadius: '50%', background: col.color, boxShadow: `0 0 6px ${col.color}80` }} />
                <span style={{ fontSize: '13px', fontWeight: '700', color: 'rgba(255,255,255,0.8)' }}>{col.label}</span>
              </div>
              <div style={{
                background: col.accent,
                border: `1px solid ${col.color}30`,
                borderRadius: '8px',
                padding: '2px 9px',
                fontSize: '12px',
                fontFamily: "'Space Mono', monospace",
                color: col.color,
                fontWeight: '700',
              }}>
                {colTasks.length}
              </div>
            </div>

            {/* Task cards */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {colTasks.map(task => (
                <TaskCard
                  key={task.id}
                  task={task}
                  currentStatus={col.id}
                  onStatusChange={onStatusChange}
                  onDelete={onDelete}
                  onEdit={onEdit}
                  onTimerStart={onTimerStart}
                  onTimerPause={onTimerPause}
                  isAdmin={isAdmin}
                />
              ))}
              {colTasks.length === 0 && (
                <div style={{ textAlign: 'center', padding: '40px 16px', color: 'rgba(255,255,255,0.1)', fontSize: '13px' }}>
                  <div style={{ fontSize: '26px', marginBottom: '8px', opacity: 0.3 }}>○</div>
                  Пусто
                </div>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
