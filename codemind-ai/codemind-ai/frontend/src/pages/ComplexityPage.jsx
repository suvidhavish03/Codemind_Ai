import React, { useState } from 'react'
import LanguageSelect from '../components/LanguageSelect'
import { analyzeComplexity } from '../utils/claude'

export default function ComplexityPage() {
  const [code, setCode] = useState('')
  const [language, setLanguage] = useState('python')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)

  const handleAnalyze = async () => {
    if (!code.trim()) return
    setLoading(true); setError(null); setResult(null)
    try {
      const data = await analyzeComplexity(code, language)
      setResult(data)
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  const ratingColors = { excellent: 'var(--green)', good: 'var(--cyan)', fair: 'var(--yellow)', poor: 'var(--red)' }

  return (
    <div>
      <div style={{ padding: '28px 0 18px' }}>
        <h2 style={{ fontSize: 22, fontWeight: 800, color: '#fff' }}>Complexity Analyzer</h2>
        <p style={{ fontSize: 13, color: 'var(--text2)', marginTop: 4 }}>Analyze time and space complexity with bottleneck detection and optimization tips</p>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16, flexWrap: 'wrap' }}>
        <LanguageSelect value={language} onChange={setLanguage} />
        <button className="gen-btn" onClick={handleAnalyze} disabled={loading || !code.trim()}>
          {loading ? '⏳ Analyzing...' : '📊 Analyze'}
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        <div className="card">
          <div className="card-header"><span className="card-title">Your Algorithm</span></div>
          <div style={{ padding: 12 }}>
            <textarea
              rows={18}
              value={code}
              onChange={e => setCode(e.target.value)}
              placeholder={`Paste your algorithm here...\n\n# Example:\ndef bubble_sort(arr):\n    n = len(arr)\n    for i in range(n):\n        for j in range(n-i-1):\n            if arr[j] > arr[j+1]:\n                arr[j], arr[j+1] = arr[j+1], arr[j]\n    return arr`}
            />
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <span className="card-title">Analysis Results</span>
            {result && <span className="badge ok" style={{ color: ratingColors[result.overall_rating] }}>● {result.overall_rating}</span>}
          </div>

          {loading && (
            <div className="loading">
              <div className="spinner" />
              Analyzing complexity
              <span className="thinking-dots"><span>.</span><span>.</span><span>.</span></span>
            </div>
          )}
          {error && <div style={{ padding: 16, color: 'var(--red)', fontSize: 13 }}>⚠ {error}</div>}
          {!result && !loading && !error && (
            <div className="placeholder">
              <div className="placeholder-icon">📊</div>
              <div className="placeholder-text">Paste your algorithm and click Analyze</div>
            </div>
          )}

          {result && (
            <div style={{ padding: 16, overflowY: 'auto', maxHeight: 520 }}>
              {/* Big-O Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
                {[
                  { val: result.time_complexity, label: 'Time Complexity', color: 'var(--cyan)' },
                  { val: result.space_complexity, label: 'Space Complexity', color: 'var(--pink)' },
                  { val: result.best_case, label: 'Best Case', color: 'var(--green)' },
                  { val: result.worst_case, label: 'Worst Case', color: 'var(--red)' },
                ].map((item, i) => (
                  <div key={i} style={{ background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: 14, textAlign: 'center' }}>
                    <div style={{ fontSize: 26, fontWeight: 800, fontFamily: 'var(--font-mono)', color: item.color, marginBottom: 4 }}>{item.val}</div>
                    <div style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: 1, color: 'var(--text2)' }}>{item.label}</div>
                  </div>
                ))}
              </div>

              {/* Explanation */}
              <div style={{ padding: 14, background: 'var(--bg3)', borderRadius: 'var(--radius)', border: '1px solid var(--border)', marginBottom: 14 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text2)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 10 }}>
                  Overall: <span style={{ color: ratingColors[result.overall_rating], textTransform: 'capitalize' }}>{result.overall_rating}</span>
                </div>
                <div style={{ fontSize: 12, color: 'var(--text2)', lineHeight: 1.65, marginBottom: 8 }}>
                  <strong style={{ color: 'var(--text)' }}>Time:</strong> {result.time_explanation}
                </div>
                <div style={{ fontSize: 12, color: 'var(--text2)', lineHeight: 1.65 }}>
                  <strong style={{ color: 'var(--text)' }}>Space:</strong> {result.space_explanation}
                </div>
              </div>

              {/* Bottlenecks */}
              {result.bottlenecks?.length > 0 && (
                <div style={{ marginBottom: 14 }}>
                  <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, color: 'var(--yellow)', marginBottom: 8 }}>⚡ Bottlenecks</div>
                  {result.bottlenecks.map((b, i) => (
                    <div key={i} style={{ fontSize: 12, color: 'var(--text2)', padding: '6px 12px', background: 'rgba(251,191,36,0.06)', borderRadius: 6, marginBottom: 5, borderLeft: '2px solid var(--yellow)' }}>• {b}</div>
                  ))}
                </div>
              )}

              {/* Optimizations */}
              {result.optimizations?.length > 0 && (
                <div>
                  <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, color: 'var(--green)', marginBottom: 8 }}>💡 Optimizations</div>
                  {result.optimizations.map((o, i) => (
                    <div key={i} style={{ fontSize: 12, color: 'var(--text2)', padding: '6px 12px', background: 'rgba(74,222,128,0.06)', borderRadius: 6, marginBottom: 5, borderLeft: '2px solid var(--green)' }}>• {o}</div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
