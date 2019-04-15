import Marker from '@/components/Shared/Editor/snippet/classes/marker'

export default class Transform extends Marker {
  constructor(public value) {
    super('text')
  }

  static escape(value: string): string {
    return value.replace(/\$|}|\\/g, '\\$&')
  }

  get length() {
    return this.value.length
  }

  clone(): Marker {
    return new Transform(this.value)
  }

  toString(): string {
    return this.value
  }
}
