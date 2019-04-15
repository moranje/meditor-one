import Marker from '@/components/Shared/Editor/snippet/classes/marker'

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
}
