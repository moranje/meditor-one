import { Marker, Snippet } from '@/snippet-service/classes'

export default class Slot extends Marker {
  name: string
  value?: string
  constructor(options) {
    super('slot')

    Object.assign(this, options)
  }

  resolve(context: any, root: Snippet) {
    if (!context.slots) return

    if (context.slots[this.name]) {
      this.value = context.slots[this.name]
    }
  }

  clone(): Marker {
    return new Slot({ name: this.name })
  }

  toString(): string {
    return `$!${this.name}`
  }

  toText(): string {
    if (this.value) return this.value

    return ''
  }
}
