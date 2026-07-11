/**
 * CodeMind AI — Shared UI Components
 */

import React from 'react'

/* ── Spinner ─────────────────────────────────────────────── */
export function Spinner({ size = 18 }) {
  return (
    <div style={{
      width: size, height: size,
      border: '2px solid rgba(255,255,255,0.1)',
      borderTopColor: '#7c6cfa',
      borderRadius: '50%',
      animation: 'spin 0.8s linear infinite',
      flexShrink: 0
    }} />
  )
}

/* ── Loading Bar ─────────────────────────────────────────── */
export function LoadingMessage({ text = 'Processing' }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: '#9898b0', fontSize: 13, padding: '24px 20px' }}>
      <Spinner />
      <span>{text}</span>
      <span>
        {[0, 0.2, 0.4].map((d, i) => (
          <span key={i} style={{ animation: `blink 1.2s ${d}s infinite`, display: 'inline-block' }}>.</span>
        ))}
      </span>
    </div>
  )
}

/* ── Badge ───────────────────────────────────────────────── */
const BADGE_STYLES = {
  ok:   { bg: 'rgba(74,222,128,0.1)',  color: '#4ade80', border: 'rgba(74,222,128,0.2)' },
  warn: { bg: 'rgba(251,191,36,0.1)',  color: '#fbbf24', border: 'rgba(251,191,36,0.2)' },
  err:  { bg: 'rgba(248,113,113,0.1)', color: '#f87171', border: 'rgba(248,113,113,0.2)' },
  info: { bg: 'rgba(96,165,250,0.1)',  color: '#60a5fa', border: 'rgba(96,165,250,0.2)' },
}

export function Badge({ type = 'ok', children }) {
  const s = BADGE_STYLES[type]
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 5,
      fontSize: 11, fontWeight: 600, padding: '3px 10px',
      borderRadius: 100, textTransform: 'uppercase', letterSpacing: '0.5px',
      background: s.bg, color: s.color, border: `1px solid ${s.border}`
    }}>
      {children}
    </span>
  )
}

/* ── Button ──────────────────────────────────────────────── */
export function Button({ children, onClick, disabled, variant = 'primary', style = {} }) {
  const base = {
    fontFamily: "'Syne', sans-serif",
    fontWeight: 700, fontSize: 13,
    padding: '10px 22px',
    borderRadius: 10, border: 'none',
    cursor: disabled ? 'not-allowed' : 'pointer',
    transition: 'all 0.2s',
    opacity: disabled ? 0.5 : 1,
    letterSpacing: '0.3px',
    ...style
  }
  const variants = {
    primary: { background: 'linear-gradient(135deg,#7c6cfa,#5b4de0)', color: '#fff' },
    ghost:   { background: 'transparent', color: '#9898b0', border: '1px solid rgba(255,255,255,0.13)' },
    icon:    { background: '#1a1a24', color: '#9898b0', border: '1px solid rgba(255,255,255,0.13)', padding: '6px 12px', fontSize: 12, fontWeight: 500 }
  }
  return (
    <button style={{ ...base, ...variants[variant] }} onClick={onClick} disabled={disabled}>
      {children}
    </button>
  )
}

/* ── Card ────────────────────────────────────────────────── */
export function Card({ children, style = {} }) {
  return (
    <div style={{
      background: '#111118',
      border: '1px solid rgba(255,255,255,0.07)',
      borderRadius: 16,
      overflow: 'hidden',
      ...style
    }}>
      {children}
    </div>
  )
}

export function CardHeader({ title, right }) {
  return (
    <div style={{
      padding: '14px 20px',
      borderBottom: '1px solid rgba(255,255,255,0.07)',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12
    }}>
      <span style={{ fontSize: 12, fontWeight: 700, color: '#9898b0', textTransform: 'uppercase', letterSpacing: '1px' }}>
        {title}
      </span>
      {right}
    </div>
  )
}

