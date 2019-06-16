const state = {
  top: [],
  right: [],
  bottom: [],
  left: [],
  height: 0,
  width: 0,
}

function dimensionSize(property) {
  return (accumulator, current) => {
    if (current && current[property]) return accumulator + current[property]

    return accumulator + 0
  }
}

const getters = {
  vertical(state) {
    let top = state.top.reduce(dimensionSize('clientHeight'), 0)
    let bottom = state.bottom.reduce(dimensionSize('clientHeight'), 0)

    return top + bottom
  },

  horizontal(state) {
    const DIVIDER = 1
    let right = state.right.reduce(dimensionSize('clientWidth'), 0)
    let left = state.left.reduce(dimensionSize('clientWidth'), 0)

    if (state.left.length > 1) return right + DIVIDER + left

    return right + left
  },

  main(state, getters) {
    return {
      width: state.width - getters.horizontal,
      height: state.height - getters.vertical,
    }
  },
}

const mutations = {
  addElement(state, { element, position, index }) {
    if (element && position && index !== undefined) {
      state[position].splice(index, 1, element)
    }
  },

  removeElement(state, { position, index }) {
    if (position && index !== undefined) {
      // 'undefined' is inserted to keep the position of the elements unchanged
      state[position].splice(index, 1, undefined)
    }
  },

  addDocument(state, { width, height }) {
    state.width = width
    state.height = height
  },
}

const actions = {}

export default {
  state,
  getters,
  mutations,
  actions,
}
