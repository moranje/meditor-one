import * as monaco from 'monaco-editor/esm/vs/editor/editor.api'

export default <monaco.editor.IEditorConstructionOptions>{
  // acceptSuggestionOnEnter: 'smart',
  automaticLayout: true,
  folding: true,
  fontFamily: "'Fira Code', Monaco, Consolas, 'Courier New', monospace",
  fontLigatures: true,
  fontSize: 14,
  fontWeight: 'initial',
  lineHeight: 20,
  lineNumbers: 'off',
  matchBrackets: false,
  minimap: {
    enabled: false,
  },
  quickSuggestions: false,
  readOnly: true,
  renderWhitespace: 'boundary',
  scrollbar: {
    vertical: 'hidden',
  },
  selectionHighlight: false,
  suggestSelection: 'recentlyUsedByPrefix',
  scrollBeyondLastLine: false,
  showFoldingControls: 'always',
  tabsize: 2,
  theme: 'vs',
  useTabStops: true,
  value: '',
  wordWrap: 'wordWrapColumn',
  wordWrapColumn: 100,
  wrappingIndent: 'indent',
}
