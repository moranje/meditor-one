import nearley from 'nearley'
import * as grammar from '@/snippet-service/grammar'
import { Marker, Snippet } from '@/snippet-service/classes'

export class SnippetParser {
  private _root: Snippet
  private _context: { snippetFiles?: any; actions?: any }

  constructor(context: { snippetFiles?: any; actions?: any }) {
    this._context = context
  }

  get root(): Snippet {
    return this._root
  }

  private _setTabstopDefaults(result) {
    return result
  }

  private _insertFinalTabstop(result) {
    return result
  }

  parse(value: string) {
    const parser = new nearley.Parser(nearley.Grammar.fromCompiled(grammar))

    try {
      parser.feed(value)
    } catch (error) {
      throw new Error(`Parser error:\n\n ${error.message}`)
    }

    let result = this._setTabstopDefaults(parser.results)
    let [root] = this._insertFinalTabstop(result)

    root.resolve(this._context, root)
    this._root = root

    return this
  }

  walk(
    marker: Marker[] = this._root.children,
    visitor: (marker: Marker, root: Snippet) => boolean,
    root: Snippet = this._root
  ): void {
    const stack = [...marker]

    while (stack.length > 0) {
      const marker = stack.shift()!
      const recurse = visitor(marker, root)

      if (!recurse) break

      stack.unshift(...marker.children)
    }
  }

  toString() {
    return `${this.root}`
  }

  // Hook for resolving external actions objects
  resolve() {
    this._root.resolve(this._context, this._root)
  }
}
