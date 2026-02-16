import React from 'react'

export default function FilterBar({ projects, users, filters, setFilters, isAdmin }) {
  const activeBtn = (active) => ({
    padding: '5px 14px',
    borderRadius: '20px',
    border: `1px solid ${active ? 'rgba(56,189,248,0.5)' : 'rgba(255,255,255,0.07)'}`,
    background: active ? 'rgba(56,189,248,0.12)' : 'transparent',
    color: active ? '#38BDF8' : 'rgba(255,255,255,0.4)',
    cursor: 'pointer',
    fontSize: '12px',
    fontWeight: '600',
    fontFamily: "'DM Sans', sans-serif",
    transition: 'all 0.15s',
  })

  return (
    <div style={{
      display: 'flex',
      gap: '20px',
      padding: '16px 0 12px',
      alignItems: 'center',
      flexWrap: 'wrap',
      borderBottom: '1px solid rgba(56,189,248,0.07)',
      marginBottom: '4px',
    }}>
      {/* Project filters */}
      <div style={{ display: 'flex', gap: '6px', alignItems: 'center', flexWrap: 'wrap' }}>
        <span style={{ fontSize: '11px', color: 'rgba(56,189,248,0.35)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px', marginRight: '2px' }}>
          Проект
        </span>
        <button onClick={() => setFilters(f => ({ ...f, project: null }))} style={activeBtn(!filters.project)}>
          Все
        </button>
        {projects.map(p => (
          <button
            key={p.id}
            onClick={() => setFilters(f => ({ ...f, project: f.project === p.id ? null : p.id }))}
            style={{
              padding: '4px 12px 4px 5px',
              borderRadius: '20px',
              border: `1px solid ${filters.project === p.id ? p.color + '60' : 'rgba(255,255,255,0.07)'}`,
              background: filters.project === p.id ? p.color + '18' : 'transparent',
              color: filters.project === p.id ? p.color : 'rgba(255,255,255,0.4)',
              cursor: 'pointer',
              fontSize: '12px',
              fontWeight: '600',
              fontFamily: "'DM Sans', sans-serif",
              transition: 'all 0.15s',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            {p.logo_url ? (
              <img
                src={p.logo_url}
                alt={p.name}
                style={{ width: '22px', height: '22px', borderRadius: '5px', objectFit: 'contain', flexShrink: 0, background: '#1a2035', padding: '2px' }}
                onError={e => { e.target.style.display = 'none' }}
              />
            ) : (
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: p.color, flexShrink: 0 }} />
            )}
            {p.name}
          </button>
        ))}
      </div>

      {isAdmin && <div style={{ width: '1px', height: '20px', background: 'rgba(56,189,248,0.1)', flexShrink: 0 }} />}

      {/* Developer filters — admin only */}
      {isAdmin &&
      <div style={{ display: 'flex', gap: '6px', alignItems: 'center', flexWrap: 'wrap' }}>
        <span style={{ fontSize: '11px', color: 'rgba(56,189,248,0.35)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px', marginRight: '2px' }}>
          Разработчик
        </span>
        <button onClick={() => setFilters(f => ({ ...f, assignee: null }))} style={activeBtn(!filters.assignee)}>
          Все
        </button>
        {users.map(u => (
          <button
            key={u.id}
            onClick={() => setFilters(f => ({ ...f, assignee: f.assignee === u.id ? null : u.id }))}
            style={{
              padding: '4px 12px 4px 5px',
              borderRadius: '20px',
              border: `1px solid ${filters.assignee === u.id ? u.color + '60' : 'rgba(255,255,255,0.07)'}`,
              background: filters.assignee === u.id ? u.color + '15' : 'transparent',
              color: filters.assignee === u.id ? u.color : 'rgba(255,255,255,0.4)',
              cursor: 'pointer',
              fontSize: '12px',
              fontWeight: '600',
              fontFamily: "'DM Sans', sans-serif",
              transition: 'all 0.15s',
              display: 'flex',
              alignItems: 'center',
              gap: '7px',
            }}
          >
            <div style={{ width: '22px', height: '22px', borderRadius: '50%', background: u.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '8px', fontWeight: '800', color: 'white', flexShrink: 0 }}>
              {u.avatar_initials}
            </div>
            {u.full_name}
          </button>
        ))}
      </div>}
    </div>
  )
}
