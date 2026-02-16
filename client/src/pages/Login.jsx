import React, { useState } from 'react'
import { useAuth } from '../context/AuthContext.jsx'

// ── Inline SVG Astronaut (TUNE Consulting mascot style) ──────────────────────
function AstronautLogo() {
  return (
    <svg width="120" height="140" viewBox="0 0 120 140" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="visorGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#38BDF8" stopOpacity="0.9"/>
          <stop offset="60%" stopColor="#0EA5E9" stopOpacity="0.7"/>
          <stop offset="100%" stopColor="#0369A1" stopOpacity="0.4"/>
        </radialGradient>
        <radialGradient id="helmetGrad" cx="40%" cy="30%" r="60%">
          <stop offset="0%" stopColor="#E2E8F0"/>
          <stop offset="100%" stopColor="#94A3B8"/>
        </radialGradient>
        <radialGradient id="suitGrad" cx="40%" cy="30%" r="60%">
          <stop offset="0%" stopColor="#CBD5E1"/>
          <stop offset="100%" stopColor="#64748B"/>
        </radialGradient>
        <filter id="glow">
          <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
        <filter id="softGlow">
          <feGaussianBlur stdDeviation="6" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
        <linearGradient id="antennae" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#64748B"/>
          <stop offset="100%" stopColor="#94A3B8"/>
        </linearGradient>
        <linearGradient id="tubeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#7DD3FC"/>
          <stop offset="100%" stopColor="#0EA5E9"/>
        </linearGradient>
      </defs>

      {/* ── Backpack / life support ── */}
      <rect x="66" y="68" width="18" height="26" rx="5" fill="#475569" opacity="0.9"/>
      <rect x="68" y="72" width="6" height="4" rx="1" fill="#7DD3FC" opacity="0.8"/>
      <rect x="68" y="79" width="6" height="4" rx="1" fill="#38BDF8" opacity="0.6"/>

      {/* ── Oxygen tube left ── */}
      <path d="M36 90 Q28 95 32 108 Q34 114 40 112" stroke="url(#tubeGrad)" strokeWidth="3" fill="none" strokeLinecap="round"/>
      <circle cx="40" cy="113" r="3" fill="#7DD3FC" filter="url(#glow)"/>

      {/* ── Body / suit ── */}
      <ellipse cx="55" cy="95" rx="22" ry="26" fill="url(#suitGrad)"/>

      {/* Suit highlight */}
      <ellipse cx="48" cy="84" rx="8" ry="5" fill="white" opacity="0.15" transform="rotate(-15 48 84)"/>

      {/* Chest panel */}
      <rect x="44" y="86" width="22" height="16" rx="4" fill="#334155" opacity="0.8"/>
      <rect x="46" y="88" width="4" height="3" rx="1" fill="#38BDF8" opacity="0.9" filter="url(#glow)"/>
      <rect x="52" y="88" width="4" height="3" rx="1" fill="#A78BFA" opacity="0.9"/>
      <rect x="58" y="88" width="4" height="3" rx="1" fill="#34D399" opacity="0.9"/>
      <rect x="46" y="94" width="16" height="1.5" rx="1" fill="#475569"/>
      <rect x="46" y="97" width="10" height="1.5" rx="1" fill="#475569"/>

      {/* ── Left arm (raised slightly) ── */}
      <ellipse cx="30" cy="90" rx="8" ry="13" fill="url(#suitGrad)" transform="rotate(-20 30 90)"/>
      <ellipse cx="25" cy="103" rx="7" ry="7" fill="#94A3B8"/>
      {/* Glove left */}
      <ellipse cx="25" cy="103" rx="6" ry="5.5" fill="#475569"/>

      {/* ── Right arm (extended with flag / floating) ── */}
      <ellipse cx="79" cy="88" rx="8" ry="13" fill="url(#suitGrad)" transform="rotate(15 79 88)"/>
      <ellipse cx="84" cy="100" rx="7" ry="7" fill="#94A3B8"/>
      {/* Glove right */}
      <ellipse cx="84" cy="100" rx="6" ry="5.5" fill="#475569"/>

      {/* ── Legs ── */}
      <ellipse cx="46" cy="120" rx="10" ry="9" fill="url(#suitGrad)" transform="rotate(-5 46 120)"/>
      <ellipse cx="64" cy="121" rx="10" ry="9" fill="url(#suitGrad)" transform="rotate(5 64 121)"/>
      {/* Boots */}
      <ellipse cx="43" cy="128" rx="11" ry="6" fill="#334155"/>
      <ellipse cx="63" cy="129" rx="11" ry="6" fill="#334155"/>

      {/* ── Neck ring ── */}
      <rect x="46" y="64" width="18" height="6" rx="3" fill="#64748B"/>
      <rect x="47" y="65" width="16" height="4" rx="2" fill="#94A3B8"/>

      {/* ── Helmet ── */}
      <circle cx="55" cy="46" r="30" fill="url(#helmetGrad)"/>
      {/* Helmet shadow bottom */}
      <ellipse cx="55" cy="72" rx="20" ry="4" fill="#475569" opacity="0.4"/>

      {/* Visor opening */}
      <ellipse cx="55" cy="46" rx="20" ry="18" fill="#0C1445"/>
      {/* Visor glow fill */}
      <ellipse cx="55" cy="46" rx="19" ry="17" fill="url(#visorGlow)" opacity="0.85" filter="url(#softGlow)"/>

      {/* Stars inside visor */}
      <circle cx="44" cy="38" r="1" fill="white" opacity="0.7"/>
      <circle cx="62" cy="35" r="1.2" fill="white" opacity="0.9"/>
      <circle cx="48" cy="52" r="0.8" fill="white" opacity="0.5"/>
      <circle cx="65" cy="50" r="1" fill="white" opacity="0.6"/>
      <circle cx="57" cy="42" r="0.6" fill="white" opacity="0.8"/>

      {/* Face / eyes through visor */}
      <circle cx="49" cy="44" r="4" fill="#1E3A5F" opacity="0.6"/>
      <circle cx="61" cy="44" r="4" fill="#1E3A5F" opacity="0.6"/>
      <circle cx="49" cy="44" r="2.5" fill="#38BDF8" opacity="0.9"/>
      <circle cx="61" cy="44" r="2.5" fill="#38BDF8" opacity="0.9"/>
      {/* Eye shine */}
      <circle cx="50" cy="43" r="1" fill="white" opacity="0.8"/>
      <circle cx="62" cy="43" r="1" fill="white" opacity="0.8"/>

      {/* Smile */}
      <path d="M50 52 Q55 56 60 52" stroke="rgba(56,189,248,0.6)" strokeWidth="1.5" fill="none" strokeLinecap="round"/>

      {/* Visor reflection highlight */}
      <ellipse cx="45" cy="35" rx="6" ry="4" fill="white" opacity="0.12" transform="rotate(-20 45 35)"/>

      {/* Helmet shine top */}
      <ellipse cx="46" cy="24" rx="8" ry="5" fill="white" opacity="0.2" transform="rotate(-15 46 24)"/>

      {/* ── Antenna ── */}
      <line x1="55" y1="16" x2="55" y2="5" stroke="url(#antennae)" strokeWidth="2" strokeLinecap="round"/>
      <circle cx="55" cy="4" r="3" fill="#38BDF8" filter="url(#glow)"/>
      <circle cx="55" cy="4" r="1.5" fill="white"/>

      {/* Side details on helmet */}
      <circle cx="28" cy="46" r="3" fill="#64748B"/>
      <circle cx="82" cy="46" r="3" fill="#64748B"/>
      <circle cx="29" cy="46" r="1.5" fill="#94A3B8"/>
      <circle cx="83" cy="46" r="1.5" fill="#94A3B8"/>
    </svg>
  )
}

