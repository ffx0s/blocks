import History from "./history";
import shortcuts from "./shortcuts";
import store from "@/store";

const template = require("pug-loader!./client.template.pug");

function download(content, filename) {
  const link = document.createElement("a");
  link.download = filename;
  link.style.display = "none";
  // 字符内容转变成blob地址
  const blob = new Blob([content]);
  const url = URL.createObjectURL(blob);
  link.href = url;
  // 触发点击
  document.body.appendChild(link);
  link.click();
  // 然后移除
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

class Editor {
  constructor() {
    this.history = new History();
    shortcuts.undo = () => this.history.undo();
    shortcuts.redo = () => this.history.redo();
    shortcuts.delete = () => {
      const { singleLayer, parentLayer } = store.state.selectedLayer;
      const id =
        (singleLayer.show && singleLayer.id) ||
        (parentLayer.show && parentLayer.id);

      if (id) {
        store.commit("component/remove", { id });
      }
    };
    shortcuts.esc = () => {
      const isPreview = store.getters["editor/isPreview"];
      if (isPreview) {
        store.commit("editor/setStatus", "EDIT");
      }
    };
    this.bindShortcuts();
  }
  bindShortcuts() {
    shortcuts.bind();
  }
  unbindShortcuts() {
    shortcuts.unbind();
  }
  setCanvas(el, initX = 0, initY = 0) {
    this.canvasEl = el;
    this.canvasInitX = initX;
    this.canvasInitY = initY;
  }
  download() {
    const html = template({
      title: "首页",
      components: JSON.stringify(store.state.component.tree)
    });
    download(html, "index.html");
  }
  import(event, callback) {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = function(event) {
      const html = event.target.result;
      const start = "window.__data =";
      const end = "</script>";
      const startIndex = html.indexOf(start);

      if (startIndex > 0) {
        let value = html.slice(startIndex);
        const endIndex = value.indexOf(end);
        value = value.slice(start.length, endIndex);
        try {
          const data = JSON.parse(value);
          callback(null, data);
        } catch {
          callback("组件数据解析出错");
        }
      } else {
        callback("该文件没有对应的组件数据");
      }
    };
    reader.readAsText(file);
  }
}

export default new Editor();
