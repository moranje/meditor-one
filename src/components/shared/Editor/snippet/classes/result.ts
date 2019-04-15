import Marker from '@/components/Shared/Editor/snippet/classes/marker'

export default class Result extends Marker {
  constructor() {
    super('result')
  }

  clone(): Marker {
    return new Result()
  }

  toString(): string {
    return this.children.reduce(
      (previous, current) => `${previous}${current}`,
      ''
    )
  }
}
