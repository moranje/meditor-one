const stateObject = {
  user: null
};

const getters = {
  getUser: state => state.user
};

const mutations = {
  // getSession?
  signIn(state, user) {
    state.user = user;
  },
  // removeSession?
  signOut(state) {
    state.user = null;
  }
};

const actions = {};

export default {
  state: stateObject,
  getters,
  mutations,
  actions
};
