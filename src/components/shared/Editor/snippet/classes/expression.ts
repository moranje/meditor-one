import Marker from '@/components/Shared/Editor/snippet/classes/marker'

export default class Expression extends Marker {
  constructor() {
    super('expression')
  }

  clone(): Marker {
    return new Expression()
  }

  toString(): string {
    return this.children.reduce(
      (previous, current) => `${previous}${current}`,
      ''
    )
  }
}
