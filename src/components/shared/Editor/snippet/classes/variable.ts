import Marker from '@/components/Shared/Editor/snippet/classes/marker'
import TransformableMarker from '@/components/Shared/Editor/snippet/classes/transformable-marker'
import Choice from '@/components/Shared/Editor/snippet/classes/choice'

export default class Variable extends TransformableMarker {
  constructor() {
    super('placeholder')
  }

  clone(): Marker {
    return new Variable()
  }

  toString(): string {
    let transformString = ''
    if (this.transform) {
      transformString = `${this.transform}`
    }

    return ''
  }
}
