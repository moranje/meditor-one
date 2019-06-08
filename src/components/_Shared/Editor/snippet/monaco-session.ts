import SnippetSession from './node_modules/@/components/_Shared/Editor/snippet/session'
import './node_modules/@/components/_Shared/Editor/snippet/snippet-session.css'
import { IActiveCodeEditor } from './node_modules/vs/editor/browser/editorBrowser'
import { registerThemingParticipant } from './node_modules/vs/platform/theme/common/themeService'
import * as colors from './node_modules/vs/platform/theme/common/colorRegistry'
import { Snippet, Choice, Selection } from './classes'
import { SnippetParser } from './node_modules/@/components/_Shared/Editor/snippet/parser'
import MonacoSelection from './classes/monaco-selection'

registerThemingParticipant((theme, collector) => {
  function getColorGraceful(name: string) {
    const color = theme.getColor(name)
    return color ? color.toString() : 'transparent'
  }

  collector.addRule(
    `.monaco - editor.snippet - placeholder { background - color: ${getColorGraceful(
      colors.snippetTabstopHighlightBackground
    )}; outline - color: ${getColorGraceful(
      colors.snippetTabstopHighlightBorder
    )}; } `
  )
  collector.addRule(
    `.monaco - editor.finish - snippet - placeholder { background - color: ${getColorGraceful(
      colors.snippetFinalTabstopHighlightBackground
    )}; outline - color: ${getColorGraceful(
      colors.snippetFinalTabstopHighlightBorder
    )}; } `
  )
})

export default class MonacoSnippetSession extends SnippetSession {
  private readonly _editor: IActiveCodeEditor
  private readonly _template: string

  constructor(editor: IActiveCodeEditor, context: any, template: string) {
    super(new SnippetParser(context).parse(template).root)
    this._editor = editor
    this._template = template
  }

  next() {
    let selections = super.next() as Selection[]

    this._editor.setSelections(
      selections.map(selection => new MonacoSelection(selection).selection)
    )
    this._editor.revealRange(new MonacoSelection(selections[0]).range)
  }

  prev() {
    let selections = super.prev() as Selection[]

    this._editor.setSelections(
      selections.map(selection => new MonacoSelection(selection).selection)
    )
    this._editor.revealRange(new MonacoSelection(selections[0]).range)
  }
}
