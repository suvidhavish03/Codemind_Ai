import React, { useState } from 'react'
import { LANGUAGES } from '../utils/syntax'
import CodeBlock from '../components/CodeBlock'
import { convertCode } from '../utils/claude'

const SUBSET = ['python','javascript','typescript','java','cpp','go','rust','csharp','php','ruby']
const LANGS = LANGUAGES.filter(l => SUBSET.includes(l.value))

export default function ConverterPage() {
  const [code, setCode] = useState('')
  const [fromLang, setFromLang] = useState('python')
  const [toLang, setToLang] = useState('javascript')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)

  const handleConvert = async () => {
    if (!code.trim()) return
    if (fromLang === toLang) { alert('Source and target language must be different!'); return }
    setLoading(true); setError(null); setResult(null)
    try {
      const data = await convertCode(code, fromLang, toLang)
      setResult(data)
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  const swap = () => {
    const tmp = fromLang; setFromLang(toLang); setToLang(tmp)
    if (result?.converted_code) setCode(result.converted_code)
    setResult(null)
  }

  return (
    <div>
      <div style={{ padding: '28px 0 18px' }}>
        <h2 style={{ fontSize: 22, fontWeight: 800, color: '#fff' }}>Code Converter</h2>
        <p style={{ fontSize: 13, color: 'var(--text2)', marginTop: 4 }}>Convert code between any two languages while preserving all logic perfectly</p>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 20, flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 11, color: 'var(--text2)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1 }}>From</span>
          <select className="lang-select" value={fromLang} onChange={e => setFromLang(e.target.value)}>
            {LANGS.map(l => <option key={l.value} value={l.value}>{l.label}</option>)}
          </select>
        </div>
        <button onClick={swap} style={{ width: 36, height: 36, borderRadius: '50%', border: '1px solid var(--border2)', background: 'var(--bg3)', color: 'var(--accent)', cursor: 'pointer', fontSize: 16, transition: 'all 0.2s', display:'flex',alignItems:'center',justifyContent:'center' }}
          onMouseOver={e => e.target.style.background='rgba(124,108,250,0.15)'}
          onMouseOut={e => e.target.style.background='var(--bg3)'}>⇄</button>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 11, color: 'var(--text2)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1 }}>To</span>
          <select className="lang-select" value={toLang} onChange={e => setToLang(e.target.value)}>
            {LANGS.map(l => <option key={l.value} value={l.value}>{l.label}</option>)}
          </select>
        </div>
        <button className="gen-btn" onClick={handleConvert} disabled={loading || !code.trim()}>
          {loading ? '⏳ Converting...' : '🔄 Convert'}
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        <div className="card">
          <div className="card-header">
            <span className="card-title">Source Code</span>
            <span style={{ fontSize: 11, color: 'var(--text3)' }}>{fromLang}</span>
          </div>
          <div style={{ padding: 12 }}>
            <textarea rows={18} value={code} onChange={e => setCode(e.target.value)} placeholder={`Paste your ${fromLang} code to convert...`} />
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <span className="card-title">Converted Code</span>
            {result && <span className="badge ok">✓ {toLang}</span>}
          </div>

          {loading && (
            <div className="loading">
              <div className="spinner" />
              Converting to {toLang}
              <span className="thinking-dots"><span>.</span><span>.</span><span>.</span></span>
            </div>
          )}
          {error && <div style={{ padding: 16, color: 'var(--red)', fontSize: 13 }}>⚠ {error}</div>}
          {!result && !loading && !error && (
            <div className="placeholder">
              <div className="placeholder-icon">🔄</div>
              <div className="placeholder-text">Your converted code will appear here</div>
            </div>
          )}
          {result && (
            <div style={{ padding: 12 }}>
              <CodeBlock code={result.converted_code} language={toLang} />
              {result.notes?.length > 0 && (
                <div style={{ marginTop: 12, padding: 12, background: 'rgba(96,165,250,0.07)', border: '1px solid rgba(96,165,250,0.2)', borderRadius: 'var(--radius)' }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--blue)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: 1 }}>📝 Conversion Notes</div>
                  {result.notes.map((n, i) => <div key={i} style={{ fontSize: 12, color: 'var(--text2)', marginBottom: 4 }}>• {n}</div>)}
                </div>
              )}
              {result.warnings?.length > 0 && (
                <div style={{ marginTop: 10, padding: 12, background: 'rgba(251,191,36,0.07)', border: '1px solid rgba(251,191,36,0.2)', borderRadius: 'var(--radius)' }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--yellow)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: 1 }}>⚠ Warnings</div>
                  {result.warnings.map((w, i) => <div key={i} style={{ fontSize: 12, color: 'var(--text2)', marginBottom: 4 }}>• {w}</div>)}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
