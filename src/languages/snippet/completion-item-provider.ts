import * as monaco from 'monaco-editor/esm/vs/editor/editor.api'
import slug from 'speakingurl'

import File from '@/store/models/File'

import { EditorProvider } from '../language-manager'

let disposables = {
  init: null,
  changes: null,
}
let files = null
let suggestions = null

export default {
  init(language) {
    if (disposables.init) disposables.init.dispose()

    disposables.init = monaco.languages.registerCompletionItemProvider(
      language,
      {
        triggerCharacters: ['!'],
        // @ts-ignore
        provideCompletionItems: provideCompletionItems,
      }
    )
  },

  change(language, editor, args) {}, // Empty

  destroy(editor) {
    if (disposables.init) disposables.init.dispose()
    if (disposables.changes) disposables.changes.dispose()
    files = null
    suggestions = null
  },
} as EditorProvider

function provideCompletionItems() {
  if (!files) {
    files = File.query()
      .with('parent')
      .orderBy('name')
      .all()
  }

  if (!suggestions) {
    suggestions = {
      suggestions: files.map(file => {
        return <monaco.languages.CompletionItem>{
          label: `${slug(file.parent.name)}-${slug(file.name)}`,
          insertText: `${slug(file.parent.name)}-${slug(file.name)}`,
          kind: monaco.languages.CompletionItemKind.Snippet,
        }
      }),
    }
  }

  return suggestions
}
