import { Model } from '@vuex-orm/core'

export default class UI extends Model {
  static entity = 'ui'
  static primaryKey = 'id'

  id: string
  width: number
  height: number

  static fields() {
    return {
      id: this.string(''),
      width: this.number(null),
      height: this.number(null),
    }
  }
}
