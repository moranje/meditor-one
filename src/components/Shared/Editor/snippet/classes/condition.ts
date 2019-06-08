import {
  Marker,
  Evaluation,
  Snippet,
} from '@/components/Shared/Editor/snippet/classes'

export default class Condition extends Marker {
  evaluations: Evaluation[]
  operators: string[]
  consequent: Marker
  constructor(options) {
    super('condition')

    Object.assign(
      this,
      {
        evaluations: [],
        operators: [],
        consequent: null,
      },
      options
    )
  }

  // custom resolver should
  resolve(context: any, root: Snippet) {
    // Do stuff

    return super.resolve(context, root)
  }

  clone(children: Marker[] = this.children): Marker {
    return new Condition({
      evaluations: this.evaluations,
      operators: this.operators,
      consequent: this.consequent,
    })
  }

  toString(): string {
    return this.evaluations.reduce((previous, current, i) => {
      if (i === 0) return `${previous}${current}`

      if (i === this.evaluations.length - 1) {
        return `${previous}${this.operators[i - 1]}${current}=${
          this.consequent
        }`
      }

      return `${previous}${this.operators[i - 1]}${current}`
    }, '')
  }

  toText(): string {
    return ''
  }
}
