import Marker from '@/components/Shared/Editor/snippet/classes/marker'

export default class Snippet extends Marker {
  constructor(parent, children) {
    super('snippet', parent, children)
  }

  clone(): Marker {
    return new Snippet(this.parent, this.children)
  }

  toString(): string {
    return this.children.reduce(
      (previous, current) => `${previous}${current}`,
      ''
    )
  }
}
