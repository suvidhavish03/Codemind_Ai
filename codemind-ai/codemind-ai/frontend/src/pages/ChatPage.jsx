import React, { useState, useRef, useEffect } from 'react'
import { chatWithAI } from '../utils/claude'
import { useVoiceInput } from '../hooks/useVoice'
import { syntaxHighlight } from '../utils/syntax'

const SUGGESTIONS = [
  'Explain how async/await works in JavaScript',
  'What is Big O notation?',
  'How does recursion work?',
  'Explain REST API design principles',
  'What are design patterns?',
  'How does garbage collection work?',
]

function renderMessage(text) {
  // Render markdown-like code blocks and inline code
  let html = text
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

  // Code blocks
  html = html.replace(/```(\w*)\n?([\s\S]*?)```/g, (_, lang, code) => {
    const highlighted = syntaxHighlight(code.trim())
    return `<pre style="background:var(--bg);border-radius:var(--radius);padding:14px;margin:10px 0;overflow-x:auto;font-size:12px;border:1px solid var(--border)">${highlighted}</pre>`
  })

  // Inline code
  html = html.replace(/`([^`\n]+)`/g, '<code style="font-family:var(--font-mono);font-size:0.88em;background:var(--bg);padding:1px 5px;border-radius:4px;color:var(--cyan)">$1</code>')

  // Bold
  html = html.replace(/\*\*([^*\n]+)\*\*/g, '<strong style="color:var(--text);font-weight:700">$1</strong>')

  // Newlines
  html = html.replace(/\n/g, '<br/>')

  return html
}

export default function ChatPage() {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef(null)

  const { isRecording, toggle: toggleVoice } = useVoiceInput(text => setInput(text))

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  const sendMessage = async (text) => {
    const msg = (text || input).trim()
    if (!msg) return
    setInput('')

    const userMsg = { role: 'user', content: msg }
    const newHistory = [...messages, userMsg]
    setMessages(newHistory)
    setLoading(true)

    try {
      const apiMessages = newHistory.map(m => ({ role: m.role, content: m.content }))
      const reply = await chatWithAI(apiMessages)
      setMessages(prev => [...prev, { role: 'assistant', content: reply }])
    } catch (e) {
      setMessages(prev => [...prev, { role: 'assistant', content: `⚠️ Error: ${e.message}` }])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '28px 0 18px' }}>
        <div>
          <h2 style={{ fontSize: 22, fontWeight: 800, color: '#fff' }}>AI Coding Assistant</h2>
          <p style={{ fontSize: 13, color: 'var(--text2)', marginTop: 4 }}>Ask anything — debugging, concepts, architecture, algorithms</p>
        </div>
        <button className="icon-btn" onClick={() => setMessages([])} style={{ padding: '8px 16px' }}>
          🗑 Clear Chat
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 240px)', minHeight: 480 }}>
        {/* Messages */}
        <div style={{
          flex: 1, overflowY: 'auto', padding: 20,
          background: 'var(--bg2)', border: '1px solid var(--border)',
          borderRadius: 'var(--radius-lg) var(--radius-lg) 0 0',
          display: 'flex', flexDirection: 'column', gap: 18
        }}>
          {/* Welcome */}
          {messages.length === 0 && (
            <div style={{ display: 'flex', gap: 12 }}>
              <div style={{ width: 34, height: 34, borderRadius: '50%', background: 'linear-gradient(135deg,var(--accent),var(--cyan))', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:700, fontSize:12, color:'#fff', flexShrink:0 }}>CM</div>
              <div style={{ background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: '14px', borderTopLeftRadius: 4, padding: '14px 16px', maxWidth: '80%' }}>
                <p style={{ fontSize: 14, lineHeight: 1.6, marginBottom: 14 }}>👋 Hey! I'm your <strong>CodeMind AI</strong> assistant. I can help you learn programming, debug code, explain concepts, and much more. Try one of these:</p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {SUGGESTIONS.map(s => (
                    <button key={s} onClick={() => sendMessage(s)} style={{
                      fontFamily: 'var(--font-display)', fontSize: 12, padding: '6px 14px',
                      borderRadius: 100, background: 'var(--bg2)', border: '1px solid var(--border2)',
                      color: 'var(--text2)', cursor: 'pointer', transition: 'all 0.2s'
                    }}
                    onMouseOver={e => { e.target.style.background='rgba(124,108,250,0.1)'; e.target.style.borderColor='var(--accent)'; e.target.style.color='var(--text)'; }}
                    onMouseOut={e => { e.target.style.background='var(--bg2)'; e.target.style.borderColor='var(--border2)'; e.target.style.color='var(--text2)'; }}
                    >{s}</button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Messages */}
          {messages.map((msg, i) => (
            <div key={i} style={{ display: 'flex', gap: 12, flexDirection: msg.role === 'user' ? 'row-reverse' : 'row', animation: 'fadeIn 0.3s ease both' }}>
              <div style={{
                width: 34, height: 34, borderRadius: '50%', flexShrink: 0,
                background: msg.role === 'user' ? 'var(--bg3)' : 'linear-gradient(135deg,var(--accent),var(--cyan))',
                border: msg.role === 'user' ? '1px solid var(--border2)' : 'none',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: msg.role === 'user' ? 16 : 12, fontWeight: 700,
                color: msg.role === 'user' ? 'var(--text2)' : '#fff'
              }}>
                {msg.role === 'user' ? '👤' : 'CM'}
              </div>
              <div style={{
                maxWidth: '78%',
                padding: '12px 16px',
                borderRadius: 14,
                borderTopLeftRadius: msg.role === 'assistant' ? 4 : 14,
                borderTopRightRadius: msg.role === 'user' ? 4 : 14,
                fontSize: 14,
                lineHeight: 1.65,
                background: msg.role === 'user' ? 'linear-gradient(135deg,var(--accent),var(--accent2))' : 'var(--bg3)',
                border: msg.role === 'user' ? 'none' : '1px solid var(--border)',
                color: msg.role === 'user' ? '#fff' : 'var(--text)'
              }}>
                {msg.role === 'assistant'
                  ? <div dangerouslySetInnerHTML={{ __html: renderMessage(msg.content) }} />
                  : msg.content
                }
              </div>
            </div>
          ))}

          {/* Typing indicator */}
          {loading && (
            <div style={{ display: 'flex', gap: 12 }}>
              <div style={{ width: 34, height: 34, borderRadius: '50%', background: 'linear-gradient(135deg,var(--accent),var(--cyan))', display:'flex', alignItems:'center', justifyContent:'center', fontSize:12, fontWeight:700, color:'#fff', flexShrink:0 }}>CM</div>
              <div style={{ background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: '14px', borderTopLeftRadius: 4, padding: '14px 16px' }}>
                <div className="loading" style={{ padding: 0 }}>
                  <div className="spinner" />
                  <span className="thinking-dots"><span>.</span><span>.</span><span>.</span></span>
                </div>
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Input Row */}
        <div style={{
          display: 'flex', gap: 10, padding: '14px 16px',
          background: 'var(--bg2)', border: '1px solid var(--border)',
          borderTop: 'none', borderRadius: '0 0 var(--radius-lg) var(--radius-lg)',
          alignItems: 'center'
        }}>
          <button className={`voice-btn ${isRecording ? 'recording' : ''}`} onClick={toggleVoice} title="Voice input">
            {isRecording ? '⏹' : '🎤'}
          </button>
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage() } }}
            placeholder="Ask a coding question..."
            style={{
              flex: 1, fontFamily: 'var(--font-display)', fontSize: 14,
              background: 'var(--bg3)', border: '1px solid var(--border2)',
              color: 'var(--text)', borderRadius: 'var(--radius)',
              padding: '10px 16px', outline: 'none', transition: 'border-color 0.2s'
            }}
            onFocus={e => e.target.style.borderColor = 'var(--accent)'}
            onBlur={e => e.target.style.borderColor = 'var(--border2)'}
          />
          <button
            onClick={() => sendMessage()}
            disabled={loading || !input.trim()}
            style={{
              width: 44, height: 44, borderRadius: 'var(--radius)', border: 'none',
              background: loading || !input.trim() ? 'var(--bg3)' : 'var(--accent)',
              color: '#fff', cursor: loading || !input.trim() ? 'not-allowed' : 'pointer',
              fontSize: 20, display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'all 0.2s', opacity: loading || !input.trim() ? 0.5 : 1
            }}>
            ↑
          </button>
        </div>
      </div>
    </div>
  )
}
