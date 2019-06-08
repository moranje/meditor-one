import * as monaco from 'monaco-editor/esm/vs/editor/editor.api'
import { emitter } from './node_modules/@/components/_Shared/emitter'
import { LANGUAGE_ID } from './language'

let disposable = null

interface CodeLens {
  id: string
  command: any
  range: {
    startLineNumber: number
    startColumn: number
    endLineNumber: number
    endColumn: number
  }
}

emitter.on(`${LANGUAGE_ID}.change`, ({ editor, args }) => {
  if (disposable) disposable.dispose()

  // console.log(`${LANGUAGE_ID}.change`, args)
})

emitter.on(`${LANGUAGE_ID}.keyDown`, ({ editor, args }) => {
  if (disposable) disposable.dispose()

  // console.log(`${LANGUAGE_ID}.keyDown`, args)
})

export default function(editor: any) {
  return (model: any, token: any) => {}
}
