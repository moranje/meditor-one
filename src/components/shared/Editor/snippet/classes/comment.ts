import { Marker } from '@/components/Shared/Editor/snippet/classes'

export default class Comment extends Marker {
  constructor(public value) {
    super('comment')
  }

  clone(): Marker {
    return new Comment(this.value)
  }

  toString(): string {
    return this.value
  }

  toText(): string {
    return ''
  }
}
