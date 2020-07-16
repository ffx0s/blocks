const filterElements = ["input", "textarea"];

const shortcuts = {
  bind() {
    document.addEventListener("keydown", shortcuts.handle);
  },
  unbind() {
    document.removeEventListener("keydown", shortcuts.handle);
  },
  handle(event) {
    // console.log(event, event.target, event.key, event.keyCode, event.metaKey);
    // 跳过表单元素
    const tagName = document.activeElement.tagName.toLocaleLowerCase();
    if (filterElements.indexOf(tagName) !== -1) return;

    switch (event.keyCode) {
      // redo undo
      case 90:
        if (event.metaKey || event.ctrlKey) {
          event.preventDefault();
          const name = event.shiftKey ? "redo" : "undo";
          shortcuts[name] && shortcuts[name](event);
        }
        break;
      // delete
      case 8:
        event.preventDefault();
        shortcuts.delete && shortcuts.delete(event);
        break;
      // esc
      case 27:
        event.preventDefault();
        shortcuts.esc && shortcuts.esc(event);
        break;
    }
  }
};

export default shortcuts;
