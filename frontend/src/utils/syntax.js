// Syntax highlighting utility
// Applies color classes to code strings for display

export function syntaxHighlight(code) {
  // Escape HTML first
  let safe = code
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')

  // Order matters — comments and strings first to avoid keyword matches inside them
  const patterns = [
    // Single-line comments
    [/(#[^\n]*)/g, '<span class="cmt">$1</span>'],
    [/(\/\/[^\n]*)/g, '<span class="cmt">$1</span>'],
    // Strings
    [/("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|`(?:[^`\\]|\\.)*`)/g, '<span class="str">$1</span>'],
    // Keywords
    [/\b(def|class|return|import|from|if|elif|else|for|while|in|not|and|or|True|False|None|async|await|try|except|with|as|pass|break|continue|yield|lambda|function|const|let|var|new|this|typeof|null|undefined|true|false|void|int|float|str|bool|public|private|static|extends|interface|abstract|func|package|struct|type|go|defer|select|chan|switch|case|default|do|throw|catch|finally|enum|extern|template|using|namespace|fun|val|suspend|println|include|define)\b/g, '<span class="kw">$1</span>'],
    // Class names (PascalCase)
    [/\b([A-Z][a-zA-Z0-9_]*)\b/g, '<span class="cls">$1</span>'],
    // Numbers
    [/\b(\d+\.?\d*)\b/g, '<span class="num">$1</span>'],
    // Function calls
    [/\b([a-z_][a-zA-Z0-9_]*)\s*(?=\()/g, '<span class="fn">$1</span>'],
  ]

  patterns.forEach(([pattern, replacement]) => {
    safe = safe.replace(pattern, replacement)
  })

  return safe
}

export const LANGUAGES = [
  { value: 'python', label: '🐍 Python', ext: 'py' },
  { value: 'javascript', label: '🟨 JavaScript', ext: 'js' },
  { value: 'typescript', label: '🔷 TypeScript', ext: 'ts' },
  { value: 'java', label: '☕ Java', ext: 'java' },
  { value: 'cpp', label: '⚙️ C++', ext: 'cpp' },
  { value: 'c', label: '🔧 C', ext: 'c' },
  { value: 'csharp', label: '🔵 C#', ext: 'cs' },
  { value: 'go', label: '🐹 Go', ext: 'go' },
  { value: 'rust', label: '🦀 Rust', ext: 'rs' },
  { value: 'swift', label: '🍎 Swift', ext: 'swift' },
  { value: 'kotlin', label: '🎯 Kotlin', ext: 'kt' },
  { value: 'php', label: '🐘 PHP', ext: 'php' },
  { value: 'ruby', label: '💎 Ruby', ext: 'rb' },
  { value: 'html', label: '🌐 HTML/CSS', ext: 'html' },
  { value: 'sql', label: '🗄️ SQL', ext: 'sql' },
  { value: 'bash', label: '💻 Bash', ext: 'sh' },
  { value: 'dart', label: '🎯 Dart', ext: 'dart' },
  { value: 'r', label: '📊 R', ext: 'r' },
]

export function getExtension(lang) {
  return LANGUAGES.find(l => l.value === lang)?.ext || 'txt'
}
