import React, { useState } from 'react'
import LanguageSelect from '../components/LanguageSelect'
import CodeBlock from '../components/CodeBlock'
import { generateCode } from '../utils/claude'
import { useVoiceInput, useSpeech } from '../hooks/useVoice'

const QUICK_PROMPTS = [
  'Build a REST API with CRUD operations',
  'Create a login form with validation',
  'Implement binary search algorithm',
  'Build a todo app with localStorage',
  'Sort an array using quicksort',
  'Create a linked list data structure',
]

const FEATURES = [
  { icon: '⚡', name: 'Instant Generation', desc: 'Get production-ready code from plain English in any language.' },
  { icon: '🎓', name: 'Line-by-Line Explanations', desc: 'Every line explained so you actually understand what it does.' },
  { icon: '🌍', name: '18+ Languages', desc: 'Python, JS, Java, Go, Rust, C++, SQL and many more.' },
  { icon: '🎤', name: 'Voice Input', desc: 'Speak your prompt instead of typing (Chrome/Edge).' },
  { icon: '🧠', name: 'Smart Context', desc: 'AI adapts explanation style to beginner or advanced mode.' },
  { icon: '📋', name: 'Copy & Download', desc: 'One-click copy or download as a file.' },
]

export default function GeneratorPage() {
  const [prompt, setPrompt] = useState('')
  const [language, setLanguage] = useState('python')
  const [mode, setMode] = useState('beginner')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)

  const { isRecording, toggle: toggleVoice } = useVoiceInput(text => setPrompt(text))
  const { speak } = useSpeech()

  const handleGenerate = async () => {
    if (!prompt.trim()) return
    setLoading(true)
    setError(null)
    setResult(null)
    try {
      const data = await generateCode(prompt, language, mode)
      setResult(data)
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  const handleSpeakExplanation = () => {
    if (!result?.explanations) return
    const text = 'Here is the explanation. ' + result.explanations.map(e => e.explanation).join('. ')
    speak(text)
  }

  const handleKeyDown = (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') handleGenerate()
  }

  return (
    <div>
      {/* Hero */}
      <div style={{ padding: '72px 0 48px', textAlign: 'center', maxWidth: 820, margin: '0 auto' }}>
        <h1 style={{
          fontSize: 'clamp(42px, 6.5vw, 72px)',
          fontWeight: 800,
          lineHeight: 1.05,
          letterSpacing: -2,
          color: '#fff',
          marginBottom: 18
        }}>
          Write Code with<br />
          <span style={{
            background: 'linear-gradient(135deg, var(--accent), var(--cyan))',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>
            Superhuman Speed
          </span>
        </h1>
        <p style={{
          fontSize: 17,
          color: 'var(--text2)',
          maxWidth: 520,
          margin: '0 auto',
          lineHeight: 1.65,
          fontWeight: 400
        }}>
          Describe what you need — get clean, explained, production-ready code instantly.
        </p>
      </div>

      {/* Controls */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap', marginBottom: 14 }}>
        <LanguageSelect value={language} onChange={setLanguage} />
        {['beginner', 'advanced'].map(m => (
          <button key={m} onClick={() => setMode(m)} style={{
            fontFamily: 'var(--font-display)', fontSize: 12, fontWeight: 700,
            padding: '6px 16px', borderRadius: 100,
            border: `1px solid ${mode === m ? 'var(--accent)' : 'var(--border2)'}`,
            background: mode === m ? 'rgba(124,108,250,0.15)' : 'transparent',
            color: mode === m ? 'var(--accent)' : 'var(--text2)',
            cursor: 'pointer', textTransform: 'capitalize', transition: 'all 0.2s'
          }}>
            {m === 'beginner' ? '🎓' : '⚡'} {m} Mode
          </button>
        ))}
        <button
          className={`voice-btn ${isRecording ? 'recording' : ''}`}
          onClick={toggleVoice}
          title="Voice input"
        >
          {isRecording ? '⏹' : '🎤'}
        </button>
      </div>

      {/* Prompt Input */}
      <textarea
        rows={4}
        value={prompt}
        onChange={e => setPrompt(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="e.g. Create a binary search function in Python with detailed comments...
(Ctrl+Enter to generate)"
      />

      {/* Action Row */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 12, gap: 12, flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', flex: 1 }}>
          {QUICK_PROMPTS.map(p => (
            <button
              key={p}
              onClick={() => setPrompt(p)}
              style={{
                fontFamily: 'var(--font-display)', fontSize: 11, padding: '5px 12px',
                borderRadius: 100, border: '1px solid var(--border2)', background: 'transparent',
                color: 'var(--text2)', cursor: 'pointer', transition: 'all 0.2s', whiteSpace: 'nowrap'
              }}
              onMouseOver={e => { e.target.style.background = 'var(--bg3)'; e.target.style.color = 'var(--text)'; e.target.style.borderColor = 'var(--accent)' }}
              onMouseOut={e => { e.target.style.background = 'transparent'; e.target.style.color = 'var(--text2)'; e.target.style.borderColor = 'var(--border2)' }}
            >
              {p}
            </button>
          ))}
        </div>
        <button className="gen-btn" onClick={handleGenerate} disabled={loading || !prompt.trim()}>
          {loading ? '⏳ Generating...' : '⚡ Generate Code'}
        </button>
      </div>

      {/* Loading */}
      {loading && (
        <div className="loading">
          <div className="spinner" />
          Generating your code
          <span className="thinking-dots"><span>.</span><span>.</span><span>.</span></span>
        </div>
      )}

      {/* Error */}
      {error && (
        <div style={{ marginTop: 20, padding: 16, background: 'rgba(248,113,113,0.08)', border: '1px solid rgba(248,113,113,0.2)', borderRadius: 'var(--radius)', color: 'var(--red)', fontSize: 13 }}>
          ⚠ {error}
        </div>
      )}

      {/* Output */}
      {result && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginTop: 28 }}>
          <div className="card">
            <div className="card-header">
              <span className="card-title">Generated Code</span>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <button className="icon-btn" onClick={handleSpeakExplanation}>🔊 Read</button>
                <span className="badge ok">✓ Ready</span>
              </div>
            </div>
            <div style={{ padding: 12 }}>
              <CodeBlock code={result.code} language={language} />
              {result.summary && (
                <p style={{ marginTop: 10, fontSize: 12, color: 'var(--text2)', lineHeight: 1.5, padding: '8px 12px', background: 'rgba(124,108,250,0.06)', borderRadius: 'var(--radius)', borderLeft: '2px solid var(--accent)' }}>
                  💡 {result.summary}
                </p>
              )}
            </div>
          </div>

          <div className="card">
            <div className="card-header">
              <span className="card-title">Line-by-Line Explanation</span>
              <span className="badge ok">{mode === 'beginner' ? '🎓 Beginner' : '⚡ Advanced'}</span>
            </div>
            <div style={{ padding: 12 }}>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 6, maxHeight: 440, overflowY: 'auto' }}>
                {(result.explanations || []).map((item, i) => (
                  <li key={i} style={{
                    display: 'flex', gap: 12, padding: '10px 12px',
                    background: 'var(--bg3)', borderRadius: 'var(--radius)',
                    border: '1px solid var(--border)',
                    animation: 'fadeIn 0.3s ease both',
                    animationDelay: `${i * 0.04}s`
                  }}>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--accent)', fontWeight: 700, minWidth: 28, paddingTop: 2 }}>
                      L{item.line}
                    </div>
                    <div>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--cyan)', display: 'block', marginBottom: 4 }}>
                        {item.code}
                      </span>
                      <span style={{ fontSize: 12, color: 'var(--text2)', lineHeight: 1.5 }}>
                        {item.explanation}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Feature cards when empty */}
      {!result && !loading && !error && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginTop: 40 }}>
          {FEATURES.map((f, i) => (
            <div key={i} style={{
              background: 'var(--bg2)', border: '1px solid var(--border)',
              borderRadius: 'var(--radius-lg)', padding: 24, transition: 'all 0.3s', cursor: 'default'
            }}
              onMouseOver={e => { e.currentTarget.style.borderColor = 'var(--accent)'; e.currentTarget.style.background = 'rgba(124,108,250,0.05)' }}
              onMouseOut={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.background = 'var(--bg2)' }}
            >
              <div style={{ fontSize: 26, marginBottom: 10 }}>{f.icon}</div>
              <div style={{ fontSize: 14, fontWeight: 700, color: '#fff', marginBottom: 6 }}>{f.name}</div>
              <div style={{ fontSize: 12, color: 'var(--text2)', lineHeight: 1.55 }}>{f.desc}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

