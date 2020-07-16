import EventEmitter from "@/utils/eventEmitter";

/**
 * 撤销、恢复操作
 */
export default class History extends EventEmitter {
  constructor() {
    super();
    // 记录栈
    this.stack = [];
    // 当前指针
    this.index = 0;
    this.disableUndo = true;
    this.disableRedo = true;
    // this.max = 30
  }
  push(action) {
    // if (this.index > this.max) {}
    this.stack[this.index++] = action;
    this.stack.length = this.index;
    this.input();
  }
  undo() {
    if (this.index > 0) {
      this.stack[--this.index].undo(...arguments);
      this.input();
    }
  }
  redo() {
    if (this.index < this.stack.length) {
      this.stack[this.index++].redo(...arguments);
      this.input();
    }
  }
  input() {
    this.disableUndo = this.index <= 0;
    this.disableRedo = this.index >= this.stack.length;
    this.emit("input", this);
  }
  each(callback, index) {
    index = typeof index !== "undefined" ? index : this.index;

    for (let i = 0; i < index; i++) {
      callback(this.stack[i], i);
    }
  }
  reset() {
    this.stack.length = 0;
    this.index = 0;
    this.disableUndo = true;
    this.disableRedo = true;
    this.input();
  }
}
