import { Model } from '@vuex-orm/core'
import { db } from '@/plugins/firebase'
import Folder from '@/store/models/Folder'

export default class File extends Model {
  static entity = 'files'
  static primaryKey = 'id'

  id: string
  name: string
  value: string
  type: string
  editable: boolean
  parent: Folder
  parentId: string
  ownerId: string

  static fields(): any {
    return {
      id: this.string(''),
      name: this.string(''),
      value: this.string(''),
      type: this.string('files'),
      editable: this.boolean(true),
      ownerId: this.string(null),
      parentId: this.string(null),

      parent: this.belongsTo(Folder, 'parentId'),
    }
  }

  static afterCreate(model: any) {
    db.collection(`owner/${File.entity}/${model.ownerId}`)
      .doc(model.id)
      .set(model.$toJson())
  }

  static afterUpdate(model: any) {
    db.collection(`owner/${File.entity}/${model.ownerId}`)
      .doc(model.id)
      .set(model.$toJson())
  }

  static afterDelete(model: any) {
    db.collection(`owner/${File.entity}/${model.ownerId}`)
      .doc(model.id)
      .delete()
  }
}
