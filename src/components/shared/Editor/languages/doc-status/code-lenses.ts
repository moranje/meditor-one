import * as monaco from 'monaco-editor/esm/vs/editor/editor.api'
import { emitter } from '@/components/Shared/emitter'
import { LANGUAGE_ID } from './language'
import equal from 'fast-deep-equal'

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

let disposable = null
let addCommandEditor = null
let tokenCache = null

emitter.on(`${LANGUAGE_ID}.change`, ({ editor, args }) => {
  let tokens = monaco.editor
    .tokenize(editor.getModel().getValue(), LANGUAGE_ID)
    .flat()
    .filter(token => /heading.*?/.test(token.type))

  // Only update codelenses if heading tokens have changed
  if (equal(tokens, tokenCache)) return

  if (disposable) disposable.dispose()

  tokenCache = monaco.editor
    .tokenize(editor.getModel().getValue(), LANGUAGE_ID)
    .flat()
    .filter(token => /heading.*?/.test(token.type))

  disposable = monaco.languages.registerCodeLensProvider(LANGUAGE_ID, {
    provideCodeLenses: headingLenses.bind(null, editor),
  })
})

function headingLenses(editor: any, model: any, token: any): Promise<any[]> {
  return new Promise((resolve, reject) => {
    const text = model.getValue()
    const tokens = monaco.editor.tokenize(text, LANGUAGE_ID)
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
            'Opschonen',
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
            'Opschonen',
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

// export default function(editor: any) {
//   let disposable = null

//   return (model: any, token: any) => {
//     return new Promise((resolve, reject) => {
//       if (disposable) disposable.dispose()

//       disposable = editor.onDidChangeModelContent((listener: any) => {
//         const text = model.getValue()
//         const tokens = monaco.editor.tokenize(text, 'status')
//         let line = 0

//         const results = tokens.reduce((accumulator, [token]) => {
//           let lens: any[] = []
//           line += 1

//           if (token && /heading.*?status/.test(token.type)) {
//             lens.push(
//               addCommand(
//                 'Kopieer',
//                 line,
//                 editor,
//                 (line => {
//                   let next = blockEnd(line, tokens)
//                   console.log(`copy heading at line ${line} to ${next}`)
//                 }).bind(null, line)
//               )
//             )
//           }

//           if (token && /heading.medication.status/.test(token.type)) {
//             lens.push(
//               addCommand(
//                 'Opschonen',
//                 line,
//                 editor,
//                 (line => {
//                   let next = blockEnd(line, tokens)
//                   console.log(`clean heading at line ${line} to ${next}`)
//                 }).bind(null, line)
//               )
//             )
//           }

//           if (token && /heading.history.status/.test(token.type)) {
//             lens.push(
//               addCommand(
//                 'Opschonen',
//                 line,
//                 editor,
//                 (line => {
//                   let next = blockEnd(line, tokens)
//                   console.log(`clean heading at line ${line} to ${next}`)
//                 }).bind(null, line)
//               )
//             )
//           }

//           if (token && /heading.conclusion.status/.test(token.type)) {
//             lens.push(
//               addCommand(
//                 'Kopieer met beleid',
//                 line,
//                 editor,
//                 (line => {
//                   let next = blockEnd(line, tokens)
//                   console.log(`copy heading at line ${line} to ${next}`)
//                 }).bind(null, line)
//               )
//             )
//           }

//           return [...accumulator, ...lens]
//         }, [])

//         // console.log('Code lens results', results)
//         resolve(results)
//       })
//     })
//   }
// }

function addCommand(name: string, line: number, editor: any, func: any) {
  return {
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

// ? Function that returns array with line numbers of all headings?
