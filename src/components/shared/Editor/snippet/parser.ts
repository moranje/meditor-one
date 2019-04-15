import nearley from 'nearley'
import * as grammar from '@/components/Shared/Editor/snippet-tree/grammar'
import { Marker, Snippet } from '@/components/Shared/Editor/snippet/classes'

export class SnippetParser {
  private _ast: Snippet

  private setTabstopDefaults(result) {
    return result
  }

  private insertFinalTabstop(result) {
    return result
  }

  get ast(): Snippet {
    return this._ast
  }

  parse(value: string) {
    const parser = new nearley.Parser(nearley.Grammar.fromCompiled(grammar))

    try {
      parser.feed(value)
    } catch (error) {
      throw new Error(`Parser error:\n\n ${error.message}`)
    }

    let result = this.setTabstopDefaults(parser.results)
    this._ast = this.insertFinalTabstop(result)

    return this
  }

  // Hook for resolving external actions objects
  resolve(context: { snippetFiles: any; actions: any }) {
    // @ts-ignore
    this._ast = this._ast.resolve(context)

    return this
  }

  // Possible transforms: expansions, static actions, dynamic (actions,
  // expressions, tranforms, choice)
  // transform(transforms: ASTTransform[]): Snippet {}

  walk(
    marker: Marker[] = this._ast.children,
    visitor: (marker: Marker, root: Marker) => boolean,
    root: Marker = this._ast
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
    return `${this.ast}`
  }
}
