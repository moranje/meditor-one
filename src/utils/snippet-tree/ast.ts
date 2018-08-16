import { State } from '@/utils/snippet-tree/snippet-types';
import { expandAST } from '@/utils/snippet-tree/tree-state';

export class AST {
  private _ast: any;
  private _errors: any;
  private context: any;
  private state: State;
  constructor(
    [ast],
    context = { slots: { slotScope: [], scopeQueue: [] } },
    state?: State
  ) {
    this._ast = ast;
    this._errors = [];
    this.context = context;
    this.state = state;

    if (!context.slots) {
      context.slots = { slotScope: [], scopeQueue: [] };
    }
  }

  get ast() {
    return this.traverse(this._ast, null, this.context, node => node);
  }

  get errors() {
    return this._errors;
  }

  // Pre-order traversal
  private traverse(node, scopeChange: string | null, context?: any, fn?) {
    let astNode = fn(node, scopeChange, context);

    if (node.body) {
      node.body.forEach((child, i) => {
        if (node.traversed) {
          // Do not retraverse expanded elements
        } else if (i === 0 && node.type === 'Snippet') {
          // Scope start
          if (i === node.body.length - 1) {
            this.traverse(child, 'createAndDestroy', context, fn);
          } else {
            this.traverse(child, 'create', context, fn);
          }
        } else if (i === node.body.length - 1 && node.type === 'Snippet') {
          // Scope end
          this.traverse(child, 'destroy', context, fn);
        } else {
          this.traverse(child, null, context, fn);
        }
      });
    }

    return astNode;
  }

  // hydrate, enrich, load, dress, fill, fetch, expand
  expand() {
    this._ast = expandAST(
      this.traverse.bind(this, this._ast, null, this.context),
      this.state
    );
    // console.log('expand()', this._ast);

    return this;
  }
}
