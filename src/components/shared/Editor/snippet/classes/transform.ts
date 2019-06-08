import { Marker } from '@/components/Shared/Editor/snippet/classes'

export default class Transform extends Marker {
  pattern: RegExp
  constructor(children, options) {
    super('text', children)

    Object.assign(this, options)
  }

  clone(children: Marker[] = this.children): Marker {
    return new Transform(children, {
      pattern: this.pattern,
    })
  }

  toString(): string {
    return `/${this.pattern.source}/${this.children.reduce(
      (previous, current) => `${previous}${current}`,
      ''
    )}/${this.pattern.flags}`
  }

  toText(): string {
    return this.children.reduce(
      (previous, current) => `${previous}${current.toText()}`,
      ''
    )
  }
}
