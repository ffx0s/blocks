const all = {
  // 编辑状态
  EDIT: 0,
  // 预览状态
  PREVIEW: 1
};

const state = () => ({
  // 当前状态
  status: all.EDIT,
  // 是否禁用撤销
  disableUndo: true,
  // 是否禁用恢复
  disableRedo: true,
  // 画布的拖拽和缩放参数
  position: localStorage.CANVAS_POSITION
    ? JSON.parse(localStorage.CANVAS_POSITION)
    : {
        x: 0,
        y: 0,
        w: "auto",
        h: "auto"
      },
  // 当前编辑中的组件ID
  editId: "",
  // 往父级插入组件时的父ID
  createParentId: "",
  // 对应右侧选项卡的 tabActiveKey 属性
  tabActiveKey: "add",
  // 颜色选择器相关数据
  colorPickerModal: {
    show: false,
    x: 0,
    y: 0,
    color: ""
  }
});

const mutations = {
  setStatus(state, statusName) {
    state.status = all[statusName];
  },
  disableUndoRedo(state, [disableUndo, disableRedo]) {
    state.disableUndo = disableUndo;
    state.disableRedo = disableRedo;
  },
  setEditId(state, id) {
    state.editId = id;
  },
  setCreateParentId(state, id) {
    state.createParentId = id;
  },
  setTabActiveKey(state, key) {
    state.tabActiveKey = key;
  },
  setColorPickerModal(state, props) {
    Object.keys(props).forEach(prop => {
      state.colorPickerModal[prop] = props[prop];
    });
  },
  setPosition(state, props) {
    Object.keys(props).forEach(prop => {
      state.position[prop] = props[prop];
    });
  }
};

const getters = {
  isEdit: state => state.status === all.EDIT,
  isPreview: state => state.status === all.PREVIEW,
  isEmpty(state, getters, rootState) {
    return rootState.component.tree.length === 0;
  },
  editingComponent: (state, getters, rootState) => {
    return rootState.component.treeMap[state.editId];
  }
};

export default {
  state,
  getters,
  mutations,
  namespaced: true
};
