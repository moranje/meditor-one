import Marker from '@/components/Shared/Editor/snippet/classes/marker'

export default class Slot extends Marker {
  constructor() {
    super('slot')
  }

  clone(): Marker {
    return new Slot()
  }

  toString(): string {
    return this.children.reduce(
      (previous, current) => `${previous}${current}`,
      ''
    )
  }
}
