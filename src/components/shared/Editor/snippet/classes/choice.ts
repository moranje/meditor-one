import Marker from '@/components/Shared/Editor/snippet/classes/marker'

export default class Choice extends Marker {
  constructor() {
    super('choice')
  }

  clone(): Marker {
    return new Choice()
  }

  toString(): string {
    return this.children.reduce(
      (previous, current) => `${previous}${current}`,
      ''
    )
  }
}
