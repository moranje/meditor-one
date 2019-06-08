import * as monaco from 'monaco-editor/esm/vs/editor/editor.api'

export const LANGUAGE_ID = 'doc-snippet'

monaco.languages.register({
  id: LANGUAGE_ID,
  aliases: ['DocSnippet'],
})
