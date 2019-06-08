import { Marker, Placeholder } from '@/components/Shared/Editor/snippet/classes'

export default class Choice extends Placeholder {
  childIndex: number
  constructor(children, options) {
    super(children, { index: options.index, block: true })

    Object.assign(
      this,
      {
        childIndex: 0,
      },
      options
    )
  }

  updateIndex(option: string) {
    this.childIndex = this.children.map(child => `${child}`).indexOf(option)
  }

  clone(children: Marker[] = this.children): Marker {
    return new Choice(children, {
      index: this.index,
      childIndex: this.childIndex,
    })
  }

  toString(): string {
    return `\${${this.index}|${this.children.join(',')}|}`
  }

  toText(): string {
    // console.log('toText()', this.children[this.childIndex])
    return `${this.children[this.childIndex].toText()}`
  }
}
