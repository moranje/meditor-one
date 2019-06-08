import { Choice } from './classes'
import { SnippetParser } from './node_modules/@/components/_Shared/Editor/snippet/parser'
import SnippetSession from './node_modules/@/components/_Shared/Editor/snippet/session'

export default class SnippetController {
  private _inSnippetMode: boolean = false
  private _snippetModeWatcher: (change: boolean) => void
  protected _hasNextTabstop: boolean
  protected _hasPrevTabstop: boolean
  protected _session: SnippetSession
  _currentChoice?: Choice

  get inSnippetMode() {
    return Boolean(this._inSnippetMode)
  }

  set inSnippetMode(mode: boolean) {
    this._inSnippetMode = mode

    if (this._snippetModeWatcher) {
      this._snippetModeWatcher(this._inSnippetMode)
    }
  }

  private _insert(template: string, context?: any) {
    if (!this._session) {
      let snippet = new SnippetParser(context).parse(template).root

      this._session = new SnippetSession(snippet)
      this._session.next()
    } else {
      this._session.merge(template, context)
    }

    // this.next()
  }

  protected updateState() {
    if (!this._session.hasPlaceholder) {
      // don't listen for selection changes and don't
      // update context keys when the snippet is plain text
      return this.cancel()
    }

    if (
      this._session.isAtLastPlaceholder
      // !this._session.isSelectionWithinPlaceholders()
    ) {
      return this.cancel()
    }

    this.inSnippetMode = true
    this._hasPrevTabstop = !this._session.isAtFirstPlaceholder
    this._hasNextTabstop = !this._session.isAtLastPlaceholder
  }

  onChangeSnippetMode(snippetModeWatcher: (change: boolean) => void) {
    this._snippetModeWatcher = snippetModeWatcher
  }

  insert(template: string, context?: any) {
    try {
      this._insert(template, context)
      this.updateState()
    } catch (err) {
      this.cancel()
      // console.error('Snippet error', err)
    }
  }

  finish() {
    while (this.inSnippetMode) {
      this.next()
    }
  }

  cancel() {
    this.inSnippetMode = false
    this._hasNextTabstop = false
    this._hasPrevTabstop = false
    this._session = undefined
  }

  prev() {
    if (this._session) {
      return this._session.prev()
    }
  }

  next() {
    if (this._session) {
      return this._session.next()
    }
  }

  isInSnippet(): boolean {
    return Boolean(this.inSnippetMode)
  }
}
