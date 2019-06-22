import * as monaco from 'monaco-editor/esm/vs/editor/editor.api'

export default <monaco.editor.IEditorConstructionOptions>{
  acceptSuggestionOnEnter: 'smart',
  autoClosingBrackets: 'always',
  folding: true,
  fontFamily: "'Fira Code', Monaco, Consolas, 'Courier New', monospace",
  fontLigatures: true,
  fontSize: 14,
  fontWeight: 'initial',
  language: 'plaintext',
  lineHeight: 20,
  lineNumbers: 'on',
  matchBrackets: true,
  minimap: {
    enabled: false,
  },
  quickSuggestions: true,
  readOnly: false,
  renderWhitespace: 'boundary',
  scrollbar: {
    horizontal: 'hidden',
    vertical: 'hidden',
  },
  suggestSelection: 'recentlyUsedByPrefix',
  scrollBeyondLastLine: false,
  showFoldingControls: 'always',
  tabsize: 2,
  theme: 'vs',
  useTabStops: true,
  value: '',
  wordWrap: 'on',
  wrappingIndent: 'indent',
}
