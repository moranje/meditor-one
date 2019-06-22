import { EditorProvider } from '../language-manager'

let disposables = {
  init: null,
  changes: null,
}

export default {
  init(language, editor) {},

  change(language, editor, args) {
    if (disposables.changes) disposables.changes.dispose()
  },

  destroy(editor) {
    if (disposables.init) disposables.init.dispose()
    if (disposables.changes) disposables.changes.dispose()
  },
} as EditorProvider
