import React, { useState } from 'react'
import LanguageSelect from '../components/LanguageSelect'
import CodeBlock from '../components/CodeBlock'
import { detectBugs } from '../utils/claude'

export default function DebuggerPage() {
  const [code, setCode] = useState('')
  const [language, setLanguage] = useState('python')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)

  const handleDebug = async () => {
    if (!code.trim()) return
    setLoading(true)
    setError(null)
    setResult(null)
    try {
      const data = await detectBugs(code, language)
      setResult(data)
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  const severityColors = { error: 'var(--red)', warning: 'var(--yellow)', info: 'var(--blue)' }
  const severityIcons = { error: '❌', warning: '⚠️', info: 'ℹ️' }

  return (
    <div>
      <div style={{ padding: '28px 0 18px' }}>
        <h2 style={{ fontSize: 22, fontWeight: 800, color: '#fff' }}>AI Bug Detector</h2>
        <p style={{ fontSize: 13, color: 'var(--text2)', marginTop: 4 }}>Paste your code — AI finds every bug, explains it, and shows the fix</p>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16, flexWrap: 'wrap' }}>
        <LanguageSelect value={language} onChange={setLanguage} />
        <button className="gen-btn" onClick={handleDebug} disabled={loading || !code.trim()}>
          {loading ? '⏳ Analyzing...' : '🐛 Detect Bugs'}
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        {/* Input */}
        <div className="card">
          <div className="card-header"><span className="card-title">Paste Your Code</span></div>
          <div style={{ padding: 12 }}>
            <textarea
              rows={18}
              value={code}
              onChange={e => setCode(e.target.value)}
              placeholder={`Paste your ${language} code here...\n\n# Example:\ndef divide(a, b):\n    return a / b\n\nresult = divide(10, 0)  # This will crash!`}
            />
          </div>
        </div>

        {/* Output */}
        <div className="card">
          <div className="card-header">
            <span className="card-title">Bug Analysis</span>
            {result && (
              <span className={`badge ${result.bugs.length === 0 ? 'ok' : result.bugs.length <= 2 ? 'warn' : 'err'}`}>
                {result.bugs.length === 0 ? '✓ No Bugs' : `⚠ ${result.bugs.length} Issue${result.bugs.length > 1 ? 's' : ''}`}
              </span>
            )}
          </div>

          {loading && (
            <div className="loading">
              <div className="spinner" />
              Analyzing for bugs
              <span className="thinking-dots"><span>.</span><span>.</span><span>.</span></span>
            </div>
          )}

          {error && <div style={{ padding: 16, color: 'var(--red)', fontSize: 13 }}>⚠ {error}</div>}

          {!result && !loading && !error && (
            <div className="placeholder">
              <div className="placeholder-icon">🐛</div>
              <div className="placeholder-text">Paste code and click "Detect Bugs" for a full analysis</div>
            </div>
          )}

          {result && (
            <div style={{ padding: 16, overflowY: 'auto', maxHeight: 520 }}>
              {/* Score */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 14, padding: 14, background: 'var(--bg3)', borderRadius: 'var(--radius)', border: '1px solid var(--border)', marginBottom: 14 }}>
                <div style={{ fontSize: 34, fontWeight: 800, fontFamily: 'var(--font-mono)', color: result.score >= 80 ? 'var(--green)' : result.score >= 50 ? 'var(--yellow)' : 'var(--red)' }}>
                  {result.score}
                </div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)' }}>{result.summary}</div>
                  <div style={{ fontSize: 11, color: 'var(--text2)', marginTop: 3 }}>Code Health Score / 100</div>
                </div>
              </div>

              {/* Bugs */}
              {result.bugs.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '30px 0', color: 'var(--green)' }}>
                  <div style={{ fontSize: 40, marginBottom: 10 }}>✅</div>
                  <div style={{ fontSize: 15, fontWeight: 700 }}>No bugs detected!</div>
                  <div style={{ fontSize: 13, color: 'var(--text2)', marginTop: 6 }}>Your code looks clean and correct.</div>
                </div>
              ) : (
                result.bugs.map((bug, i) => (
                  <div key={i} style={{ marginBottom: 12, padding: 14, background: 'var(--bg3)', borderRadius: 'var(--radius)', border: '1px solid var(--border)', borderLeft: `3px solid ${severityColors[bug.severity]}` }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                      <span>{severityIcons[bug.severity]}</span>
                      <span style={{ fontSize: 11, fontWeight: 700, color: severityColors[bug.severity], textTransform: 'uppercase' }}>{bug.severity}</span>
                      <span style={{ fontSize: 11, color: 'var(--text3)' }}>Line {bug.line}</span>
                    </div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text)', marginBottom: 5 }}>{bug.issue}</div>
                    <div style={{ fontSize: 12, color: 'var(--text2)', marginBottom: 10, lineHeight: 1.5 }}>{bug.explanation}</div>
                    <div style={{ fontSize: 12, background: 'rgba(74,222,128,0.07)', border: '1px solid rgba(74,222,128,0.15)', borderRadius: 6, padding: 10, color: 'var(--green)' }}>
                      💡 Fix: {bug.fix}
                    </div>
                  </div>
                ))
              )}

              {/* Fixed code */}
              {result.fixed_code && result.bugs.length > 0 && (
                <div style={{ marginTop: 16 }}>
                  <div style={{ fontSize: 11, color: 'var(--text2)', marginBottom: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1 }}>✨ Fixed Code</div>
                  <CodeBlock code={result.fixed_code} language={language} />
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
