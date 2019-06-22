import * as monaco from 'monaco-editor/esm/vs/editor/editor.api'
import { EditorProvider } from '../language-manager'

let disposables = {
  init: null,
  changes: null,
}
let commands: monaco.languages.Command[] = []
const ACTIONS: monaco.editor.IActionDescriptor[] = []

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
  },
} as EditorProvider

function initActions(editor) {
  ACTIONS.forEach(action => {
    commands.push({
      id: editor.addAction(action),
      title: action.id,
    })
  })
}
