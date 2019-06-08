import * as monaco from 'monaco-editor/esm/vs/editor/editor.api'
import { emitter } from '@/components/Shared/emitter'
import File from '@/store/models/File'
import { LANGUAGE_ID } from './language'
import slug from 'speakingurl'

interface Suggestion {
  label: string
  insertText: string | { value: string }
  insertTextRules: number
  documentation?: string
  kind: number
}

let disposable = null

emitter.on(`${LANGUAGE_ID}.loaded`, ({ editor, args }) => {
  if (disposable) disposable.dispose()

  disposable = monaco.languages.registerCompletionItemProvider(LANGUAGE_ID, {
    triggerCharacters: ['!'],
    // @ts-ignore
    provideCompletionItems,
  })
})

function provideCompletionItems() {
  let files = File.query()
    .with('parent')
    .orderBy('name')
    .all()

  return {
    suggestions: files.map(file => {
      return {
        label: `${slug(file.parent.name)}-${slug(file.name)}`,
        insertText: `${slug(file.parent.name)}-${slug(file.name)}`,
        kind: monaco.languages.CompletionItemKind.Snippet,
      }
    }),
  }
}
