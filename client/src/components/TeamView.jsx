import React, { useRef } from 'react'
import { useAuth } from '../context/AuthContext.jsx'

const STATUS_COLORS = {
  todo:     { color: '#64748B', label: 'К выполнению' },
  progress: { color: '#F59E0B', label: 'В работе'     },
  review:   { color: '#8B5CF6', label: 'На проверке'  },
  done:     { color: '#34D399', label: 'Выполнено'    },
}

function Avatar({ user, size = 46, onUpload }) {
  const inputRef = useRef(null)

  return (
    <div style={{ position: 'relative', flexShrink: 0 }}>
      <div style={{
        width: `${size}px`,
        height: `${size}px`,
        borderRadius: '50%',
        overflow: 'hidden',
        background: `linear-gradient(135deg, ${user.color}, ${user.color}99)`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: `${size * 0.33}px`,
        fontWeight: '800',
        color: 'white',
        boxShadow: `0 4px 14px ${user.color}35`,
        cursor: onUpload ? 'pointer' : 'default',
      }}
        onClick={() => onUpload && inputRef.current?.click()}
        title={onUpload ? 'Нажмите для смены фото' : undefined}
      >
        {user.avatar_url
          ? <img src={user.avatar_url} alt={user.full_name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={e => { e.target.style.display = 'none' }} />
          : user.avatar_initials
        }
      </div>
      {onUpload && (
        <>
          <div style={{
            position: 'absolute', bottom: 0, right: 0,
            width: '16px', height: '16px',
            borderRadius: '50%',
            background: '#38BDF8',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '9px', cursor: 'pointer', border: '2px solid #050A18',
            pointerEvents: 'none',
          }}>
            📷
          </div>
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            style={{ display: 'none' }}
            onChange={e => { if (e.target.files[0]) onUpload(e.target.files[0]); e.target.value = '' }}
          />
        </>
      )}
    </div>
  )
}

export default function TeamView({ users, tasks, isAdmin, currentUserId, onAvatarUpdate }) {
  const { token } = useAuth()
  const visibleUsers = isAdmin ? users : users.filter(u => u.id === currentUserId)

  async function handleUpload(userId, file) {
    const form = new FormData()
    form.append('avatar', file)
    const res = await fetch(`/api/users/${userId}/avatar`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: form,
    })
    if (res.ok && onAvatarUpdate) onAvatarUpdate()
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', paddingTop: '16px' }}>
      {visibleUsers.map(u => {
        const userTasks = tasks.filter(t => t.assigned_to === u.id)
        const doneTasks   = userTasks.filter(t => t.status === 'done').length
        const activeTasks = userTasks.filter(t => t.status === 'progress').length
        const reviewTasks = userTasks.filter(t => t.status === 'review').length
        const pct = userTasks.length > 0 ? Math.round((doneTasks / userTasks.length) * 100) : 0

        return (
          <div
            key={u.id}
            style={{
              background: 'rgba(14,20,40,0.6)',
              border: '1px solid rgba(56,189,248,0.08)',
              borderRadius: '16px',
              padding: '20px 24px',
              backdropFilter: 'blur(6px)',
              transition: 'all 0.2s',
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(56,189,248,0.15)'; e.currentTarget.style.background = 'rgba(14,20,40,0.75)' }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(56,189,248,0.08)'; e.currentTarget.style.background = 'rgba(14,20,40,0.6)' }}
          >
            {/* Developer header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: userTasks.length > 0 ? '16px' : '0' }}>
              <Avatar
                user={u}
                size={46}
                onUpload={isAdmin ? (file) => handleUpload(u.id, file) : null}
              />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap', marginBottom: '5px' }}>
                  <span style={{ fontSize: '15px', fontWeight: '700', color: '#F1F5F9' }}>{u.full_name}</span>
                  <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.3)', background: 'rgba(255,255,255,0.05)', padding: '2px 9px', borderRadius: '6px', fontWeight: '500' }}>
                    {u.job_title}
                  </span>
                </div>
                <div style={{ display: 'flex', gap: '14px', alignItems: 'center', flexWrap: 'wrap' }}>
                  {activeTasks > 0 && <span style={{ fontSize: '12px', color: '#F59E0B', fontFamily: "'Space Mono', monospace" }}>{activeTasks} в работе</span>}
                  {reviewTasks > 0 && <span style={{ fontSize: '12px', color: '#8B5CF6', fontFamily: "'Space Mono', monospace" }}>{reviewTasks} на проверке</span>}
                  <span style={{ fontSize: '12px', color: '#34D399', fontFamily: "'Space Mono', monospace" }}>{doneTasks} выполнено</span>
                  <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.22)', fontFamily: "'Space Mono', monospace" }}>{userTasks.length} всего</span>
                </div>
              </div>
              {/* Progress */}
              <div style={{ width: '130px', flexShrink: 0 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '7px' }}>
                  <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.3)', fontWeight: '500' }}>Прогресс</span>
                  <span style={{ fontSize: '12px', fontFamily: "'Space Mono', monospace", color: u.color, fontWeight: '700' }}>{pct}%</span>
                </div>
                <div style={{ height: '4px', background: 'rgba(255,255,255,0.07)', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${pct}%`, background: `linear-gradient(90deg, ${u.color}aa, ${u.color})`, borderRadius: '4px', transition: 'width 0.6s ease', boxShadow: `0 0 8px ${u.color}60` }} />
                </div>
              </div>
            </div>

            {/* Task list */}
            {userTasks.length > 0 && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '8px' }}>
                {userTasks.map(task => (
                  <div
                    key={task.id}
                    style={{ background: 'rgba(56,189,248,0.03)', border: '1px solid rgba(56,189,248,0.07)', borderRadius: '10px', padding: '10px 13px', display: 'flex', alignItems: 'center', gap: '10px' }}
                  >
                    <div style={{ width: '7px', height: '7px', borderRadius: '50%', background: STATUS_COLORS[task.status]?.color || '#64748B', flexShrink: 0, boxShadow: `0 0 5px ${STATUS_COLORS[task.status]?.color || '#64748B'}70` }} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: '13px', fontWeight: '500', color: '#E2E8F0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{task.title}</div>
                      <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.28)', marginTop: '1px' }}>{task.project_name || 'Без проекта'}</div>
                    </div>
                    <span style={{ fontSize: '10px', color: STATUS_COLORS[task.status]?.color || '#64748B', background: (STATUS_COLORS[task.status]?.color || '#64748B') + '18', padding: '2px 7px', borderRadius: '5px', fontWeight: '700', whiteSpace: 'nowrap', flexShrink: 0 }}>
                      {STATUS_COLORS[task.status]?.label || task.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
            {userTasks.length === 0 && (
              <div style={{ color: 'rgba(255,255,255,0.18)', fontSize: '13px', textAlign: 'center', padding: '8px 0 0' }}>
                Нет задач
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
