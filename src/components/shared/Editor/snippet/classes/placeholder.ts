import Marker from '@/components/Shared/Editor/snippet/classes/marker'
import TransformableMarker from '@/components/Shared/Editor/snippet/classes/transformable-marker'
import Choice from '@/components/Shared/Editor/snippet/classes/choice'

export default class Placeholder extends TransformableMarker {
  constructor(public index) {
    super('placeholder')
  }

  get isFinalTabstop() {
    return this.index === 0
  }

  get choice(): Choice | undefined {
    return this._children.length === 1 && this._children[0] instanceof Choice
      ? (this._children[0] as Choice)
      : undefined
  }

  clone(): Marker {
    return new Placeholder(this.index)
  }

  toString(): string {
    let transformString = ''
    if (this.transform) {
      transformString = `${this.transform}`
    }

    if (this.children.length === 0 && !this.transform) {
      return `\$${this.index}`
    } else if (this.children.length === 0) {
      return `\${${this.index}${transformString}}`
    } else if (this.choice) {
      return `\${${this.index}|${this.choice}|${transformString}}`
    } else {
      return `\${${this.index}:${this.children
        .map(child => `${child}`)
        .join('')}${transformString}}`
    }
  }
}
