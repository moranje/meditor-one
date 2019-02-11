import { db } from '@/plugins/firebase';
import User from '@/store/models/User';
import Folder from '@/store/models/Folder';

const COLLECTION = 'owner/folders';

const state = {};

const getters = {};

const mutations = {};

const actions = {
  fetchAll() {
    let user = User.query().first();

    if (user) {
      return db
        .collection(`${COLLECTION}/${user.uid}`)
        .get()
        .then((querySnapshot: any) => {
          querySnapshot.forEach((doc: any) => {
            Folder.insert({ data: doc.data() });
          });
        });
    } else {
      Promise.reject('No user found');
    }
  }
};

export default {
  state,
  getters,
  mutations,
  actions
};
