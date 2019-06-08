import {
  Marker,
  TransformableMarker,
} from '@/components/Shared/Editor/snippet/classes'

export default class Variable extends TransformableMarker {
  name: string | null
  block: boolean
  constructor(children, options) {
    super('placeholder', children || [])

    Object.assign(
      this,
      { name: null, block: false }, // default values
      options
    )
  }

  clone(children: Marker[] = this.children): Marker {
    return new Variable(children, {
      name: this.name,
      block: this.block,
      transform: this.transform,
    })
  }

  toString(): string {
    if (this.transform) {
      return `\${${this.name}${this.transform}}`
    }

    if (this.block === false) {
      // $name
      return `$${this.name}`
    }

    if (this.children.length > 0) {
      // ${name:placeholder}
      return `\${${this.name}:${this.children.reduce(
        (previous, current) => `${previous}${current}`,
        ''
      )}}`
    }

    // ${1}
    return `\${${this.name}}`
  }

  toText(): string {
    if (this.transform) {
      return this.transform.toText()
    }

    if (this.block === false) {
      return ''
    }

    return this.children.reduce(
      (previous, current) => `${previous}${current.toText()}`,
      ''
    )
  }
}
