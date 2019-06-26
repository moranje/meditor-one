import * as monaco from 'monaco-editor/esm/vs/editor/editor.api'
import equal from 'fast-deep-equal'
import { EditorProvider } from '../language-manager'

let disposables = {
  init: null,
  changes: null,
}
let tokenCache = null

export default {
  init(language, editor) {
    if (disposables.init) disposables.init.dispose()
  },

  change(language, editor, args) {
    let tokens = monaco.editor
      .tokenize(editor.getModel().getValue(), language)
      .flat()
      .filter(token => /heading.*?/.test(token.type))
    // Only update codelenses if heading tokens have changed
    if (equal(tokens, tokenCache)) return
    if (disposables.init) disposables.init.dispose()

    tokenCache = monaco.editor
      .tokenize(editor.getModel().getValue(), language)
      .flat()
      .filter(token => /heading.*?/.test(token.type))
    disposables.init = monaco.languages.registerCodeLensProvider(language, {
      provideCodeLenses: headingLenses.bind(null, editor, language),
    })
  },

  destroy(editor) {
    if (disposables.init) disposables.init.dispose()
    if (disposables.changes) disposables.changes.dispose()
    tokenCache = null
  },
} as EditorProvider

function headingLenses(
  editor: any,
  language: string,
  model: any,
  token: any
): Promise<any[]> {
  return new Promise((resolve, reject) => {
    const text = model.getValue()
    const tokens = monaco.editor.tokenize(text, language)
    let line = 0

    const results = tokens.reduce((accumulator, [token]) => {
      let lens: any[] = []
      line += 1

      if (token && /heading.*?status/.test(token.type)) {
        lens.push(
          addCommand(
            'Kopieer',
            line,
            editor,
            (line => {
              let next = blockEnd(line, tokens)
              // console.log(`copy heading at line ${line} to ${next}`)
            }).bind(null, line)
          )
        )
      }

      if (token && /heading.medication.status/.test(token.type)) {
        lens.push(
          addCommand(
            'Medicatie opschonen',
            line,
            editor,
            (line => {
              let next = blockEnd(line, tokens)
              // console.log(`clean heading at line ${line} to ${next}`)
            }).bind(null, line)
          )
        )
      }

      if (token && /heading.history.status/.test(token.type)) {
        lens.push(
          addCommand(
            'Voorgeschiedenis opschonen',
            line,
            editor,
            (line => {
              let next = blockEnd(line, tokens)
              // console.log(`clean heading at line ${line} to ${next}`)
            }).bind(null, line)
          )
        )
      }

      if (token && /heading.conclusion.status/.test(token.type)) {
        lens.push(
          addCommand(
            'Kopieer met beleid',
            line,
            editor,
            (line => {
              let next = blockEnd(line, tokens)
              // console.log(`copy heading at line ${line} to ${next}`)
            }).bind(null, line)
          )
        )
      }

      return [...accumulator, ...lens]
    }, [])

    // console.log('Code lens results', results)
    resolve(results)
  })
}

function addCommand(name: string, line: number, editor: any, func: any) {
  return <monaco.languages.ICodeLensSymbol>{
    command: {
      id: editor.addCommand('code lens', func, ''),
      title: name,
    },
    range: {
      startLineNumber: line,
      startColumn: 1,
      endLineNumber: line,
      endColumn: 2,
    },
  }
}

function blockEnd(line: number, tokens: any[]): number {
  let next = -1
  let found = false

  for (let index = line; index < tokens.length; index++) {
    let [token] = tokens[index]

    if (!found && token && /heading.*?status/.test(token.type)) {
      found = true
      // Current line is that of the next heading,the array index is canceled
      // out by being one line ahead.
      next = index
    }

    if (!found && index === tokens.length - 1) {
      next = index + 1
    }
  }

  return next
}
