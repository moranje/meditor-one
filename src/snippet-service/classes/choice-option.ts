import { Marker } from '@/snippet-service/classes'

export default class ChoiceOption extends Marker {
  constructor() {
    super('choice-option')
  }

  clone(): Marker {
    return new ChoiceOption()
  }

  toString(): string {
    return this.children.reduce(
      (previous, current) => `${previous}${current}`,
      ''
    )
  }

  toText(): string {
    return this.children.reduce(
      (previous, current) => `${previous}${current.toText()}`,
      ''
    )
  }
}