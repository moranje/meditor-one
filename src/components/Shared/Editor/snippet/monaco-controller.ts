import SnippetController from '@/components/Shared/Editor/snippet/controller'
import * as monaco from 'monaco-editor/esm/vs/editor/editor.api'
import { dispose, IDisposable } from 'vs/base/common/lifecycle'
import { Text } from '@/components/Shared/Editor/snippet/classes'
import { ICodeEditor } from 'vs/editor/browser/editorBrowser'
import { SuggestController } from 'vs/editor/contrib/suggest/suggestController'
import { showSimpleSuggestions } from 'vs/editor/contrib/suggest/suggest'
import { Selection } from 'vs/editor/common/core/selection'
import { Range } from 'vs/editor/common/core/range'
import { repeat } from 'vs/base/common/strings'
import MonacoSnippetSession from './monaco-session'

// @ts-ignore
export default class MonacoSnippetController extends SnippetController {
  private _snippetListener: IDisposable[] = []
  protected _session: MonacoSnippetSession

  constructor(private readonly _editor: ICodeEditor) {
    super()
  }

  static get(editor: ICodeEditor): MonacoSnippetController {
    return new MonacoSnippetController(editor)
  }

  private _insert(template: string, context?: any) {
    if (!this._session) {
      this._session = new MonacoSnippetSession(this._editor, context, template)
      this._session.next()
    } else {
      this._session.merge(template, context)
    }

    // this.next()
  }

  private _handleChoice() {
    if (!this._session || !this._editor.hasModel()) {
      this._currentChoice = undefined
      return
    }

    const { choice } = this._session
    if (!choice) {
      this._currentChoice = undefined
      return
    }

    if (this._currentChoice !== choice) {
      this._currentChoice = choice

      this._editor.setSelections(
        this._editor
          .getSelections()
          .map(s => Selection.fromPositions(s.getStartPosition()))
      )

      // console.log(SuggestController)
      const [first] = choice.children as (Text)[]

      showSimpleSuggestions(
        this._editor,
        choice.children.map((option: Text, i) => {
          return <monaco.languages.CompletionItem>{
            kind: monaco.languages.CompletionItemKind.Value,
            label: option.value,
            insertText: option.value,
            sortText: repeat('a', i + 1),
            range: Range.fromPositions(
              this._editor.getPosition()!,
              this._editor.getPosition()!.delta(0, first.value.length)
            ),
          }
        })
      )
    }
  }

  protected updateState() {
    if (!this._session || !this._editor.hasModel()) {
      // canceled in the meanwhile
      return
    }

    super.updateState()

    this._handleChoice()
  }

  insert(template: string, context?: any) {
    this._snippetListener = dispose(this._snippetListener)

    // Make insertion undoable
    this._editor.getModel().pushStackElement()

    super.insert(template, context)

    // If not snippet mode was canceled in super
    if (this.inSnippetMode) {
      this._snippetListener = [
        this._editor.onDidChangeModelContent((...args) => {
          let model = this._editor.getModel()
          let last = args[0].changes[args[0].changes.length - 1]

          this._session && this._session.onTextChanged(
            model.getOffsetAt({
              column: last.range.startColumn,
              lineNumber: last.range.startLineNumber,
            }),
            0,
            last.text
          )

          args[0].isFlush && this.cancel()
        }),

        this._editor.onDidChangeModel(() => this.cancel()),
        this._editor.onDidChangeCursorSelection(() => this.updateState()),
      ]
    }
  }
}
