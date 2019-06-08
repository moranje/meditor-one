import { db } from '@/plugins/firebase'
import User from '@/store/models/User'
import File from '@/store/models/File'

const COLLECTION = 'owner/files'

const state = {}

const getters = {}

const mutations = {}

const actions = {
  fetchAll() {
    let user = User.query().first()

    if (user) {
      return db
        .collection(`${COLLECTION}/${user.uid}`)
        .get()
        .then((querySnapshot: any) => {
          querySnapshot.forEach((doc: any) => {
            File.insert({ data: doc.data() })
          })
        })
    } else {
      Promise.reject(new Error('No user found'))
    }
  },
}

export default {
  state,
  getters,
  mutations,
  actions,
}
