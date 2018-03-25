import { firebaseAction } from 'vuexfire';
import { find, findMany, findAll } from './helpers/getter';
import { update as updateLocal } from './helpers/mutation';
import { create, update, remove } from './helpers/action';
import { dbFilesRef } from '../../firebase-config';

const stateObject = {
  files: []
};

const getters = {
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
  },

  findAllFileCompletions: state => kind => {
    if (!state.files) return [];

    return findAll(state.files).map(file => {
      if (!file || !file.name) {
        throw new Error(
          `File with id ${file['.key']} doesn't seem to have a name`
        );
      }

      return {
        label: file.name.toLowerCase(),
        insertText: { value: file.value },
        kind
      };
    });
  }
};

const mutations = {
  updateFileLocal(state, { id, key, value }) {
    updateLocal(state.files, id, key, value);
  }
};

const actions = {
  syncFiles: firebaseAction(({ bindFirebaseRef }, ref) => {
    bindFirebaseRef('files', ref);
  }),

  createFile: (state, { parent, file }) =>
    create(dbFilesRef, file, child => ({
      [`/folders/${parent}/files/${child}`]: true,
      [`/files/${child}/folder/${parent}`]: true
    })),

  updateFile: (state, payload) => update(dbFilesRef, payload),

  removeFile: (state, { id, parent }) => remove(dbFilesRef, id, parent)
};

export default {
  state: stateObject,
  getters,
  mutations,
  actions
};
