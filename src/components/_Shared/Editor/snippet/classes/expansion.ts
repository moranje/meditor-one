import { SnippetParser } from '@/components/_Shared/Editor/snippet/parser'
import {
  Marker,
  ExpansionArgument,
  Snippet,
} from '@/components/_Shared/Editor/snippet/classes'

export default class Expansion extends Snippet {
  index: number
  name: string
  args: ExpansionArgument[]
  resolved: boolean

  constructor(children = [], options) {
    super(children, 'expansion')

    Object.assign(
      this,
      {
        args: [],
        resolved: false,
      },
      options
    )
  }

  static compareByIndex(a: Expansion, b: Expansion): number {
    if (a.index < b.index) {
      return -1
    } else if (a.index > b.index) {
      return 1
    } else {
      return 0
    }
  }

  raiseIndexBy(by: number) {
    if (typeof this.index === 'number') this.index += by
  }

  resolve(context: any, root: Snippet) {
    // Add arguments to context ro be picked up by child slots
    if (this.args && this.args.length > 0) {
      let slots = {}

      this.args.forEach(arg => {
        slots[arg.name] = arg.arg
      })

      Object.assign(context, { slots })
    }
  }

  clone(children: Marker[] = this.children): Snippet {
    return new Expansion(children, {
      index: this.index,
      name: this.name,
      args: this.args,
      resolved: this.resolved,
    })
  }

  toString(): string {
    if (this.resolved) {
      if (this.args.length > 0) {
      }

      return this.children.reduce((previous, current) => {
        return `${previous}${current}`
      }, '')
    }

    if (this.args.length > 0) {
      return (
        `\${!${this.index}:${this.name}` +
        this.args.map(arg => `${arg}`).join('') +
        '}'
      )
    }

    return `\${!${this.index}:${this.name}}`
  }

  toText(): string {
    if (this.resolved) {
      return this.children.reduce(
        (previous, current) => `${previous}${current.toText()}`,
        ''
      )
    }

    return ''
  }
}
