import { AST } from '@/components/Shared/Editor/snippet-tree/ast'
import LinkedList from '@/components/Shared/Editor/snippet-tree/linked-list'
import parser from '@/components/Shared/Editor/snippet-tree/parser'
import {
  Choice,
  Expansion,
  Placeholder,
  State,
  Tabstop,
  TabstopElement
} from '@/components/Shared/Editor/snippet-tree/snippet-types'
import { cloneDeep, find, flatten, last, lowerFirst, remove } from 'lodash-es'

function firstLine(node, context) {
  console.log('firstLine', `${node}`)
  if (`${node}`.match(/\n/)) {
    console.log('Multiline', `${node}`)
    let transform = new AST([`${node}`.split('\n').pop()], context)

    node.body = transform.ast.body
  }

  return node
}

function addTabstopElement(node: TabstopElement, state: State) {
  if (node.modifier === null) {
    addTabstop(node, state)
  }

  if (node.modifier === '=') {
    addAnchor(node, state)
  }

  if (node.modifier === '+') {
    addIncrementor(node, state)
  }
}

function addTabstop(node: TabstopElement, state: State) {
  let scopeIndex = last(state.scopeStack)

  // Checks for hole in sparse array as well as index beyond current array
  // length.
  if (state.tabstopScope[scopeIndex].hasOwnProperty(node.int - 1)) {
    state.tabstopScope[scopeIndex][node.int - 1].push(node.id)
  } else {
    // Creates a new array inside the tabstop array with every first addition
    state.tabstopScope[scopeIndex][node.int - 1] = [node.id]
  }
}

function addAnchor(node: TabstopElement, state: State) {
  let scopeIndex = indexOfScope(state, node.id)

  // Nothing to anchor on so just consider it a regular tabstop
  if (scopeIndex === -1) scopeIndex = last(state.scopeStack)

  // Checks for hole in sparse array as well as index beyond current array
  // length.
  if (state.tabstopScope[scopeIndex].hasOwnProperty(node.int - 1)) {
    state.tabstopScope[scopeIndex][node.int - 1].push(node.id)
  } else {
    // Creates a new array inside the tabstop array with every first addition
    state.tabstopScope[scopeIndex][node.int - 1] = [node.id]
  }
}

function addIncrementor(node, state: State) {
  state.tabstopScope.push([[node.id]])
}

function indexOfTabstop(state: State, id: number) {
  let tabstopIndex = -1
  let index = 0
  let tabstops = flatten(state.tabstopScope).filter(tabstops => tabstops)

  // Native `forEach` methods skips holes in sparse arrays (wanted behaviour)
  tabstops.forEach(tabstop => {
    let match = tabstop.indexOf(id)

    if (match !== -1) {
      tabstopIndex = index
    }

    index = index + 1
  })

  return tabstopIndex
}

function indexOfScope(state: State, id: number) {
  let scopeIndex = -1

  state.tabstopScope.forEach((scope, index) => {
    scope.forEach(tabstop => {
      let match = tabstop.indexOf(id)

      if (match !== -1) {
        scopeIndex = index
      }
    })
  })

  return scopeIndex
}

function emptyExpansion(node, errMessage) {
  // console.log('Empty expansion', errMessage);

  return Object.assign(node, {
    traversed: true,
    toString() {
      return ''
    }
  })
}

