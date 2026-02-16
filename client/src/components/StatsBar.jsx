import React from 'react'

export default function StatsBar({ stats }) {
  const cards = [
    {
      label: 'Всего задач',
      value: stats.total,
      icon: (
        <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
      ),
      color: '#38BDF8',
      bg: 'rgba(56,189,248,0.1)',
      border: 'rgba(56,189,248,0.2)',
    },
    {
      label: 'В работе',
      value: stats.inProgress,
      icon: (
        <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      color: '#F59E0B',
      bg: 'rgba(245,158,11,0.1)',
      border: 'rgba(245,158,11,0.2)',
    },
    {
      label: 'Высокий приоритет',
      value: stats.highPriority,
      icon: (
        <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      ),
      color: '#F87171',
      bg: 'rgba(248,113,113,0.1)',
      border: 'rgba(248,113,113,0.2)',
    },
    {
      label: 'Выполнено',
      value: `${stats.completionPct}%`,
      icon: (
        <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      color: '#34D399',
      bg: 'rgba(52,211,153,0.1)',
      border: 'rgba(52,211,153,0.2)',
    },
  ]

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', paddingTop: '24px', paddingBottom: '8px' }}>
      {cards.map((card) => (
        <div
          key={card.label}
          style={{
            background: 'rgba(14,20,40,0.7)',
            border: `1px solid ${card.border}`,
            borderRadius: '16px',
            padding: '20px 22px',
            position: 'relative',
            overflow: 'hidden',
            backdropFilter: 'blur(8px)',
          }}
        >
          <div style={{ position: 'absolute', top: 0, right: 0, width: '100px', height: '100px', background: `radial-gradient(circle at top right, ${card.color}12, transparent 70%)`, pointerEvents: 'none' }} />
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.45)', fontWeight: '500' }}>{card.label}</span>
            <div style={{ width: '34px', height: '34px', background: card.bg, border: `1px solid ${card.border}`, borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: card.color }}>
              {card.icon}
            </div>
          </div>
          <div style={{ fontSize: '34px', fontWeight: '700', color: card.color, fontFamily: "'Space Mono', monospace", letterSpacing: '-1px' }}>
            {card.value}
          </div>
        </div>
      ))}
    </div>
  )
}
