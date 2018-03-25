import { find, findAll } from './helpers/getter';
import { create, update } from './helpers/mutation';

const state = {
  documents: [],
  saveState: null,
  contentHeight: 0,
  contentWidth: 0,
  sidebarWidth: 300
};

const getters = {
  getSaveState: state => () => {
    return state.saveState;
  },

  findDocument: state => id => {
    return find(state.documents, 'id', id);
  },

  // getContentAreaHeight: state => state.contentHeight,

  // getContentAreaWidth: state => state.contentWidth

  getContentAreaSize: state => type => {
    if (type === 'height') {
      return state.contentHeight;
    }

    if (type === 'width') {
      return state.contentWidth;
    }

    return {
      height: state.contentHeight,
      width: state.contentWidth
    };
  },

  getSidebarWidth: state => type => {
    return state.sidebarWidth;
  }
};

const mutations = {
  setSaveState(state, saveState) {
    state.saveState = saveState;
  },

  createDocument(state, document) {
    let id = state.documents.length;
    let created = Object.assign({}, document, { id });

    return create(state.documents, created);
  },

  updateDocument(state, { id, key, value }) {
    return update(state.documents, id, key, value);
  },

  setContentAreaSize(state, { width, height }) {
    if (height && height >= 0) {
      state.contentHeight = height;
    }

    if (width && width >= 0) {
      state.contentWidth = width;
    }
  },

  setSidebarWidth(state, width) {
    state.sidebarWidth = width;
  }
};

const actions = {};

export default {
  state,
  getters,
  mutations,
  actions
};
