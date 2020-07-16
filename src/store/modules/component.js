import Vue from "vue";
import { isParentComponent, componentsMap } from "@/editor/components";
import { isNumber, deepCopy } from "@/utils/shared";
import editor from "@/editor";
import testData from "@/editor/testData";
import { Drop, Add, Remove, Move } from "@/editor/actions";
import shortid from "shortid";

function loopComponent(component, callback) {
  if (isParentComponent(component.tag)) {
    const children = component.children;
    const length = children.length;
    for (let i = 0; i < length; i++) {
      callback(children[i], i);
      loopComponent(children[i], callback);
    }
  }
}

function findParent(tree, id) {
  function loop(target) {
    const children = isParentComponent(target.tag) ? target.children : target;
    for (let i = 0; i < children.length; i++) {
      const current = children[i];
      if (current.id === id) {
        return [target, i];
      }
      const result = loop(current);
      if (result) return result;
    }
  }
  return loop(tree);
}

// 映射组件数据
function setTreeMap(treeMap, component) {
  Vue.set(treeMap, component.id, component);
  if (isParentComponent(component.tag)) {
    component.children.forEach(childComponent => {
      setTreeMap(treeMap, childComponent);
    });
  }
}

function deleteTreeMap(treeMap, id) {
  const component = treeMap[id];
  if (id === this.state.editor.editId) {
    this.commit("editor/setEditId", "");
  }
  if (isParentComponent(component.tag)) {
    component.children.forEach(childComponent => {
      deleteTreeMap.call(this, treeMap, childComponent.id);
    });
  }
  Vue.delete(treeMap, id);
}

function getChildrenById(state, id) {
  return id ? state.treeMap[id].children : state.tree;
}

function initTreeState(tree = []) {
  // 以 id 为 key，值为组件数据对象的引用
  const treeMap = {};

  function loop(component) {
    treeMap[component.id] = component;

    if (isParentComponent(component.tag)) {
      component.children.forEach(loop);
    }
  }

  tree.forEach(loop);

  return {
    tree,
    treeMap
  };
}

const state = () =>
  initTreeState(localStorage.TREE ? JSON.parse(localStorage.TREE) : testData);

