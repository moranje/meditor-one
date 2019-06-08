import {
  Marker,
  Placeholder,
  Selection,
  Expansion,
  Choice,
  Variable,
} from '@/components/_Shared/Editor/snippet/classes'
import { SnippetParser } from '../parser'

function sortByIndex(list) {
  return list.sort(Expansion.compareByIndex)
}

function isRequired() {
  throw new Error('Parameter is required')
}

export default class Snippet extends Marker {
  private _placeholders?: { all: Placeholder[]; last?: Placeholder }
  private _variables?: null | any
  private _expansions: Expansion[] = []

  constructor(children, type?: string) {
    super(type || 'snippet', children)

    this._placeholders = { all: [], last: null }
  }

  get lastPlaceholder() {
    if (!this._placeholders.last) {
      let last: Placeholder | undefined

      this.walk(this.children, child => {
        if (child instanceof Placeholder) {
          last = !last || last.index < child.index ? child : last
        }

        // Keep walking
        return true
      })

      Object.assign(this._placeholders, { last })
    }

    return this._placeholders.last
  }

  get placeholders(): Placeholder[] {
    if (this._placeholders.all.length === 0) {
      let all: Placeholder[] = []

      this.walk(this.children, child => {
        if (child instanceof Placeholder) {
          all.push(child)
        }

        // Keep walking
        return true
      })

      Object.assign(this._placeholders, { all })
    }

    return this._placeholders.all
  }

  clearPlaceholderCache() {
    this._placeholders.all = []
    this._placeholders.last = null
  }

  get variables() {
    if (this._variables != null) {
      let variables: {}

      this.walk(this.children, child => {
        if (child instanceof Placeholder && child.name) {
          // Two things, shallow copy so 'placeholderId' isn't copied onto
          // original variable. Also prevents overwriting 'placeholderId',
          // when a newer variable is copied onto this one.
          variables[child.name] = Object.assign(variables[child.name], child)

          // Keep overwriting placeholders. This has the  effect of only
          // referencing the last named placeholder. If a user more than one
          // named placeholder the same variable reference the last is used.
          // Since the  index may change by expansions, id references are used.
          if (!variables[child.name].placeholderId) {
            variables[child.name].placeholderId = child.id
          }
        }

        if (child instanceof Variable) {
          // Two things, shallow copy so 'placeholderId' isn't copied onto
          // original variable. Also prevents overwriting 'placeholderId',
          // when a newer variable is copied onto this one.
          variables[child.name] = Object.assign(variables[child.name], child)

          // Only assign a null value to new or empty variables
          if (!variables[child.name].placeholderId) {
            variables[child.name].placeholderId = null
          }
        }

        // Keep walking
        return true
      })

      this._variables = variables
    }

    return this._variables
  }

  clearVariableCache() {
    this._variables = null
  }

  get expansions() {
    if (this._expansions.length === 0) {
      let expansions: Expansion[] = []

      this.walk(this.children, child => {
        if (child instanceof Expansion) {
          expansions.push(child)
        }

        // Keep walking
        return true
      })

      Object.assign(this._expansions, expansions)
    }

    return sortByIndex(this._expansions)
  }

  get children() {
    return this._children
  }

  set children(children: Marker[]) {
    this._children = children
  }

  getIndexById(id: string) {
    let index = -1

    this.walk(this.children, child => {
      if (child instanceof Placeholder && child.id === id) {
        index = child.index

        return false
      }

      // Keep walking
      return true
    })

    return index
  }

  resolve(context: any, root: Snippet) {
    super.resolve(context, root)
    let incrementor = 0

    this.expansions.forEach(expansion => {
      if (context.snippetFiles && context.snippetFiles[expansion.name]) {
        let snippet = context.snippetFiles[expansion.name]
        let parsed = new SnippetParser(context).parse(snippet.value)

        expansion.raiseIndexBy(incrementor)
        if (parsed.root.lastPlaceholder) {
          incrementor += parsed.root.lastPlaceholder.index - 1
        }

        this.insertChildren(expansion, parsed.root)
        expansion.resolved = true
      }
    })
  }

  resetPlaceholders() {
    this._placeholders = { all: [], last: null }
  }

  insertChildren(expansion: Expansion, childSnippet: Snippet) {
    if (childSnippet.lastPlaceholder) {
      // ? raise child placeholder indices
      childSnippet.walk(childSnippet.children, child => {
        if (child instanceof Placeholder) {
          child.raiseIndexBy(expansion.index - 1)
        }

        // Keep walking
        return true
      })

      // ? raise parent placeholder indices starting at expansion.index and up
      this.walk(expansion.parent.children, child => {
        if (child instanceof Placeholder) {
          if (child.index >= expansion.index) {
            child.raiseIndexBy(childSnippet.lastPlaceholder.index)
          }
        }

        // Keep walking
        return true
      })
    }

    // ? setup parent node
    childSnippet.children.forEach(child => (child.parent = expansion))
    expansion.resetPlaceholders()
    expansion.children = childSnippet.children
  }

  // ? A thought: since the offset only changes for each node after inserted
  // ? text, it would stand to reason that the cheapest way to update the offsets
  // ? is to walkBack from the last node and to store updated offsets along the
  // ? way. That or a linkedList.
  offset(marker: Marker): number {
    let offset = 0
    let found = false

    this.walk(this.children, child => {
      if (child === marker) {
        found = true

        // Stop walking
        return false
      }

      // Don't iterate choice elements, just check selected child
      if (
        child instanceof Choice &&
        child.children[child.childIndex] === marker
      ) {
        found = true

        // Stop walking
        return false
      }

      if (
        // Container element
        child instanceof Expansion ||
        // Container element
        (child instanceof Placeholder && !(child instanceof Choice)) ||
        // Don't iterate choice elements since only one option will actually be in the text
        child.parent instanceof Choice ||
        // Container element
        child instanceof Snippet
      ) {
        // Do nothing
      } else if (child instanceof Choice) {
        offset += child.children[child.childIndex].length
      } else {
        offset += child.length
      }

      // Keep walking
      return true
    })

    if (!found) return -1

    return offset
  }

  selection(marker: Marker | void = isRequired()) {
    const template = this.toText()
    const offsetStart = this.offset(marker as Marker)

    let textBeforeMarker = template.substring(0, offsetStart)
    let linesBeforeMarker = textBeforeMarker.split('\n')

    let linesInMarker = (marker as Marker).toText().split('\n')
    let columnEnd

    if (linesInMarker.length > 1) {
      columnEnd = linesInMarker[linesInMarker.length - 1].length
    } else if (linesInMarker.length === 1) {
      columnEnd =
        linesBeforeMarker[linesBeforeMarker.length - 1].length +
        linesInMarker[linesInMarker.length - 1].length +
        1
    } else {
      columnEnd = linesBeforeMarker[linesBeforeMarker.length - 1].length + 1
    }

    return new Selection(
      {
        lineNumber: linesBeforeMarker.length,
        column: linesBeforeMarker[linesBeforeMarker.length - 1].length + 1,
      },
      {
        lineNumber: linesBeforeMarker.length + linesInMarker.length - 1,
        column: columnEnd,
      },
      offsetStart,
      offsetStart + (marker as Marker).toText().length
    )
  }

  clone(children: Marker[] = this.children): Snippet {
    return new Snippet(children)
  }

  toString(): string {
    return this.children.reduce(
      (previous, current) => `${previous}${current}`,
      ''
    )
  }

  toText(): string {
    return this.children.reduce(
      (previous, current) => `${previous}${current.toText()}`,
      ''
    )
  }
}