/* ── Code Block ──────────────────────────────────────────── */
export function CodeBlock({ html, lang = '', onCopy, onDownload, onSpeak }) {
  return (
    <div style={{ background: '#0a0a0f', borderRadius: 10, border: '1px solid rgba(255,255,255,0.07)', overflow: 'hidden' }}>
      {/* Toolbar */}
      <div style={{ padding: '8px 14px', borderBottom: '1px solid rgba(255,255,255,0.07)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#1a1a24' }}>
        <div style={{ display: 'flex', gap: 6 }}>
          <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#ef4444' }} />
          <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#f59e0b' }} />
          <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#22c55e' }} />
        </div>
        <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11, color: '#5a5a70' }}>{lang}</span>
        <div style={{ display: 'flex', gap: 6 }}>
          {onCopy    && <Button variant="icon" onClick={onCopy}>📋 Copy</Button>}
          {onDownload && <Button variant="icon" onClick={onDownload}>⬇ Save</Button>}
          {onSpeak   && <Button variant="icon" onClick={onSpeak}>🔊 Read</Button>}
        </div>
      </div>
      {/* Code */}
      <pre style={{
        padding: 20, overflowX: 'auto', overflowY: 'auto',
        fontFamily: 'JetBrains Mono, monospace', fontSize: 13, lineHeight: 1.7,
        color: '#e8e8f0', maxHeight: 380
      }} dangerouslySetInnerHTML={{ __html: html }} />
    </div>
  )
}

/* ── Language Select ─────────────────────────────────────── */
export const LANGUAGES = [
  { value: 'python',     label: '🐍 Python' },
  { value: 'javascript', label: '🟨 JavaScript' },
  { value: 'typescript', label: '🔷 TypeScript' },
  { value: 'java',       label: '☕ Java' },
  { value: 'cpp',        label: '⚙️ C++' },
  { value: 'c',          label: '🔧 C' },
  { value: 'csharp',     label: '🔵 C#' },
  { value: 'go',         label: '🐹 Go' },
  { value: 'rust',       label: '🦀 Rust' },
  { value: 'swift',      label: '🍎 Swift' },
  { value: 'kotlin',     label: '🎯 Kotlin' },
  { value: 'php',        label: '🐘 PHP' },
  { value: 'ruby',       label: '💎 Ruby' },
  { value: 'html',       label: '🌐 HTML/CSS' },
  { value: 'sql',        label: '🗄️ SQL' },
  { value: 'bash',       label: '💻 Bash' },
  { value: 'dart',       label: '🎯 Dart' },
  { value: 'r',          label: '📊 R' },
]

export function LangSelect({ value, onChange, id }) {
  return (
    <select
      id={id}
      value={value}
      onChange={e => onChange(e.target.value)}
      style={{
        fontFamily: "'Syne', sans-serif", fontSize: 13, fontWeight: 500,
        background: '#1a1a24', border: '1px solid rgba(255,255,255,0.13)',
        color: '#e8e8f0', borderRadius: 10, padding: '8px 12px', cursor: 'pointer', outline: 'none'
      }}
    >
      {LANGUAGES.map(l => <option key={l.value} value={l.value}>{l.label}</option>)}
    </select>
  )
}

/* ── Placeholder ─────────────────────────────────────────── */
export function Placeholder({ icon, text }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '60px 20px', color: '#5a5a70', textAlign: 'center', gap: 12 }}>
      <div style={{ fontSize: 40 }}>{icon}</div>
      <div style={{ fontSize: 14, maxWidth: 260, lineHeight: 1.5 }}>{text}</div>
    </div>
  )
}

/* ── Voice Button ────────────────────────────────────────── */
export function VoiceButton({ isRecording, onToggle }) {
  return (
    <button
      onClick={onToggle}
      title={isRecording ? 'Stop recording' : 'Voice input'}
      style={{
        width: 40, height: 40, borderRadius: '50%',
        border: `1px solid ${isRecording ? '#f87171' : 'rgba(255,255,255,0.13)'}`,
        background: isRecording ? 'rgba(248,113,113,0.12)' : '#1a1a24',
        color: isRecording ? '#f87171' : '#9898b0',
        cursor: 'pointer', fontSize: 18, display: 'flex', alignItems: 'center', justifyContent: 'center',
        animation: isRecording ? 'pulseRed 1s infinite' : 'none',
        transition: 'all 0.2s', flexShrink: 0
      }}
    >
      {isRecording ? '⏹' : '🎤'}
    </button>
  )
}
