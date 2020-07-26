import Vue from "vue";
import shortid from "shortid";
import editor from "@/editor";
import testData from "@/editor/testData";
import { message } from "ant-design-vue";
import {
  create,
  isParentComponent,
  componentsMap,
  findParent
} from "@/editor/components";
import { isNumber, deepCopy } from "@/utils/shared";
import { Drop, Add, Remove, Move } from "@/editor/actions";

// 遍历某个父组件下的所有子孙组件
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
  function valid(component) {
    return !!componentsMap[component.tag];
  }

  function filterComponent(component) {
    const isValid = valid(component);

    if (isValid && component.children) {
      component.children = component.children.filter(filterComponent);
    }

    return isValid;
  }

  function loop(component) {
    treeMap[component.id] = component;

    if (isParentComponent(component.tag)) {
      component.children.forEach(loop);
    }
  }

  // 以 id 为 key，值为组件数据对象的引用
  const treeMap = {};

  // 过滤组件，排除无效的组件数据
  tree = tree.filter(filterComponent);

  tree.forEach(loop);

  return {
    tree,
    treeMap
  };
}

/**
 * 判断子组件在父组件里是否无效，如：（a-tabs > a-button 无效，a-tabs > a-tab-pane 有效）
 * @param {String} parentTag 父组件 tag
 * @param {String} childTag 子组件 tag
 */
function isWrongChildren(parentTag, childTag) {
  const parentTags =
    componentsMap[childTag] && componentsMap[childTag].parentComponent;
  const childTags =
    componentsMap[parentTag] && componentsMap[parentTag].childrenComponent;

  if (parentTags && parentTags.length) {
    return {
      parentTags,
      error:
        parentTags.indexOf(parentTag) < 0
          ? `${childTag} 只能添加到 ${parentTags.join("、")} 组件里`
          : ""
    };
  } else if (childTags && childTags.length) {
    return {
      childTags,
      error:
        childTags.indexOf(childTag) < 0
          ? `仅允许添加 ${childTags.join("、")} 组件到 ${parentTag}`
          : ""
    };
  }
  return {};
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
    const [parentId, index] = findParent(state.tree, id);

    const component = state.treeMap[id];
    const type = componentsMap[component.tag].type;

    this.commit("selectedLayer/hideLayer", type);

    if (record) {
      editor.history.push(
        new Remove({
          id,
          index,
          parentId,
          component: JSON.stringify(component)
        })
      );
    }

    deleteTreeMap.call(this, state.treeMap, id);

    const children = getChildrenById(state, parentId);
    children.splice(index, 1);
  },
  // 添加组件
  add(state, { parentId, index, component, record = true }) {
    const parentComponent = state.treeMap[parentId] || {};
    const { error, parentTags, childTags } = isWrongChildren(
      parentComponent.tag,
      component.tag
    );

    if (error && parentTags) {
      message.error(error, 4);
      return;
    } else if (childTags) {
      component = create(childTags[0], {}, [component]);
    }

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

    const [moveParentId, moveIndex] = findParent(state.tree, id);
    const moveChildren = getChildrenById(state, moveParentId);
    const children = getChildrenById(state, parentId);

    if (moveChildren === children) return;

    const component = state.treeMap[id];
    const parentTag = parentId ? state.treeMap[parentId].tag : "";
    const { error } = isWrongChildren(parentTag, component.tag);

    if (error) {
      message.error(error, 4);
      return;
    }

    if (record) {
      editor.history.push(
        new Move({
          id,
          parentId,
          moveParentId,
          index: moveIndex
        })
      );
    }

    moveChildren.splice(moveIndex, 1);
    children.splice(isNumber(index) ? index : children.length, 0, component);
  },
  copy(state, { id, record = true }) {
    const [parentId, index] = findParent(state.tree, id);
    const component = deepCopy(state.treeMap[id]);

    component.id = shortid.generate();

    loopComponent(component, function(target) {
      target.id = shortid.generate();
    });

    this.commit("component/add", {
      record,
      component,
      parentId,
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
    let errorMessage = "";
    const check = (parentTag, childTag) => {
      const { error } = isWrongChildren(parentTag, childTag);
      if (error) {
        errorMessage = error;
        message.error(error, 4);
        return false;
      }
      return true;
    };

    if (dropPosition === 0) {
      // 添加到目标内部
      if (isParentComponent(dropObj.tag) && check(dropObj.tag, dragObj.tag)) {
        getChildren(dragParent).splice(dragIndex, 1);
        dropObj.children.push(dragObj);
      }
    } else if (dropPosition === -1) {
      // 添加到目标上方
      if (check(dropParent.tag, dragObj.tag)) {
        getChildren(dragParent).splice(dragIndex, 1);
        getChildren(dropParent).splice(dropIndex, 0, dragObj);
      }
    } else {
      // 添加到目标下方
      if (check(dropParent.tag, dragObj.tag)) {
        getChildren(dragParent).splice(dragIndex, 1);
        getChildren(dropParent).splice(dropIndex + 1, 0, dragObj);
      }
    }

    if (!errorMessage) {
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
    }
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
