import { State } from '@/components/Shared/Editor/snippet-tree/snippet-types'
import { expandAST } from '@/components/Shared/Editor/snippet-tree/tree-state'

function locPrev(prev = null, node, isFirstNode) {
  return {
    get start() {
      // The prev on a first node references it's parent (which it is a part of)
      // so it's starting point is the start of the parent node instead of the
      // end, as with a sibling node.
      if (isFirstNode) {
        return prev && typeof prev.start === 'number' ? prev.start : 0
      }

      return prev && typeof prev.start === 'number' ? prev.end : 0
    },
    get end() {
      return this.start + `${node}`.length
    },
    get lineStart() {
      if (isFirstNode) {
        return prev && typeof prev.lineStart === 'number' ? prev.lineStart : 1
      }

      return prev && typeof prev.lineEnd === 'number' ? prev.lineEnd : 1
    },
    get columnStart() {
      if (isFirstNode) {
        return prev && typeof prev.columnStart === 'number'
          ? prev.columnStart
          : 1
      }

      return prev && typeof prev.columnEnd === 'number' ? prev.columnEnd : 1
    },
    get lineEnd() {
      return this.lineStart + `${node}`.split('\n').length - 1
    },
    get columnEnd() {
      // Hidden: add 1 because columns start at 1 not at 0
      return `${node}`.split('\n').pop().length + 1
    }
  }
}

export class AST {
  private _ast: any
  private _errors: any
  private context: any
  private state: State
  constructor(
    [ast]: any[],
    context = { slots: { slotScope: [], scopeQueue: [] } },
    state?: State
  ) {
    this._ast = ast
    this._errors = []
    this.context = context
    this.state = state

    if (!context.slots) {
      context.slots = { slotScope: [], scopeQueue: [] }
    }
  }

  get ast() {
    return this.traverse(this._ast, null, this.context, node => node)
  }

  get errors() {
    return this._errors
  }

  // Pre-order traversal
  private traverse(node, scopeChange: string | null, context?: any, fn?) {
    let astNode = fn(node, scopeChange, context)

    if (node.body) {
      node.body.forEach((child, i) => {
        let prev = node.body[i - 1] || node
        // Adds line an column information to the node
        Object.assign(child, locPrev(prev, child, i === 0))

        if (node.traversed) {
          // Do not retraverse expanded elements
        } else if (i === 0 && node.type === 'Snippet') {
          // Scope start
          if (i === node.body.length - 1) {
            this.traverse(child, 'createAndDestroy', context, fn)
          } else {
            this.traverse(child, 'create', context, fn)
          }
        } else if (i === node.body.length - 1 && node.type === 'Snippet') {
          // Scope end
          this.traverse(child, 'destroy', context, fn)
        } else {
          this.traverse(child, null, context, fn)
        }
      })
    }

    return astNode
  }

  // hydrate, enrich, load, dress, fill, fetch, expand
  expand() {
    this._ast = expandAST(
      this.traverse.bind(this, this._ast, null, this.context),
      this.state
    )

    return this
  }
}
