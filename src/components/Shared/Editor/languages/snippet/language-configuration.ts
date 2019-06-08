import * as monaco from 'monaco-editor/esm/vs/editor/editor.api'
import { LANGUAGE_ID } from './language'

// autoClosingPairs;
// brackets;
// comments;
// folding;
// indentationRules;
// onEnterRules;
// surroundingPairs;
// wordPattern;

monaco.languages.setLanguageConfiguration(LANGUAGE_ID, {
  brackets: [['${', '}'], ['(', ')']],
})
