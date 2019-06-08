import * as monaco from 'monaco-editor/esm/vs/editor/editor.api'
import { emitter } from '@/components/_Shared/emitter'
import { LANGUAGE_ID } from './language'
import Editor from '@/store/models/Editor'

interface Action {
  command: any
  title?: string
  arguments?: any[]
}

let disposable = null
let actions = []
const COMMANDS = [
  {
    id: 'jump-to-next-snippet-placeholder',
    label: 'Next snippet placeholder',
    keybindings: [monaco.KeyCode.Tab],
    precondition: 'SnippetMode',
    keybindingContext: null,
    contextMenuOrder: 1.5,
    run: function(editor) {
      // console.log('Next snippet placeholder initialized')
      let controller = Editor.find('status').controller

      if (controller) {
        // console.log('Next tabstop', controller, controller.next())
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
      // console.log('Next snippet placeholder initialized')
      let controller = Editor.find('status').controller

      if (controller) {
        // console.log('Next tabstop', controller, controller.next())
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
      // console.log('Next snippet placeholder initialized')
      let controller = Editor.find('status').controller

      if (controller) {
        // console.log('Next tabstop', controller, controller.next())
        controller.cancel()
      }

      return null
    },
  },
]

emitter.on(`${LANGUAGE_ID}.loaded`, ({ editor, args }) => {
  if (disposable) disposable.dispose()

  if (actions.length === 0) initActions(editor)

  disposable = monaco.languages.registerCodeActionProvider(LANGUAGE_ID, {
    // @ts-ignore
    provideCodeActions: () => actions,
  })
})

function initActions(editor) {
  COMMANDS.forEach(command => {
    actions.push({
      id: editor.addAction(command),
      title: command.id,
    })
  })
}
