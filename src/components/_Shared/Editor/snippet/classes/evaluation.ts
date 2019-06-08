import { Marker, Snippet } from './node_modules/@/components/_Shared/Editor/snippet/classes'

export default class Evaluation extends Marker {
  index: number
  name: string
  operator: string
  comparator: string
  constructor(options) {
    super('evaluation')

    Object.assign(
      this,
      {
        index: null,
        name: null,
      },
      options
    )
  }

  resolve(context: any, root: Snippet) {
    // Do stuff

    return super.resolve(context, root)
  }

  clone(children: Marker[] = this.children): Marker {
    return new Evaluation({
      index: this.index,
      name: this.name,
      operator: this.operator,
      comparator: this.comparator,
    })
  }

  toString(): string {
    return `\${${this.index || this.name}:${this.operator}:${this.comparator}}`
  }

  toText(): string {
    return ''
  }
}