const mutations = {
  // 删除所有组件
  removeAll(state) {
    state.treeMap = {};
    state.tree = [];
    this.commit("editor/setEditId", "");
  },
  // 设置组件数据
  setComponents(state, data) {
    const { tree, treeMap } = initTreeState(data);
    state.treeMap = treeMap;
    state.tree = tree;
    this.commit("editor/setEditId", "");
  },
  // 通过 id 删除组件
  remove(state, { id, record = true }) {
    const [parent, index] = findParent(state.tree, id);

    if (!parent) return;

    const component = state.treeMap[id];
    const type = componentsMap[component.tag].type;

    this.commit("selectedLayer/hideLayer", type);

    if (record) {
      editor.history.push(
        new Remove({
          id,
          index,
          parentId: parent.id,
          component: JSON.stringify(component)
        })
      );
    }

    deleteTreeMap.call(this, state.treeMap, id);

    const children = getChildrenById(state, parent.id);
    children.splice(index, 1);
  },
  // 添加组件
  add(state, { parentId, index, component, record = true }) {
    if (record) {
      editor.history.push(
        new Add({
          parentId,
          id: component.id,
          component: JSON.stringify(component)
        })
      );
    }

    const children = getChildrenById(state, parentId);

    children.splice(isNumber(index) ? index : children.length, 0, component);

    setTreeMap(state.treeMap, component);
  },
  // 移动组件
  move(state, { parentId, id, index, record = true }) {
    if (parentId === id) return;

    const [moveParent, moveIndex] = findParent(state.tree, id);
    const moveChildren = getChildrenById(state, moveParent.id);
    const children = getChildrenById(state, parentId);

    if (moveChildren === children) return;

    const component = state.treeMap[id];

    if (record) {
      editor.history.push(
        new Move({
          id,
          parentId,
          index: moveIndex,
          moveParentId: moveParent.id
        })
      );
    }

    moveChildren.splice(moveIndex, 1);
    children.splice(isNumber(index) ? index : children.length, 0, component);
  },
  copy(state, { id, record = true }) {
    const [parentComponent, index] = findParent(state.tree, id);
    const component = deepCopy(state.treeMap[id]);

    component.id = shortid.generate();

    loopComponent(component, function(target) {
      target.id = shortid.generate();
    });

    this.commit("component/add", {
      record,
      component,
      parentId: parentComponent.id,
      index: index + 1
    });
  },
  /**
   * 拖拽组件到指定位置
   * @param {Object} state store state
   * @param {Object} obj 参数对象
   * @property {String} obj.id 组件id（可选），有则表示从该组件开始，没有则从 state.tree 开始。
   * @property {Array} obj.dragPos 拖拽组件的对象路径（包含所有父级路径）
   * @property {Array} obj.dropPos 目标组件的对象路径（包含所有父级路径）
   * @property {Number} obj.dropPosition 拖拽组件到目标组件的位置，0：内部，-1：顶部，1：底部
   */
  drop(state, { id, dragPos, dropPos, dropPosition }) {
    let tree = id ? [state.treeMap[id]] : state.tree;

    const getTarget = pos => {
      const parentIndex = Math.max(pos.length - 2, 0);

      let parent = pos.length === 1 && !id ? tree : null;

      const target = pos.reduce((obj, pos, index) => {
        const current = index === 0 ? obj[pos] : obj.children[pos];
        if (!parent && index === parentIndex) parent = current;
        return current;
      }, tree);

      return [target, parent];
    };
    const getChildren = parent =>
      Array.isArray(parent) ? parent : parent.children;
    const [dragObj, dragParent] = getTarget(dragPos);
    const [dropObj, dropParent] = getTarget(dropPos);
    const dragIndex = +dragPos[dragPos.length - 1];
    const dropIndex = +dropPos[dropPos.length - 1];

    if (dropPosition === 0) {
      if (isParentComponent(dropObj.tag)) {
        getChildren(dragParent).splice(dragIndex, 1);
        dropObj.children.push(dragObj);
      }
    } else if (dropPosition === -1) {
      getChildren(dragParent).splice(dragIndex, 1);
      getChildren(dropParent).splice(dropIndex, 0, dragObj);
    } else {
      getChildren(dragParent).splice(dragIndex, 1);
      getChildren(dropParent).splice(dropIndex + 1, 0, dragObj);
    }

    editor.history.push(
      new Drop({
        dropIndex,
        dropPosition,
        dropId: dropObj.id,
        dropParentId: dropParent.id,
        dragIndex,
        dragId: dragObj.id,
        dragParentId: dragParent.id
      })
    );
  },
  dropUndo(
    state,
    {
      dropPosition,
      dropId,
      dropIndex,
      dropParentId,
      dragId,
      dragIndex,
      dragParentId
    }
  ) {
    const dragObj = state.treeMap[dragId];
    const dropObj = state.treeMap[dropId];

    if (dropPosition === 0) {
      dropObj.children.pop();
    } else if (dropPosition === -1) {
      getChildrenById(state, dropParentId).splice(dropIndex, 1);
    } else {
      getChildrenById(state, dropParentId).splice(dropIndex + 1, 1);
    }
    getChildrenById(state, dragParentId).splice(dragIndex, 0, dragObj);
  },
  dropRedo(
    state,
    {
      dropId,
      dropPosition,
      dropParentId,
      dropIndex,
      dragIndex,
      dragParentId,
      dragId
    }
  ) {
    const dropObj = state.treeMap[dropId];
    const dragObj = state.treeMap[dragId];

    getChildrenById(state, dragParentId).splice(dragIndex, 1);

    if (dropPosition === 0) {
      dropObj.children.push(dragObj);
    } else if (dropPosition === -1) {
      getChildrenById(state, dropParentId).splice(dropIndex, 0, dragObj);
    } else {
      getChildrenById(state, dropParentId).splice(dropIndex + 1, 0, dragObj);
    }
  },
  setProp(state, { id, targetName, prop, value }) {
    const component = state.treeMap[id];
    if (targetName) {
      if (component.hasOwnProperty(targetName)) {
        Vue.set(component[targetName], prop, value);
      } else {
        Vue.set(component, targetName, { [prop]: value });
      }
    } else {
      Vue.set(component, prop, value);
    }
  },
  deleteProp(state, { id, targetName, prop }) {
    const component = state.treeMap[id];

    Vue.delete(targetName ? component[targetName] : component, prop);
  }
};

const getters = {
  get: state => id => {
    return state.treeMap[id];
  }
};

export default {
  state,
  mutations,
  getters,
  namespaced: true
};
