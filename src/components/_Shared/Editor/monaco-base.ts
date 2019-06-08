import * as monaco from 'monaco-editor/esm/vs/editor/editor.api'
import status from './languages/status'
import snippet from './languages/snippet'
import docSnippet from './languages/doc-snippet'
import { emitter } from './node_modules/@/components/_Shared/emitter'

interface EditorOptions {
  language: string
}

const config = { snippet, status, 'doc-snippet': docSnippet }

export function setup($el: any, options: EditorOptions) {
  let opts = options

  if (options.language && config[options.language]) {
    opts = Object.assign(config[options.language], options)
  }

  let editor = monaco.editor.create($el, opts)

  emitter.emit(`${options.language}.loaded`, { editor })

  editor.onDidChangeModelContent((...args) => {
    emitter.emit(`${options.language}.change`, { editor, args })
  })
  editor.onKeyDown((...args) => {
    emitter.emit(`${options.language}.keyDown`, { editor, args })
  })

  // editor.onDidBlurEditorText((...args) => {});
  // editor.onDidDispose((...args) => {});
  // editor.onCompositionEnd((...args) => {}) // Editor loaded?

  return editor
}
