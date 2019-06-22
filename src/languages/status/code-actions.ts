import * as monaco from 'monaco-editor/esm/vs/editor/editor.api'
import { EditorProvider } from '../language-manager'
import Editor from '@/store/models/Editor'
import { dispose } from 'vs/base/common/lifecycle'

const disposables = {
  init: null,
  changes: null,
  actions: [],
}

// Preloaded actions
const ACTIONS: monaco.editor.IActionDescriptor[] = [
  {
    id: 'jump-to-next-snippet-placeholder',
    label: 'Next snippet placeholder',
    keybindings: [monaco.KeyCode.Tab],
    precondition: 'SnippetMode',
    keybindingContext: null,
    contextMenuOrder: 1.5,
    run: function(editor) {
      let controller = Editor.find('status').controller

      if (controller) {
        controller.next()
      }

      return null
    },
  },
  {
    id: 'jump-to-previous-snippet-placeholder',
    label: 'Previous snippet placeholder',
    keybindings: [monaco.KeyMod.Shift | monaco.KeyCode.Tab],
    precondition: 'SnippetMode',
    keybindingContext: null,
    contextMenuOrder: 1.5,
    run: function(editor) {
      let controller = Editor.find('status').controller

      if (controller) {
        controller.prev()
      }

      return null
    },
  },

  {
    id: 'leave-snippet-mode',
    label: 'Exit',
    keybindings: [monaco.KeyCode.Escape],
    precondition: 'SnippetMode',
    keybindingContext: null,
    contextMenuOrder: 1.5,
    run: function(editor) {
      let controller = Editor.find('status').controller

      if (controller) {
        controller.cancel()
      }

      return null
    },
  },
]

let commands: monaco.languages.Command[] = []

export default {
  init(language, editor) {
    if (disposables.init) disposables.init.dispose()

    if (commands.length === 0) initActions(editor)

    disposables.init = monaco.languages.registerCodeActionProvider(language, {
      // @ts-ignore
      provideCodeActions: () => commands,
    })
  },

  change(language, editor, args) {},

  destroy(editor) {
    if (disposables.init) disposables.init.dispose()
    if (disposables.changes) disposables.changes.dispose()

    if (disposables.actions.length > 0) {
      disposables.actions.forEach(disposable => disposable.dispose())
    }
  },
} as EditorProvider

function initActions(editor) {
  ACTIONS.forEach((action, i) => {
    if (disposables.actions[i]) disposables.actions[i].dispose()
    disposables.actions[i] = editor.addAction(action)

    commands.push({
      id: disposables.actions[i],
      title: action.id,
    })
  })
}
