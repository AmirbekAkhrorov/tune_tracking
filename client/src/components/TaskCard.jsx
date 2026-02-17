import React, { useState, useEffect } from 'react'

const PRIORITY = {
  high:   { label: 'Высокий', color: '#F87171', bg: 'rgba(248,113,113,0.1)' },
  medium: { label: 'Средний', color: '#F59E0B', bg: 'rgba(245,158,11,0.1)' },
  low:    { label: 'Низкий',  color: '#34D399', bg: 'rgba(52,211,153,0.1)' },
}

const STATUS_OPTIONS = [
  { id: 'todo',     label: 'К выполнению' },
  { id: 'progress', label: 'В работе'     },
  { id: 'review',   label: 'На проверке'  },
  { id: 'done',     label: 'Выполнено'    },
]

function formatTime(seconds) {
  if (!seconds && seconds !== 0) return '0:00:00'
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  const s = seconds % 60
  return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}

export default function TaskCard({ task, currentStatus, onStatusChange, onDelete, onEdit, onTimerStart, onTimerPause, isAdmin }) {
  const [showActions, setShowActions] = useState(false)
  const [liveSeconds, setLiveSeconds] = useState(0)

  const priority = PRIORITY[task.priority] || PRIORITY.medium
  const isRunning = !!task.timer_start
  const baseTotal = task.timer_total || 0

  // Live ticking timer
  useEffect(() => {
    if (!isRunning) {
      setLiveSeconds(baseTotal)
      return
    }
    const startMs = new Date(task.timer_start).getTime()
    const tick = () => {
      const elapsed = Math.floor((Date.now() - startMs) / 1000)
      setLiveSeconds(baseTotal + elapsed)
    }
    tick()
    const interval = setInterval(tick, 1000)
    return () => clearInterval(interval)
  }, [task.timer_start, task.timer_total])

  let tags = []
  try { tags = JSON.parse(task.tags || '[]') } catch { tags = [] }

  const dueDate = task.due_date
    ? new Date(task.due_date + 'T00:00:00').toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' })
    : null
  const isOverdue = task.due_date && new Date(task.due_date) < new Date() && task.status !== 'done'

  const hasTimeData = baseTotal > 0 || isRunning

  const startedAt = task.started_at
    ? new Date(task.started_at).toLocaleString('ru-RU', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })
    : null

  // Developer "move" action
  const devMoveAction = !isAdmin && {
    todo:     { label: '▶ Начать',    next: 'progress', color: '#38BDF8', bg: 'rgba(56,189,248,0.12)', border: 'rgba(56,189,248,0.35)' },
    progress: { label: '✓ Завершить', next: 'review',   color: '#34D399', bg: 'rgba(52,211,153,0.12)', border: 'rgba(52,211,153,0.35)' },
  }[currentStatus]

  return (
    <div
      onClick={() => isAdmin && setShowActions(s => !s)}
      style={{
        background: showActions ? 'rgba(56,189,248,0.05)' : 'rgba(255,255,255,0.025)',
        border: `1px solid ${showActions ? 'rgba(56,189,248,0.3)' : isRunning ? 'rgba(56,189,248,0.25)' : 'rgba(255,255,255,0.06)'}`,
        borderRadius: '14px',
        padding: '14px',
        cursor: isAdmin ? 'pointer' : 'default',
        transition: 'all 0.2s',
        userSelect: 'none',
        position: 'relative',
      }}
      onMouseEnter={e => {
        if (isAdmin && !showActions) {
          e.currentTarget.style.background = 'rgba(56,189,248,0.04)'
          e.currentTarget.style.transform = 'translateY(-1px)'
        }
      }}
      onMouseLeave={e => {
        if (isAdmin && !showActions) {
          e.currentTarget.style.background = 'rgba(255,255,255,0.025)'
          e.currentTarget.style.transform = 'none'
        }
      }}
    >
      {/* Running indicator dot */}
      {isRunning && (
        <div style={{ position: 'absolute', top: '12px', right: '12px', width: '7px', height: '7px', borderRadius: '50%', background: '#38BDF8', boxShadow: '0 0 6px #38BDF8', animation: 'pulse 1.5s ease-in-out infinite' }} />
      )}

      {/* Header: project + priority */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '6px', marginBottom: '10px' }}>
        {task.project_name ? (
          <span style={{ fontSize: '10px', fontWeight: '700', color: task.project_color || '#38BDF8', background: (task.project_color || '#38BDF8') + '18', padding: '2px 7px 2px 4px', borderRadius: '5px', flexShrink: 0, display: 'flex', alignItems: 'center', gap: '4px' }}>
            {task.project_logo && <img src={task.project_logo} alt="" style={{ width: '14px', height: '14px', borderRadius: '3px', objectFit: 'contain', background: '#1a2035', padding: '1px' }} onError={e => { e.target.style.display = 'none' }} />}
            {task.project_name}
          </span>
        ) : <span />}
        <span style={{ fontSize: '10px', fontWeight: '700', color: priority.color, background: priority.bg, padding: '2px 7px', borderRadius: '5px', flexShrink: 0, marginRight: isRunning ? '14px' : '0' }}>
          {priority.label}
        </span>
      </div>

      {/* Title */}
      <div style={{ fontSize: '13px', fontWeight: '600', color: '#F1F5F9', marginBottom: '8px', lineHeight: '1.45' }}>
        {task.title}
      </div>

      {/* Tags */}
      {tags.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginBottom: '10px' }}>
          {tags.slice(0, 3).map((tag, i) => (
            <span key={i} style={{ fontSize: '10px', color: 'rgba(56,189,248,0.4)', background: 'rgba(56,189,248,0.07)', padding: '2px 6px', borderRadius: '4px', fontFamily: "'Space Mono', monospace" }}>
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Footer row: assignee + time + due date */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '6px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', minWidth: 0 }}>
          {task.assignee_name ? (
            <>
              <div style={{ width: '22px', height: '22px', borderRadius: '50%', background: task.assignee_color || '#38BDF8', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '8px', fontWeight: '800', color: 'white', flexShrink: 0, overflow: 'hidden' }}>
                {task.assignee_avatar_url
                  ? <img src={task.assignee_avatar_url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={e => { e.target.style.display = 'none' }} />
                  : task.avatar_initials
                }
              </div>
              <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', fontWeight: '500', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {task.assignee_name}
              </span>
            </>
          ) : (
            <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.2)' }}>Без исполнителя</span>
          )}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
          {/* Time display */}
          {hasTimeData && (
            <span style={{ fontSize: '11px', fontFamily: "'Space Mono', monospace", color: isRunning ? '#38BDF8' : 'rgba(255,255,255,0.45)', background: isRunning ? 'rgba(56,189,248,0.1)' : 'rgba(255,255,255,0.05)', padding: '2px 7px', borderRadius: '6px', letterSpacing: '0.5px' }}>
              ⏱ {formatTime(liveSeconds)}
            </span>
          )}
          {dueDate && (
            <span style={{ fontSize: '11px', color: isOverdue ? '#F87171' : 'rgba(255,255,255,0.3)', fontFamily: "'Space Mono', monospace" }}>
              {isOverdue ? '! ' : ''}{dueDate}
            </span>
          )}
        </div>
      </div>

      {/* Started-at badge */}
      {startedAt && (
        <div style={{ marginTop: '10px', display: 'flex', alignItems: 'center', gap: '5px' }}>
          <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.25)', letterSpacing: '0.4px' }}>Начато:</span>
          <span style={{ fontSize: '10px', fontFamily: "'Space Mono', monospace", color: 'rgba(139,92,246,0.7)', background: 'rgba(139,92,246,0.08)', padding: '2px 7px', borderRadius: '5px' }}>
            {startedAt}
          </span>
        </div>
      )}

      {/* ── Developer action buttons (in-progress) ── */}
      {!isAdmin && currentStatus === 'progress' && (
        <div onClick={e => e.stopPropagation()} style={{ marginTop: '12px', display: 'flex', gap: '6px' }}>
          {/* Timer button */}
          {!isRunning ? (
            <button
              onClick={() => onTimerStart(task.id)}
              style={{ flex: 1, padding: '7px 0', borderRadius: '8px', border: '1px solid rgba(56,189,248,0.3)', background: 'rgba(56,189,248,0.08)', color: '#38BDF8', cursor: 'pointer', fontFamily: "'DM Sans', sans-serif", fontSize: '12px', fontWeight: '700', transition: 'all 0.15s' }}
              onMouseEnter={e => e.target.style.opacity = '0.75'}
              onMouseLeave={e => e.target.style.opacity = '1'}
            >
              {baseTotal > 0 ? '⏯ Продолжить таймер' : '⏱ Старт таймера'}
            </button>
          ) : (
            <button
              onClick={() => onTimerPause(task.id)}
              style={{ flex: 1, padding: '7px 0', borderRadius: '8px', border: '1px solid rgba(245,158,11,0.35)', background: 'rgba(245,158,11,0.1)', color: '#F59E0B', cursor: 'pointer', fontFamily: "'DM Sans', sans-serif", fontSize: '12px', fontWeight: '700', transition: 'all 0.15s' }}
              onMouseEnter={e => e.target.style.opacity = '0.75'}
              onMouseLeave={e => e.target.style.opacity = '1'}
            >
              ⏸ Пауза
            </button>
          )}
          {/* Finish button */}
          <button
            onClick={() => onStatusChange(task.id, 'review')}
            style={{ flex: 1, padding: '7px 0', borderRadius: '8px', border: '1px solid rgba(52,211,153,0.35)', background: 'rgba(52,211,153,0.1)', color: '#34D399', cursor: 'pointer', fontFamily: "'DM Sans', sans-serif", fontSize: '12px', fontWeight: '700', transition: 'all 0.15s' }}
            onMouseEnter={e => e.target.style.opacity = '0.75'}
            onMouseLeave={e => e.target.style.opacity = '1'}
          >
            ✓ Завершить
          </button>
        </div>
      )}

      {/* ── Developer: start button (todo only) ── */}
      {!isAdmin && currentStatus === 'todo' && devMoveAction && (
        <button
          onClick={e => { e.stopPropagation(); onStatusChange(task.id, devMoveAction.next) }}
          style={{ marginTop: '12px', width: '100%', padding: '8px', borderRadius: '8px', border: `1px solid ${devMoveAction.border}`, background: devMoveAction.bg, color: devMoveAction.color, cursor: 'pointer', fontFamily: "'DM Sans', sans-serif", fontSize: '12px', fontWeight: '700', transition: 'all 0.15s' }}
          onMouseEnter={e => e.target.style.opacity = '0.75'}
          onMouseLeave={e => e.target.style.opacity = '1'}
        >
          {devMoveAction.label}
        </button>
      )}

      {/* ── Admin action panel ── */}
      {isAdmin && showActions && (
        <div onClick={e => e.stopPropagation()} style={{ marginTop: '12px', paddingTop: '12px', borderTop: '1px solid rgba(56,189,248,0.1)' }}>
          <div style={{ fontSize: '10px', color: 'rgba(56,189,248,0.35)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.8px', fontWeight: '700' }}>
            Переместить в
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px', marginBottom: '8px' }}>
            {STATUS_OPTIONS.filter(s => s.id !== currentStatus).map(s => (
              <button
                key={s.id}
                onClick={() => { onStatusChange(task.id, s.id); setShowActions(false) }}
                style={{ fontSize: '11px', padding: '5px 10px', borderRadius: '7px', border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.03)', color: 'rgba(255,255,255,0.6)', cursor: 'pointer', fontFamily: "'DM Sans', sans-serif", fontWeight: '500', transition: 'all 0.15s' }}
                onMouseEnter={e => { e.target.style.background = 'rgba(56,189,248,0.15)'; e.target.style.color = '#7DD3FC' }}
                onMouseLeave={e => { e.target.style.background = 'rgba(255,255,255,0.03)'; e.target.style.color = 'rgba(255,255,255,0.6)' }}
              >
                {s.label}
              </button>
            ))}
          </div>
          {currentStatus === 'progress' && (
            <div onClick={e => e.stopPropagation()} style={{ display: 'flex', gap: '6px', marginBottom: '8px' }}>
              {!isRunning ? (
                <button
                  onClick={() => onTimerStart(task.id)}
                  style={{ flex: 1, padding: '6px 0', borderRadius: '8px', border: '1px solid rgba(56,189,248,0.3)', background: 'rgba(56,189,248,0.08)', color: '#38BDF8', cursor: 'pointer', fontFamily: "'DM Sans', sans-serif", fontSize: '11px', fontWeight: '700' }}
                >
                  {baseTotal > 0 ? '⏯ Продолжить таймер' : '⏱ Старт таймера'}
                </button>
              ) : (
                <button
                  onClick={() => onTimerPause(task.id)}
                  style={{ flex: 1, padding: '6px 0', borderRadius: '8px', border: '1px solid rgba(245,158,11,0.35)', background: 'rgba(245,158,11,0.1)', color: '#F59E0B', cursor: 'pointer', fontFamily: "'DM Sans', sans-serif", fontSize: '11px', fontWeight: '700' }}
                >
                  ⏸ Пауза
                </button>
              )}
            </div>
          )}
          <div style={{ display: 'flex', gap: '6px' }}>
            <button
              onClick={() => { setShowActions(false); onEdit(task) }}
              style={{ flex: 1, fontSize: '11px', padding: '5px 10px', borderRadius: '7px', border: '1px solid rgba(56,189,248,0.3)', background: 'rgba(56,189,248,0.08)', color: '#7DD3FC', cursor: 'pointer', fontFamily: "'DM Sans', sans-serif", fontWeight: '600' }}
            >
              Изменить
            </button>
            <button
              onClick={() => { setShowActions(false); onDelete(task.id) }}
              style={{ flex: 1, fontSize: '11px', padding: '5px 10px', borderRadius: '7px', border: '1px solid rgba(248,113,113,0.3)', background: 'rgba(248,113,113,0.08)', color: '#FCA5A5', cursor: 'pointer', fontFamily: "'DM Sans', sans-serif", fontWeight: '600' }}
            >
              Удалить
            </button>
          </div>
        </div>
      )}

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.4; transform: scale(0.8); }
        }
      `}</style>
    </div>
  )
}
