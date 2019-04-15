import Marker from '@/components/Shared/Editor/snippet/classes/marker'

export default class Expansion extends Marker {
  constructor() {
    super('expansion')
  }

  clone(): Marker {
    return new Expansion()
  }

  toString(): string {
    return this.children.reduce(
      (previous, current) => `${previous}${current}`,
      ''
    )
  }
}
