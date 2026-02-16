import React from 'react'
import { useAuth } from '../context/AuthContext.jsx'

function AstronautIcon() {
  return (
    <svg width="32" height="32" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="hVisor" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#38BDF8" stopOpacity="0.95"/>
          <stop offset="100%" stopColor="#0369A1" stopOpacity="0.5"/>
        </radialGradient>
        <radialGradient id="hHelmet" cx="35%" cy="30%" r="65%">
          <stop offset="0%" stopColor="#E2E8F0"/>
          <stop offset="100%" stopColor="#94A3B8"/>
        </radialGradient>
        <filter id="hGlow">
          <feGaussianBlur stdDeviation="2" result="b"/>
          <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
      </defs>
      {/* Body */}
      <ellipse cx="40" cy="60" rx="16" ry="17" fill="#94A3B8"/>
      {/* Neck */}
      <rect x="33" y="46" width="14" height="5" rx="2.5" fill="#64748B"/>
      {/* Helmet */}
      <circle cx="40" cy="34" r="22" fill="url(#hHelmet)"/>
      {/* Visor */}
      <ellipse cx="40" cy="34" rx="15" ry="13" fill="#0C1445"/>
      <ellipse cx="40" cy="34" rx="14" ry="12" fill="url(#hVisor)" opacity="0.85"/>
      {/* Eyes */}
      <circle cx="35" cy="32" r="2.5" fill="#38BDF8" opacity="0.9" filter="url(#hGlow)"/>
      <circle cx="45" cy="32" r="2.5" fill="#38BDF8" opacity="0.9" filter="url(#hGlow)"/>
      <circle cx="35.8" cy="31.2" r="1" fill="white" opacity="0.8"/>
      <circle cx="45.8" cy="31.2" r="1" fill="white" opacity="0.8"/>
      {/* Smile */}
      <path d="M37 38 Q40 41 43 38" stroke="rgba(56,189,248,0.6)" strokeWidth="1.2" fill="none" strokeLinecap="round"/>
      {/* Helmet shine */}
      <ellipse cx="32" cy="23" rx="5" ry="3" fill="white" opacity="0.18" transform="rotate(-20 32 23)"/>
      {/* Antenna */}
      <line x1="40" y1="12" x2="40" y2="4" stroke="#64748B" strokeWidth="1.5" strokeLinecap="round"/>
      <circle cx="40" cy="3" r="2.5" fill="#38BDF8" filter="url(#hGlow)"/>
    </svg>
  )
}

export default function Header({ view, setView, onAddTask }) {
  const { user, logout } = useAuth()

  return (
    <header style={{
      borderBottom: '1px solid rgba(56,189,248,0.1)',
      padding: '0 24px',
      height: '64px',
      display: 'flex',
      alignItems: 'center',
      background: 'rgba(5,10,24,0.95)',
      backdropFilter: 'blur(20px)',
      position: 'sticky',
      top: 0,
      zIndex: 100,
    }}>
      {/* Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '11px', flex: '0 0 auto' }}>
        <div style={{ filter: 'drop-shadow(0 0 8px rgba(56,189,248,0.4))' }}>
          <AstronautIcon />
        </div>
        <div>
          <div style={{ fontSize: '15px', fontWeight: '800', color: '#F1F5F9', letterSpacing: '1px', lineHeight: '1.1' }}>
            TUNE,{' '}
            <span style={{
              background: 'linear-gradient(135deg, #38BDF8, #6366F1)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}>TRACK</span>{' '}ME!
          </div>
          <div style={{ fontSize: '9px', color: 'rgba(56,189,248,0.4)', letterSpacing: '1.5px', textTransform: 'uppercase', marginTop: '1px' }}>
            Система задач
          </div>
        </div>
      </div>

      {/* View toggle */}
      <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
        <div style={{
          display: 'flex',
          gap: '4px',
          background: 'rgba(255,255,255,0.03)',
          borderRadius: '12px',
          padding: '4px',
          border: '1px solid rgba(56,189,248,0.1)',
        }}>
          {[
            { id: 'board', label: 'Доска' },
            { id: 'team', label: 'Команда' },
          ].map(v => (
            <button
              key={v.id}
              onClick={() => setView(v.id)}
              style={{
                padding: '7px 24px',
                borderRadius: '8px',
                border: 'none',
                cursor: 'pointer',
                fontSize: '13px',
                fontWeight: '600',
                fontFamily: "'DM Sans', sans-serif",
                transition: 'all 0.2s',
                background: view === v.id ? 'rgba(56,189,248,0.15)' : 'transparent',
                color: view === v.id ? '#38BDF8' : 'rgba(255,255,255,0.4)',
                boxShadow: view === v.id ? 'inset 0 0 0 1px rgba(56,189,248,0.35)' : 'none',
              }}
            >
              {v.label}
            </button>
          ))}
        </div>
      </div>

      {/* Right side */}
      <div style={{ flex: '0 0 auto', display: 'flex', alignItems: 'center', gap: '10px' }}>
        {user?.role === 'admin' && (
          <button
            onClick={onAddTask}
            style={{
              background: 'linear-gradient(135deg, #0EA5E9, #6366F1)',
              border: 'none',
              color: 'white',
              borderRadius: '10px',
              padding: '8px 18px',
              cursor: 'pointer',
              fontFamily: "'DM Sans', sans-serif",
              fontSize: '13px',
              fontWeight: '700',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              boxShadow: '0 4px 14px rgba(14,165,233,0.3)',
              letterSpacing: '0.2px',
            }}
          >
            <span style={{ fontSize: '18px', lineHeight: '1', marginTop: '-1px' }}>+</span>
            Новая задача
          </button>
        )}

        {/* User pill */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '4px 10px 4px 4px',
          background: 'rgba(56,189,248,0.05)',
          border: '1px solid rgba(56,189,248,0.12)',
          borderRadius: '24px',
        }}>
          <div style={{
            width: '28px',
            height: '28px',
            borderRadius: '50%',
            background: user?.color || '#38BDF8',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '11px',
            fontWeight: '800',
            color: 'white',
            overflow: 'hidden',
            flexShrink: 0,
          }}>
            {user?.avatar_url
              ? <img src={user.avatar_url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              : (user?.avatar_initials || user?.full_name?.charAt(0))
            }
          </div>
          <span style={{ fontSize: '13px', fontWeight: '600', color: 'rgba(255,255,255,0.8)' }}>
            {user?.full_name?.split(' ')[0]}
          </span>
          {user?.role === 'admin' && (
            <span style={{
              fontSize: '10px',
              color: '#38BDF8',
              background: 'rgba(56,189,248,0.12)',
              padding: '1px 6px',
              borderRadius: '4px',
              fontWeight: '700',
              letterSpacing: '0.3px',
            }}>
              ADMIN
            </span>
          )}
        </div>

        <button
          onClick={logout}
          style={{
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.07)',
            color: 'rgba(255,255,255,0.4)',
            borderRadius: '8px',
            padding: '7px 13px',
            cursor: 'pointer',
            fontFamily: "'DM Sans', sans-serif",
            fontSize: '12px',
            fontWeight: '500',
            transition: 'all 0.2s',
          }}
          onMouseEnter={e => { e.target.style.background = 'rgba(255,255,255,0.07)'; e.target.style.color = '#F1F5F9' }}
          onMouseLeave={e => { e.target.style.background = 'rgba(255,255,255,0.03)'; e.target.style.color = 'rgba(255,255,255,0.4)' }}
        >
          Выйти
        </button>
      </div>
    </header>
  )
}
