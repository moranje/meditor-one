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

  rules: [
    // { token: '', foreground: '000000', background: 'fffffe' },
    // { token: 'invalid', foreground: 'cd3131' },
    // { token: 'emphasis', fontStyle: 'italic' },
    // { token: 'strong', fontStyle: 'bold' },

    // { token: 'variable', foreground: '001188' },
    // { token: 'variable.predefined', foreground: '4864AA' },
    // { token: 'constant', foreground: 'dd0000' },
    // { token: 'comment', foreground: '008000' },
    // { token: 'number', foreground: '09885A' },
    // { token: 'number.hex', foreground: '3030c0' },
    // { token: 'regexp', foreground: '800000' },
    // { token: 'annotation', foreground: '808080' },
    // { token: 'type', foreground: '008080' },

    // { token: 'delimiter', foreground: '000000' },
    // { token: 'tag', foreground: '800000' },
    // { token: 'metatag', foreground: 'e00000' }
    // { token: 'key', foreground: '863B00' },

    // { token: 'attribute.name', foreground: 'FF0000' },
    // { token: 'attribute.value', foreground: '0451A5' },
    // { token: 'attribute.value.number', foreground: '09885A' },
    // { token: 'attribute.value.unit', foreground: '09885A' },

    // { token: 'string', foreground: 'A31515' }
    // { token: 'keyword', foreground: '0000FF' },

    { token: 'heading', fontStyle: 'bold' },

    { token: 'keyword', foreground: theme.secondary },
    { token: 'tag', foreground: theme.greenDark },
    { token: 'comment', foreground: theme.grey, fontStyle: 'italic' },
    { token: 'text' },
    { token: 'variable', foreground: theme.primary },
    { token: 'annotation', foreground: theme.greenLight },
    { token: 'delimiter', foreground: theme.greenDark },
    { token: 'constant', foreground: theme.warning },
    { token: 'regex.group.tag', foreground: theme.purpleDark },
    { token: 'regex.group.variable', foreground: theme.secondary },
    { token: 'regex.group.modifier', foreground: theme.purpleLight },
    { token: 'regex.group.string.modifier', foreground: theme.purpleLight },
    { token: 'space', background: theme.grey },
    { token: 'operator', fontStyle: 'bold', foreground: theme.greyDark },
    { token: 'invalid', foreground: 'cd3131' }, // theme.error

    { token: 'string', fontStyle: 'underline' }
  ],

  colors: {
    focusBorder: theme.primary,
    'inputOption.activeBorder': theme.primary
    // 'editor.background': `#${theme.greyLight}`
    // 'editor.findMatchBackground': '#ff0000',
    // 'editor.findMatchBorder': '#ff0000',
    // 'editor.findMatchHighlightBackground': '#ff0000',
    // 'editor.findMatchHighlightBorder': '#ff0000',
    // 'editor.findRangeHighlightBackground': '#ff0000',
    // 'editor.findRangeHighlightBorder': '#ff0000',
    // 'editor.foreground': '#ff0000',
    // 'editor.hoverHighlightBackground': '#ff0000',
    // 'editor.inactiveSelectionBackground': '#ff0000',
    // 'editor.lineHighlightBackground': '#ff0000',
    // 'editor.lineHighlightBorder': '#ff0000',
    // 'editor.rangeHighlightBackground': '#ff0000',
    // 'editor.rangeHighlightBorder': '#ff0000',
    // 'editor.selectionBackground': '#ff0000',
    // 'editor.selectionForeground': '#ff0000',
    // 'editor.selectionHighlightBackground': '#ff0000',
    // 'editor.selectionHighlightBorder': '#ff0000',
    // 'editor.wordHighlightBackground': '#ff0000',
    // 'editor.wordHighlightBorder': '#ff0000',
    // 'editor.wordHighlightStrongBackground': '#ff0000',
    // 'editor.wordHighlightStrongBorder': '#ff0000'
    // 'editorActiveLineNumber.foreground': '#ff0000',
    // 'editorBracketMatch.background': '#ff0000',
    // 'editorBracketMatch.border': '#ff0000',
    // 'editorCodeLens.foreground': '#ff0000',
    // 'editorCursor.background': '#ff0000',
    // 'editorCursor.foreground': '#ff0000',
    // 'editorError.border': '#ff0000',
    // 'editorError.foreground': '#ff0000',
    // 'editorGutter.background': '#ff0000',
    // 'editorHint.border': '#ff0000',
    // 'editorHint.foreground': '#ff0000',
    // 'editorHoverWidget.background': '#ff0000',
    // 'editorHoverWidget.border': '#ff0000',
    // 'editorIndentGuide.activeBackground': '#ff0000',
    // 'editorIndentGuide.background': '#ff0000',
    // 'editorInfo.border': '#ff0000',
    // 'editorInfo.foreground': '#ff0000',
    // 'editorLineNumber.activeForeground': '#ff0000',
    // 'editorLineNumber.foreground': '#ff0000',
    // 'editorLink.activeForeground': '#ff0000',
    // 'editorMarkerNavigation.background': '#ff0000',
    // 'editorMarkerNavigationError.background': '#ff0000',
    // 'editorMarkerNavigationInfo.background': '#ff0000',
    // 'editorMarkerNavigationWarning.background': '#ff0000',
    // 'editorOverviewRuler.border': '#ff0000',
    // 'editorOverviewRuler.bracketMatchForeground': '#ff0000',
    // 'editorOverviewRuler.errorForeground': '#ff0000',
    // 'editorOverviewRuler.findMatchForeground': '#ff0000',
    // 'editorOverviewRuler.infoForeground': '#ff0000',
    // 'editorOverviewRuler.selectionHighlightForeground': '#ff0000',
    // 'editorOverviewRuler.warningForeground': '#ff0000',
    // 'editorOverviewRuler.wordHighlightForeground': '#ff0000',
    // 'editorOverviewRuler.wordHighlightStrongForeground': '#ff0000',
    // 'editorRuler.foreground': '#ff0000',
    // 'editorSuggestWidget.background': '#ff0000',
    // 'editorSuggestWidget.border': '#ff0000',
    // 'editorSuggestWidget.foreground': '#ff0000',
    // 'editorSuggestWidget.highlightForeground': '#ff0000',
    // 'editorSuggestWidget.selectedBackground': '#ff0000',
    // 'editorUnnecessaryCode.border': '#ff0000',
    // 'editorUnnecessaryCode.opacity': '#ff0000',
    // 'editorWarning.border': '#ff0000',
    // 'editorWarning.foreground': '#ff0000',
    // 'editorWhitespace.foreground': '#ff0000',
    // 'editorWidget.background': '#ff0000',
    // 'editorWidget.border': '#ff0000',
    // 'editorWidget.resizeBorder': '#ff0000',
    // 'input.background': '#ff0000',
    // 'input.border': '#ff0000',
    // 'input.foreground': '#ff0000',
    // 'peekView.border': '#ff0000',
    // 'peekViewEditor.background': '#ff0000',
    // 'peekViewEditor.matchHighlightBackground': '#ff0000',
    // 'peekViewEditor.matchHighlightBorder': '#ff0000'
    // 'peekViewEditorGutter.background': '#ff0000',
    // 'peekViewResult.background': '#ff0000',
    // 'peekViewResult.fileForeground': '#ff0000',
    // 'peekViewResult.lineForeground': '#ff0000',
    // 'peekViewResult.matchHighlightBackground': '#ff0000',
    // 'peekViewResult.selectionBackground': '#ff0000',
    // 'peekViewResult.selectionForeground': '#ff0000',
    // 'peekViewTitle.background': '#ff0000',
    // 'peekViewTitleDescription.foreground': '#ff0000',
    // 'peekViewTitleLabel.foreground': '#ff0000',
    // 'scrollbar.shadow': '#ff0000',
    // 'scrollbarSlider.activeBackground': '#ff0000',
    // 'scrollbarSlider.background': '#ff0000',
    // 'scrollbarSlider.hoverBackground': '#ff0000',
  }
})
