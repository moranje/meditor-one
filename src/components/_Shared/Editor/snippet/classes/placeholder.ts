import {
  Marker,
  TransformableMarker,
  Snippet,
} from '@/components/_Shared/Editor/snippet/classes'
import { SnippetParser } from '../parser'
import Text from './text'

export default class Placeholder extends TransformableMarker {
  index: number | null
  name: string | null
  block: boolean

  constructor(children, options) {
    super('placeholder', children || [])

    Object.assign(
      this,
      { index: null, name: null, block: false }, // default values
      options
    )
  }

  static compareByIndex(a: Placeholder, b: Placeholder): number {
    if (a.index === b.index) {
      return 0
    } else if (a.isFinalTabstop) {
      return 1
    } else if (b.isFinalTabstop) {
      return -1
    } else if (a.index < b.index) {
      return -1
    } else if (a.index > b.index) {
      return 1
    } else {
      return 0
    }
  }

  get isFinalTabstop() {
    return this.index === 0
  }

  raiseIndexBy(by: number) {
    if (typeof this.index === 'number') this.index += by
  }

  clone(children: Marker[] = this.children): Marker {
    return new Placeholder(children, {
      index: this.index,
      name: this.name,
      block: this.block,
      transform: this.transform,
    })
  }

  toString(): string {
    if (this.transform) {
      return `\${${this.index}${this.transform}}`
    }

    if (this.block === false) {
      if (this.name) {
        // $1<name>
        return `$${this.index}<${this.name}>`
      }

      // $1
      return `$${this.index}`
    }

    if (this.children.length > 0) {
      if (this.name) {
        // ${1<name>:placeholder}
        return `\${${this.index}<${this.name}>:${this.children.reduce(
          (previous, current) => `${previous}${current}`,
          ''
        )}}`
      }

      // ${1:placeholder}
      return `\${${this.index}:${this.children.reduce(
        (previous, current) => `${previous}${current}`,
        ''
      )}}`
    }

    if (this.name) {
      // ${1<name>}
      return `\${${this.index}<${this.name}>}`
    }

    // ${1}
    return `\${${this.index}}`
  }

  toText(): string {
    if (this.transform) {
      return this.transform.toText()
    }

    if (this.children.length > 0) {
      return this.children.reduce(
        (previous, current) => `${previous}${current.toText()}`,
        ''
      )
    }

    return ''
  }
}
