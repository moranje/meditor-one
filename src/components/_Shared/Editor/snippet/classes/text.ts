import { Marker } from '@/components/Shared/Editor/snippet/classes'

export default class Text extends Marker {
  constructor(public value: string) {
    super('text')
  }

  static escape(value: string): string {
    return value.replace(/\$|}|\\/g, '\\$&')
  }

  get length() {
    return this.value.length
  }

  clone(): Marker {
    return new Text(this.value)
  }

  toString(): string {
    return this.value
  }

  toText(): string {
    return this.value.replace('\\\\', '\\') // Should strip escape characters
  }
}
