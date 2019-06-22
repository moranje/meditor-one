import * as monaco from 'monaco-editor/esm/vs/editor/editor.api'
import slug from 'speakingurl'

import MonacoSnippetController from '@/snippet-service/monaco-controller'
import { SnippetParser } from '@/snippet-service/parser'
import Editor from '@/store/models/Editor'
import File from '@/store/models/File'

import { EditorProvider } from '../language-manager'

let disposables = {
  init: null,
  changes: null,
}
let files = null
let suggestions = null

export default {
  init(language, editor) {
    if (disposables.init) disposables.init.dispose()
    disposables.init = monaco.languages.registerCompletionItemProvider(
      language,
      {
        // @ts-ignore
        provideCompletionItems: provideCompletionItems.bind({ editor }),
      }
    )
  },

  change(language, editor, args) {}, // Empty

  destroy(editor) {
    if (disposables.init) disposables.init.dispose()
    if (disposables.changes) disposables.changes.dispose()
  },
} as EditorProvider

function provideCompletionItems() {
  if (!files) {
    files = File.query()
      .with('parent')
      .orderBy('name')
      .all()
  }

  let snippetFiles = files.reduce((previous: any, current) => {
    if (previous === null) previous = {}

    previous[`${slug(current.parent.name)}-${slug(current.name)}`] = {
      value: current.value,
    }

    return previous
  }, null)

  if (!suggestions) {
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

    suggestions = {
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

        return <monaco.languages.CompletionItem>{
          label: `${slug(file.parent.name)}-${slug(file.name)}`,
          insertText: new SnippetParser(context)
            .parse(file.value)
            .root.toText(),
          kind: monaco.languages.CompletionItemKind.Snippet,
          command: {
            id,
            title: 'Insert a custom snippet',
          },
        }
      }),
    }
  }

  return suggestions
}
