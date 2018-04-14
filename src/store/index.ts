import Vue from 'vue';
import Vuex from 'vuex';
import { firebaseMutations } from 'vuexfire';

import user from './modules/user';
import folders from './modules/folders';
import files from './modules/files';
import local from './modules/local';

Vue.use(Vuex);

export default new Vuex.Store({
  strict: true,
  state: {},
  getters: {},
  mutations: {
    ...firebaseMutations
  },
  actions: {},
  modules: {
    user,
    folders,
    files,
    local
  }
});
