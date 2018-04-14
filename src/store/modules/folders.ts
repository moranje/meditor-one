import { firebaseAction } from 'vuexfire';
import { find, findMany, findAll } from './helpers/getter';
import { update as updateLocal } from './helpers/mutation';
import { create, update, remove } from './helpers/action';
import { dbFoldersRef } from '../../firebase-config';

const stateObject = {
  folders: []
};

const getters = {
  allFolders: state => state.folders,

  findFolder: state => (key, value) => {
    if (!state.folders) return null;

    return find(state.folders, key, value);
  },

  findManyFolders: state => ids => {
    if (!state.folders) return [];

    return findMany(state.folders, ids);
  },

  findAllFolders: state => () => {
    if (!state.files) return [];

    return findAll(state.folders);
  }
};

const mutations = {
  updateFolderLocal(state, { id, key, value }) {
    updateLocal(state.folders, id, key, value);
  }
};

const actions = {
  syncFolders: firebaseAction(({ bindFirebaseRef }, ref) => {
    bindFirebaseRef('folders', ref, {
      errorCallback: (...args) => console.error(args)
    });
  }),

  createFolder: ({ state, rootGetters }, { parent, folder }) => {
    let uid = rootGetters.getUser.uid;

    create(dbFoldersRef.child(uid), folder, child => ({
      [`owner/folders/${uid}/${parent}/folders/${child}`]: true,
      [`owner/folders/${uid}/${child}/folder/${parent}`]: true
    }));
  },

  updateFolder: ({ state, rootGetters }, payload) => {
    update(dbFoldersRef.child(rootGetters.getUser.uid), payload);
  },

  removeFolder: ({ state, rootGetters }, { id, parent }) => {
    let uid = rootGetters.getUser.uid;

    remove(
      dbFoldersRef.child(uid),
      id,
      `/owner/folders/${uid}/${parent}/folders/${id}`
    );
  }
};

export default {
  state: stateObject,
  getters,
  mutations,
  actions
};
