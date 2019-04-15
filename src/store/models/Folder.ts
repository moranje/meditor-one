import { Model } from '@vuex-orm/core'
import { db } from '@/plugins/firebase'
import File from '@/store/models/File'

export default class Folder extends Model {
  id: string
  collapsed: boolean
  editable: boolean
  name: string
  type: string
  files: File[]
  parent: Folder | null
  folders: Folder[]
  parentId: string
  ownerId: string
  fileIds: string[]
  folderIds: string[]

  public static entity = 'folders'

  static primaryKey = 'id'

  static fields(): any {
    return {
      id: this.string(''),
      collapsed: this.boolean(true),
      editable: this.boolean(true),
      name: this.string(''),
      type: this.string('folder'),
      ownerId: this.string(null),
      parentId: this.string(null).nullable(),
      fileIds: this.attr([]),
      folderIds: this.attr([]),

      parent: this.belongsTo(Folder, 'parentId'),
      files: this.hasMany(File, 'parentId'),
      folders: this.hasMany(Folder, 'parentId')
    }
  }

  static afterCreate(model: any) {
    db.collection(`owner/${Folder.entity}/${model.ownerId}`)
      .doc(model.id)
      .set(model.$toJson())
  }

  static afterUpdate(model: any) {
    db.collection(`owner/${Folder.entity}/${model.ownerId}`)
      .doc(model.id)
      .set(model.$toJson())
  }

  static afterDelete(model: any) {
    db.collection(`owner/${Folder.entity}/${model.ownerId}`)
      .doc(model.id)
      .delete()
  }
}
