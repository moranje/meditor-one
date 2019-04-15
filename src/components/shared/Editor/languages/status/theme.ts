import * as monaco from 'monaco-editor/esm/vs/editor/editor.api'
import { LANGUAGE_ID } from './language'

let theme = {
  primary: '1565c0',
  greenDark: '1b5e20',
  greenLight: '4c8c4a',
  grey: '777777',
  greyLight: '0000001f',
  greyDark: '777777',
  secondary: '880e4f',
  purpleDark: '311b92',
  purpleLight: 'bc477b',
  warning: 'e65100'
}

monaco.editor.defineTheme(LANGUAGE_ID, {
  base: 'vs',
  inherit: true,
  colors: {},

  rules: [
    { token: 'heading', fontStyle: 'bold' },
    // { token: 'important', foreground: 'ff0000' },
    // { token: 'changed', foreground: 'FFA500' },
    { token: 'emphasized', fontStyle: 'italic' },
    { token: 'number', foreground: theme.primary }
  ]
})
