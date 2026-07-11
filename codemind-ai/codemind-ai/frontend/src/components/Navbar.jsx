import React from 'react'

const TABS = [
  { id: 'generator', label: '⚡ Generate' },
  { id: 'chat',      label: '💬 Chat' },
  { id: 'debugger',  label: '🐛 Debug' },
  { id: 'converter', label: '🔄 Convert' },
  { id: 'complexity',label: '📊 Analyze' },
]

export default function Navbar({ activePage, setActivePage }) {
  return (
    <nav style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '14px 32px',
      borderBottom: '1px solid var(--border)',
      backdropFilter: 'blur(20px)',
      background: 'rgba(10,10,15,0.85)',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      flexWrap: 'wrap',
      gap: '12px'
    }}>
      <div style={{
        fontSize: '20px',
        fontWeight: 800,
        letterSpacing: '-0.5px',
        color: '#fff',
        fontFamily: 'var(--font-display)'
      }}>
        Code<span style={{ color: 'var(--accent)' }}>Mind</span> AI
      </div>

      <div style={{
        display: 'flex',
        gap: '4px',
        background: 'var(--bg2)',
        padding: '4px',
        borderRadius: 'var(--radius)',
        border: '1px solid var(--border)',
        flexWrap: 'wrap'
      }}>
        {TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActivePage(tab.id)}
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: '13px',
              fontWeight: 600,
              padding: '7px 16px',
              borderRadius: '7px',
              border: 'none',
              cursor: 'pointer',
              background: activePage === tab.id ? 'var(--accent)' : 'transparent',
              color: activePage === tab.id ? '#fff' : 'var(--text2)',
              transition: 'all 0.2s'
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </nav>
  )
}
