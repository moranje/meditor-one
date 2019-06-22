import { Snippet } from '@/snippet-service/classes'

export default class ExpansionArgument {
  name: number
  arg: Snippet
  constructor(options) {
    Object.assign(this, options)
  }

  clone(): ExpansionArgument {
    return new ExpansionArgument({
      name: this.name,
      arg: this.arg,
    })
  }

  toString(): string {
    return `\n/${this.name}:${this.arg}`
  }
}
