import React from 'react'
import { LANGUAGES } from '../utils/syntax'

export default function LanguageSelect({ value, onChange, id }) {
  return (
    <select
      id={id}
      className="lang-select"
      value={value}
      onChange={e => onChange(e.target.value)}
    >
      {LANGUAGES.map(lang => (
        <option key={lang.value} value={lang.value}>{lang.label}</option>
      ))}
    </select>
  )
}
