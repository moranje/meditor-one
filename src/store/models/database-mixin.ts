import { Model } from '@vuex-orm/core'
import { db } from '@/plugins/firebase'

export default class Database extends Model {
  static entity: string

  static afterCreate(model: any) {
    // console.log('CREATE', this, model)
    db.collection(`owner/${this.entity}/${model.ownerId}`)
      .doc(model.id)
      .set(model.$toJson())
  }

  static afterUpdate(model: any) {
    // console.log('UPDATE', this, model)
    db.collection(`owner/${this.entity}/${model.ownerId}`)
      .doc(model.id)
      .set(model.$toJson())
  }

  static afterDelete(model: any) {
    // console.log('DELETE', this, model)
    db.collection(`owner/${this.entity}/${model.ownerId}`)
      .doc(model.id)
      .delete()
  }
}
