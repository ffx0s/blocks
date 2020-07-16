import store from "@/store";

// 拖拽：撤销恢复
export class Drop {
  constructor(options) {
    this.options = options;
  }
  undo() {
    store.commit("component/dropUndo", this.options);
  }
  redo() {
    store.commit("component/dropRedo", this.options);
  }
}

function removeAction({ id }) {
  store.commit("component/remove", {
    id,
    record: false
  });
}

function addAction({ parentId, index, component }) {
  store.commit("component/add", {
    parentId,
    index,
    component: JSON.parse(component),
    record: false
  });
}

// 添加：撤销恢复
export class Add {
  constructor(options) {
    this.options = options;
  }
  undo() {
    removeAction(this.options);
  }
  redo() {
    addAction(this.options);
  }
}

//移除：撤销恢复
export class Remove {
  constructor(options) {
    this.options = options;
  }
  undo() {
    addAction(this.options);
  }
  redo() {
    removeAction(this.options);
  }
}

//移动：撤销恢复
export class Move {
  constructor(options) {
    this.options = options;
  }
  undo() {
    store.commit("component/move", {
      parentId: this.options.moveParentId,
      id: this.options.id,
      index: this.options.index,
      record: false
    });
  }
  redo() {
    store.commit("component/move", {
      parentId: this.options.parentId,
      id: this.options.id,
      record: false
    });
  }
}
