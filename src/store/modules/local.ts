import { find } from './helpers/getter';
import { create, update } from './helpers/mutation';

const stateObject = {
  documents: [],
  saveState: null,
  contentHeight: 0,
  contentWidth: 0,
  sidebarWidth: 300,
  modalState: false
};

const getters = {
  getSaveState: state => () => state.saveState,

  findDocument: state => id => find(state.documents, 'id', id),

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

  getSidebarWidth: state => () => state.sidebarWidth,

  getModalState: state => () => state.modalState
};

const mutations = {
  setSaveState(state, saveState) {
    state.saveState = saveState;
  },

  createDocument(state, document) {
    const id = state.documents.length;
    const created = Object.assign({}, document, { id });

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
  },

  setModalState(state, isVisible: boolean) {
    state.modalState = isVisible;
  }
};

const actions = {};

export default {
  state: stateObject,
  getters,
  mutations,
  actions
};
