const stateObject = {
  user: null
};

const getters = {
  getUser: state => state.user
};

const mutations = {
  // getSession?
  signIn(state, user) {
    console.log('Will sign in');
    state.user = user;
  },
  // removeSession?
  signOut(state) {
    console.log('Will sign out');
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
