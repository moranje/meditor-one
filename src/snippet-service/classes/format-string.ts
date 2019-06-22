import { Marker, Snippet } from '@/snippet-service/classes'

export default class FormatString extends Marker {
  index: number
  shorthandName?: string
  ifValue?: string
  elseValue?: string
  block: boolean
  constructor(options) {
    super('formatString')

    Object.assign(
      this,
      {
        block: false,
      },
      options
    )
  }

  private _toPascalCase(value: string): string {
    const match = value.match(/[a-z]+/gi)
    if (!match) {
      return value
    }
    return match
      .map(function(word) {
        return word.charAt(0).toUpperCase() + word.substr(1).toLowerCase()
      })
      .join('')
  }

  clone(): Marker {
    return new FormatString({
      index: this.index,
      shorthandName: this.shorthandName,
      ifValue: this.ifValue,
      elseValue: this.elseValue,
      block: this.block,
    })
  }

  resolve(context: { groups?: string[] }, root: Snippet) {
    let value = context.groups[this.index]

    //! Here for reference, needs work
    // if (this.shorthandName === 'upcase') {
    //   !value ? '' : value.toLocaleUpperCase()
    // } else if (this.shorthandName === 'downcase') {
    //   !value ? '' : value.toLocaleLowerCase()
    // } else if (this.shorthandName === 'capitalize') {
    //   !value ? '' : value[0].toLocaleUpperCase() + value.substr(1)
    // } else if (this.shorthandName === 'pascalcase') {
    //   !value ? '' : this._toPascalCase(value)
    // } else if (Boolean(value) && typeof this.ifValue === 'string') {
    //   this.ifValue
    // } else if (!value && typeof this.elseValue === 'string') {
    //   this.elseValue
    // } else {
    //   value || ''
    // }

    return super.resolve(context, root)
  }

  toString(): string {
    let value = '$'

    if (this.block) value += '{'
    value += this.index

    if (this.shorthandName) {
      value += `:/${this.shorthandName}`
    } else if (this.ifValue && this.elseValue) {
      value += `:?${this.ifValue}:${this.elseValue}`
    } else if (this.ifValue) {
      value += `:+${this.ifValue}`
    } else if (this.elseValue) {
      value += `:-${this.elseValue}`
    }

    if (this.block) value += '}'

    return value
  }

  toText() {
    // FIXME: this should probably process changes made by resolve() (at least
    // to keep .length working)
    if (typeof this.elseValue === 'string') {
      return this.elseValue
    }

    return ''
  }
}
