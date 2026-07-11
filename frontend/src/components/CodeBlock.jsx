import React, { useState } from 'react'
import { syntaxHighlight, getExtension } from '../utils/syntax'

export default function CodeBlock({ code, language, showDownload = true }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(code).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 1600)
    })
  }

  const handleDownload = () => {
    const ext = getExtension(language)
    const blob = new Blob([code], { type: 'text/plain' })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = `codemind.${ext}`
    a.click()
    URL.revokeObjectURL(a.href)
  }

  return (
    <div className="code-wrap">
      <div className="code-toolbar">
        <div className="dot-row">
          <div className="dot red" />
          <div className="dot yellow" />
          <div className="dot green" />
        </div>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--text3)' }}>
          {language}
        </span>
        <div className="code-actions">
          <button className="icon-btn" onClick={handleCopy}>
            {copied ? '✓ Copied!' : '📋 Copy'}
          </button>
          {showDownload && (
            <button className="icon-btn" onClick={handleDownload}>
              ⬇ Download
            </button>
          )}
        </div>
      </div>
      <pre dangerouslySetInnerHTML={{ __html: syntaxHighlight(code) }} />
    </div>
  )
}
