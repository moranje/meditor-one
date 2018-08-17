import { firebaseAction } from 'vuexfire';

import { dbFilesRef } from '../../plugins/firebase';
import { create, remove, update } from './helpers/action';
import { find, findAll, findMany } from './helpers/getter';
import { update as updateLocal } from './helpers/mutation';

const stateObject = {
  files: []
};

const getters = {
  allFiles: state => state.files,

  findFile: state => (key, value) => {
    if (!state.files) return null;

    return find(state.files, key, value);
  },

  findManyFiles: state => ids => {
    if (!state.files) return [];

    return findMany(state.files, ids);
  },

  findAllFiles: state => () => {
    if (!state.files) return [];

    return findAll(state.files);
  }
};

const mutations = {
  updateFileLocal(state, { id, key, value }) {
    updateLocal(state.files, id, key, value);
  }
};

const actions = {
  syncFiles: firebaseAction(({ bindFirebaseRef }, ref) => {
    bindFirebaseRef('files', ref, {
      errorCallback: (...args) => console.error(args)
    });
  }),

  createFile: ({ state, rootGetters }, { parent, file }) => {
    let uid = rootGetters.getUser.uid;

    create(dbFilesRef.child(rootGetters.getUser.uid), file, child => ({
      [`owner/folders/${uid}/${parent}/files/${child}`]: true,
      [`owner/files/${uid}/${child}/folder/${parent}`]: true
    }));
  },

  updateFile: ({ state, rootGetters }, payload) => {
    update(dbFilesRef.child(rootGetters.getUser.uid), payload);
  },

  removeFile: ({ state, rootGetters }, { id, parent }) => {
    let uid = rootGetters.getUser.uid;

    remove(
      dbFilesRef.child(uid),
      id,
      `/owner/folders/${uid}/${parent}/files/${id}`
    );
  }
};

export default {
  state: stateObject,
  getters,
  mutations,
  actions
};
