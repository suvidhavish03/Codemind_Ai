/**
 * CodeMind AI — Syntax Highlighter
 * Lightweight regex-based highlighter for display purposes.
 * For a production app, consider using highlight.js or shiki via a CDN.
 */

const EXTENSIONS = {
  python: 'py', javascript: 'js', typescript: 'ts', java: 'java',
  cpp: 'cpp', c: 'c', csharp: 'cs', go: 'go', rust: 'rs',
  swift: 'swift', kotlin: 'kt', php: 'php', ruby: 'rb',
  html: 'html', css: 'css', sql: 'sql', bash: 'sh',
  dart: 'dart', r: 'r'
}

export function getExtension(lang) {
  return EXTENSIONS[lang] || 'txt'
}

/**
 * Apply syntax highlighting to a code string.
 * Returns an HTML string safe to set as innerHTML inside a <pre>.
 */
export function highlight(code, lang = '') {
  // Escape HTML first
  let out = code
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')

  // Comments
  out = out.replace(/(#[^\n]*)/g, '<span class="sh-cmt">$1</span>')
  out = out.replace(/(\/\/[^\n]*)/g, '<span class="sh-cmt">$1</span>')
  out = out.replace(/(\/\*[\s\S]*?\*\/)/g, '<span class="sh-cmt">$1</span>')
  out = out.replace(/(--[^\n]*)/g, '<span class="sh-cmt">$1</span>') // SQL

  // Strings (double, single, backtick)
  out = out.replace(/("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|`(?:[^`\\]|\\.)*`)/g,
    '<span class="sh-str">$1</span>')

  // Keywords
  const KEYWORDS = [
    'def','class','return','import','from','if','elif','else','for','while','in',
    'not','and','or','True','False','None','async','await','try','except','with',
    'as','pass','break','continue','yield','lambda','global','nonlocal',
    'function','const','let','var','new','this','typeof','instanceof',
    'null','undefined','true','false','void',
    'int','float','str','bool','list','dict','set','tuple',
    'public','private','protected','static','extends','implements',
    'interface','abstract','override','fun','val','suspend',
    'func','package','struct','type','go','chan','select','defer',
    'fallthrough','map','range','switch','case','default','do',
    'throw','throws','catch','finally','synchronized',
    'enum','extern','register','auto','short','long','double',
    'char','unsigned','signed','sizeof','typedef','union',
    'include','define','namespace','using','template','virtual',
    'fn','pub','mut','impl','trait','mod','use','where','match',
    'SELECT','FROM','WHERE','INSERT','UPDATE','DELETE','CREATE',
    'TABLE','INDEX','JOIN','ON','GROUP','BY','ORDER','HAVING',
    'DROP','ALTER','AND','OR','NOT','IN','IS','NULL','AS',
    'println','print','echo','puts','printf','console'
  ]
  const kwRe = new RegExp(`\\b(${KEYWORDS.join('|')})\\b`, 'g')
  out = out.replace(kwRe, '<span class="sh-kw">$1</span>')

  // Class names (PascalCase)
  out = out.replace(/\b([A-Z][a-zA-Z0-9_]*)\b/g, '<span class="sh-cls">$1</span>')

  // Numbers
  out = out.replace(/\b(\d+\.?\d*)\b/g, '<span class="sh-num">$1</span>')

  // Function calls
  out = out.replace(/\b([a-z_][a-zA-Z0-9_]*)\s*(?=\()/g, '<span class="sh-fn">$1</span>')

  return out
}

/**
 * Inline CSS classes for syntax highlighting.
 * Inject this into your component or global CSS.
 */
export const HIGHLIGHT_CSS = `
.sh-kw  { color: #c792ea; }
.sh-fn  { color: #82aaff; }
.sh-str { color: #c3e88d; }
.sh-num { color: #f78c6c; }
.sh-cmt { color: #546e7a; font-style: italic; }
.sh-cls { color: #ffcb6b; }
.sh-op  { color: #89ddff; }
`
