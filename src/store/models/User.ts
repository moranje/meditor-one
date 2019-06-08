import { Model } from '@vuex-orm/core'

export default class User extends Model {
  static entity = 'user'
  static primaryKey = 'uid'

  displayName: string
  email: string
  emailVerified: boolean
  isAnonymous: boolean
  metadata: string
  phoneNumber: string
  photoURL: string
  providerData: string
  providerId: string
  uid: string
  exampleTemplateVisible: boolean

  static fields() {
    return {
      displayName: this.string(''),
      email: this.string(''),
      emailVerified: this.boolean(false),
      isAnonymous: this.boolean(false),
      metadata: this.string(''),
      phoneNumber: this.string('').nullable(),
      photoURL: this.string(''),
      providerData: this.string(''),
      providerId: this.string(''),
      uid: this.string(''),
      exampleTemplateVisible: this.boolean(true),
    }
  }
}
