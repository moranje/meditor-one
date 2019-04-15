import Marker from '@/components/Shared/Editor/snippet/classes/marker'

export default class Action extends Marker {
  constructor() {
    super('action')
  }

  clone(): Marker {
    return new Action()
  }

  toString(): string {
    return this.children.reduce(
      (previous, current) => `${previous}${current}`,
      ''
    )
  }
}