const actions = {
  tabstop(node: Tabstop, state: State) {
    addTabstopElement(node, state)

    return Object.assign(node, {
      toString() {
        // Incremtor guard for '$+3mg' becoming '$13mg'
        if (node.block || node.modifier === '+') { return `\${${indexOfTabstop(state, this.id) + 1}}` }

        return `$${indexOfTabstop(state, this.id) + 1}`
      }
    })
  },

  placeholder(node: Placeholder, state: State) {
    addTabstopElement(node, state)

    let index = 1
    let amount = 1
    if (node.modifier === '=') {
      amount = 2
    }

    node.body.splice(
      index,
      amount,
      Object.assign(node.body[index], {
        toString() {
          return indexOfTabstop(state, node.id) + 1
        }
      })
    )

    return Object.assign(node, {
      modifier: null,
      body: node.body
    })
  },

  choice(node: Choice, state: State, context) {
    addTabstopElement(node, state)

    let index = 1
    let amount = 1
    if (node.modifier === '=') {
      amount = 2
    }

    node.body.splice(
      index,
      amount,
      Object.assign(node.body[index], {
        toString() {
          return indexOfTabstop(state, node.id) + 1
        }
      })
    )

    return Object.assign(node, {
      modifier: null,
      body: node.body
    })
  },

  expansion(node: Expansion, state: State, context) {
    if (!context.snippets) {
      return emptyExpansion(
        node,
        'The AST class instance is missing a context parameter or context object is missing a context.snippets child node'
      )
    }
    if (!context.slots) {
      return emptyExpansion(
        node,
        'The AST class instance is missing a context parameter or context object is missing a context.slots child node'
      )
    }

    let reference = find(context.snippets, ['name', node.reference])
    if (!reference) {
      return emptyExpansion(node, `No snippet with reference ${node.reference}`)
    }

    let expansionContext = cloneDeep(context)
    // Remove current reference from context to prevent infinite recursion
    remove(
      expansionContext.snippets,
      (snippet: { name: 'string' }) => snippet.name === node.reference
    )

    let index = expansionContext.slots.slotScope.length
    expansionContext.slots.slotScope.push([...node.args])
    // Nested slot scopes have to be walked pre-order, so scopes are placed on a // queue instead of a stack
    expansionContext.slots.scopeQueue.unshift(index)

    let expansionTree = new AST(
      parser(reference.value),
      // Slots have expansion (snippet) scope
      expansionContext,
      state
    ).expand().ast

    expansionContext.slots.scopeQueue.pop()

    return Object.assign(node, {
      body: [expansionTree],
      traversed: true,
      toString() {
        return this.body.join('')
      }
    })
  },

  expansionSlot(node, state, context) {
    if (!context.slots) {
      throw new Error(
        'The AST class instance is missing a context parameter or context obcject is missing a context.slots child node'
      )
    }

    let stackIndex: number = last(context.slots.scopeQueue)
    let slot = context.slots.slotScope[stackIndex][node.int - 1]
    let snippet = new AST(parser(slot), context).expand().ast

    return Object.assign(node, {
      body: snippet.body || [],
      toString() {
        return this.body.join('')
      }
    })
  },

  snippetFunction(node, state, context) {
    if (!context.functions) {
      throw new Error(
        'The AST class instance is missing a context parameter or context obcject is missing a context.functions child node'
      )
    }

    let fn = context.functions[node.name]

    if (!fn) {
      throw new Error(
        `Context.functions is missing a reference to ${node.name}`
      )
    }

    return Object.assign(node, {
      toString() {
        return `${fn(...this.args)}`
      }
    })
  }

  // parsingError(node, state, context) {
  //   console.log('Parsing error', node);
  // }
}

export function expandAST(traverser, parentState) {
  let state: State = parentState || {
    tabstopScope: [],
    scopeStack: [],
    elements: new LinkedList()
  }

  let ast = traverser((node, scopeChange: string | null, context) => {
    if (node.type) {
      if (node.id) {
        state.elements.push(node.id)
      }

      if (scopeChange === 'create' || scopeChange === 'createAndDestroy') {
        // Create a new scope
        let index = state.tabstopScope.push([]) - 1 // eslint-disable-line no-empty-pattern
        state.scopeStack.push(index)
      }

      let expanded
      if (!actions[lowerFirst(node.type)]) {
        expanded = node
      } else {
        expanded = actions[lowerFirst(node.type)](node, state, context)
      }

      if (
        state.scopeStack.length > 1 &&
        (scopeChange === 'destroy' || scopeChange === 'createAndDestroy')
      ) {
        state.scopeStack.pop()
      }

      return expanded
    }

    console.error('Invalid AST', node)
    throw new Error(`Invalid AST node type ${node} ${node.type}`)
  })

  // console.log(
  //   'expandAST',
  //   Object.assign(ast, { state }),
  //   '\toString(): ',
  //   `${ast}`
  // );

  return Object.assign(ast, { state })
}