export default function Login() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Ошибка входа')
      login(data.token, data.user)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const inputStyle = {
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(56,189,248,0.15)',
    color: '#F1F5F9',
    borderRadius: '10px',
    padding: '13px 16px',
    fontFamily: "'DM Sans', sans-serif",
    fontSize: '15px',
    width: '100%',
    outline: 'none',
    boxSizing: 'border-box',
    transition: 'border-color 0.2s, background 0.2s',
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: '#050A18',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: "'DM Sans', sans-serif",
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Stars background */}
      {[...Array(60)].map((_, i) => (
        <div key={i} style={{
          position: 'fixed',
          width: i % 7 === 0 ? '2px' : i % 3 === 0 ? '1.5px' : '1px',
          height: i % 7 === 0 ? '2px' : i % 3 === 0 ? '1.5px' : '1px',
          background: 'white',
          borderRadius: '50%',
          top: `${((i * 137.508) % 100).toFixed(2)}%`,
          left: `${((i * 97.318) % 100).toFixed(2)}%`,
          opacity: (0.08 + (i % 8) * 0.04).toFixed(2),
          pointerEvents: 'none',
        }} />
      ))}

      {/* Cosmic nebula glow blobs */}
      <div style={{ position: 'fixed', top: '-150px', left: '-100px', width: '500px', height: '500px', background: 'radial-gradient(circle, rgba(99,102,241,0.1) 0%, transparent 70%)', pointerEvents: 'none' }} />
      <div style={{ position: 'fixed', bottom: '-150px', right: '-100px', width: '500px', height: '500px', background: 'radial-gradient(circle, rgba(14,165,233,0.08) 0%, transparent 70%)', pointerEvents: 'none' }} />
      <div style={{ position: 'fixed', top: '30%', right: '10%', width: '300px', height: '300px', background: 'radial-gradient(circle, rgba(139,92,246,0.06) 0%, transparent 70%)', pointerEvents: 'none' }} />

      <div style={{ width: '100%', maxWidth: '400px', padding: '0 24px', position: 'relative', zIndex: 1 }}>

        {/* ── Astronaut + Branding ──────────────────── */}
        <div style={{ textAlign: 'center', marginBottom: '36px' }}>
          {/* Floating astronaut */}
          <div style={{
            display: 'inline-block',
            marginBottom: '16px',
            filter: 'drop-shadow(0 0 20px rgba(56,189,248,0.35))',
            animation: 'float 4s ease-in-out infinite',
          }}>
            <AstronautLogo />
          </div>

          <div>
            <div style={{
              fontSize: '26px',
              fontWeight: '800',
              color: '#F1F5F9',
              letterSpacing: '2px',
              textTransform: 'uppercase',
              lineHeight: '1.1',
            }}>
              TUNE,{' '}
              <span style={{
                background: 'linear-gradient(135deg, #38BDF8, #6366F1)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}>TRACK</span>{' '}
              ME!
            </div>
            <div style={{
              marginTop: '6px',
              fontSize: '11px',
              color: 'rgba(56,189,248,0.45)',
              letterSpacing: '2px',
              textTransform: 'uppercase',
            }}>
              TUNE Consulting · Система задач
            </div>
          </div>
        </div>

        {/* ── Login card ────────────────────────────── */}
        <div style={{
          background: 'rgba(14,20,40,0.8)',
          border: '1px solid rgba(56,189,248,0.12)',
          borderRadius: '20px',
          padding: '36px 32px',
          backdropFilter: 'blur(16px)',
          boxShadow: '0 0 60px rgba(56,189,248,0.06), 0 20px 40px rgba(0,0,0,0.4)',
        }}>
          <h2 style={{
            margin: '0 0 28px',
            fontSize: '17px',
            fontWeight: '600',
            color: 'rgba(255,255,255,0.7)',
            textAlign: 'center',
            letterSpacing: '0.3px',
          }}>
            Войти в систему
          </h2>

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '18px' }}>
              <label style={{
                display: 'block',
                marginBottom: '8px',
                fontSize: '11px',
                fontWeight: '600',
                color: 'rgba(56,189,248,0.5)',
                textTransform: 'uppercase',
                letterSpacing: '1px',
              }}>
                Логин
              </label>
              <input
                type="text"
                value={username}
                onChange={e => setUsername(e.target.value)}
                placeholder="Введите логин"
                required
                style={inputStyle}
                onFocus={e => { e.target.style.borderColor = 'rgba(56,189,248,0.55)'; e.target.style.background = 'rgba(56,189,248,0.05)' }}
                onBlur={e => { e.target.style.borderColor = 'rgba(56,189,248,0.15)'; e.target.style.background = 'rgba(255,255,255,0.04)' }}
              />
            </div>

            <div style={{ marginBottom: '28px' }}>
              <label style={{
                display: 'block',
                marginBottom: '8px',
                fontSize: '11px',
                fontWeight: '600',
                color: 'rgba(56,189,248,0.5)',
                textTransform: 'uppercase',
                letterSpacing: '1px',
              }}>
                Пароль
              </label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Введите пароль"
                required
                style={inputStyle}
                onFocus={e => { e.target.style.borderColor = 'rgba(56,189,248,0.55)'; e.target.style.background = 'rgba(56,189,248,0.05)' }}
                onBlur={e => { e.target.style.borderColor = 'rgba(56,189,248,0.15)'; e.target.style.background = 'rgba(255,255,255,0.04)' }}
              />
            </div>

            {error && (
              <div style={{
                marginBottom: '20px',
                background: 'rgba(239,68,68,0.08)',
                border: '1px solid rgba(239,68,68,0.25)',
                borderRadius: '10px',
                padding: '10px 14px',
                fontSize: '13px',
                color: '#FCA5A5',
              }}>
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                background: loading
                  ? 'rgba(56,189,248,0.2)'
                  : 'linear-gradient(135deg, #0EA5E9, #6366F1)',
                border: 'none',
                color: 'white',
                borderRadius: '10px',
                padding: '14px',
                cursor: loading ? 'not-allowed' : 'pointer',
                fontFamily: "'DM Sans', sans-serif",
                fontSize: '15px',
                fontWeight: '700',
                boxShadow: loading ? 'none' : '0 4px 24px rgba(14,165,233,0.35)',
                transition: 'all 0.2s',
                letterSpacing: '0.5px',
              }}
            >
              {loading ? 'Вход...' : 'Войти'}
            </button>
          </form>
        </div>

        <p style={{
          textAlign: 'center',
          marginTop: '20px',
          fontSize: '11px',
          color: 'rgba(255,255,255,0.15)',
          letterSpacing: '0.5px',
        }}>
          © 2026 TUNE Consulting · Ташкент
        </p>
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(-1deg); }
          50% { transform: translateY(-10px) rotate(1deg); }
        }
      `}</style>
    </div>
  )
}
