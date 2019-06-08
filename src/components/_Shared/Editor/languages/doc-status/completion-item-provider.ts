import * as monaco from 'monaco-editor/esm/vs/editor/editor.api'
import slug from 'speakingurl'
import { emitter } from '@/components/_Shared/emitter'
import File from '@/store/models/File'
import { LANGUAGE_ID } from './language'
import { SnippetParser } from '../../snippet/parser'
import MonacoSnippetController from '../../snippet/monaco-controller'
import Editor from '@/store/models/Editor'

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
    // @ts-ignore
    provideCompletionItems: provideCompletionItems.bind({ editor }),
  })
})

function provideCompletionItems() {
  let files = File.query()
    .with('parent')
    .orderBy('name')
    .all()

  let snippetFiles = files.reduce((previous: any, current) => {
    if (previous === null) previous = {}

    previous[`${slug(current.parent.name)}-${slug(current.name)}`] = {
      value: current.value,
    }

    return previous
  }, null)

  // Needs inserting only once
  Editor.insertOrUpdate({
    data: {
      id: 'status',
      snippetModeActionCommand: this.editor.createContextKey(
        /* key name */ 'SnippetMode',
        /* default value */ false
      ),
    },
  })

  return {
    suggestions: files.map(file => {
      let context = {
        snippetFiles,
      }
      let id = this.editor.addCommand(
        null,
        () => {
          let controller = new MonacoSnippetController(this.editor)
          controller.onChangeSnippetMode(change => {
            Editor.insertOrUpdate({
              data: { id: 'status', snippetMode: change },
            })
          })
          controller.insert(file.value, context)
          Editor.insertOrUpdate({
            data: { id: 'status', controller },
          })
        },
        ''
      )

      return {
        label: `${slug(file.parent.name)}-${slug(file.name)}`,
        insertText: new SnippetParser(context).parse(file.value).root.toText(),
        kind: monaco.languages.CompletionItemKind.Snippet,
        command: {
          id,
          title: 'Insert a custom snippet',
        },
      }
    }),
  }
}
