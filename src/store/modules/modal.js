const state = () => ({
  treeModal: {
    show: false
  },
  selectionModal: {
    id: null,
    show: false
  },
  editModal: {
    id: null,
    show: false
  },
  colorPickerModal: {
    show: false,
    x: 0,
    y: 0,
    color: ""
  }
});

const mutations = {
  setModalProps(state, { name, props }) {
    const modal = state[`${name}Modal`];
    Object.keys(props).forEach(prop => {
      modal[prop] = props[prop];
    });
  }
};

export default {
  state,
  mutations,
  namespaced: true
};
