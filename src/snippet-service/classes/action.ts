import { Marker, Snippet } from '@/snippet-service/classes'

export default class Action extends Marker {
  name: string
  args: Marker[]
  applied: () => string
  constructor(options) {
    super('action')

    Object.assign(
      this,
      {
        args: [],
      },
      options
    )
  }

  // custom resolver should
  resolve(context: any, root: Snippet) {
    if (!context.actions) return

    if (context.actions[this.name]) {
      let action = context.actions[this.name]

      this.applied = () => {
        return action(...this.args)
      }
    }
  }

  clone(): Marker {
    return new Action({
      name: this.name,
      args: this.args,
    })
  }

  toString(): string {
    if (this.args.length > 0) {
      return `\${#${this.name}:${this.args.join(':')}}`
    }

    return `\${#${this.name}}`
  }

  toText(): string {
    if (this.applied) {
      // Args pre-applied using partial application
      return this.applied()
    }

    return ''
  }
}
