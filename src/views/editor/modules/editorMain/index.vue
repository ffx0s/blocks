<template>
  <DraggableResizable
    :className="$style.main"
    :classNameResizing="$style.resizing"
    :classNameDragging="$style.dragging"
    :position.sync="position"
    :minWidth="minWidth"
    :minHeight="minHeight"
    :parent="true"
    :dragHandle="'.' + $style.dragHandle"
    :styleObj="styleObj"
    @resize="handleResize"
  >
    <!-- 头部 -->
    <CanvasHeader :class="$style.dragHandle" />
    <!-- 主体 -->
    <div
      :class="[$style.canvas, { [$style.emptyStatus]: isEmpty }]"
      class="v-custom-scrollbar"
      @dragover.prevent
      @dragenter="handleDragenter"
      @drop="handleDrop"
      @mouseleave="hideLayer"
      ref="canvas"
    >
      <div @mouseover="handleCanvasMouseover" :class="$style.components">
        <ComponentItem
          v-for="component in tree"
          :key="component.id"
          :component="component"
        />
      </div>
      <a-empty
        :class="$style.empty"
        :image="emptyImage"
        description="空空如也，可通过左侧拖拽组件添加"
      />
      <SelectedLayer />
    </div>
  </DraggableResizable>
</template>

<script>
import SelectedLayer from "./SelectedLayer";
import CanvasHeader from "./CanvasHeader";
import DraggableResizable from "@/components/dragResizable";
import ComponentItem from "@/components/componentItem";
import { create, getComponentType, getComponentId } from "@/editor/components";
import { Empty, Modal } from "ant-design-vue";
import { mapState, mapGetters } from "vuex";
import store from "@/store";
import editor from "@/editor";

export default {
  components: {
    CanvasHeader,
    SelectedLayer,
    DraggableResizable,
    ComponentItem
  },
  computed: {
    ...mapState("component", ["tree"]),
    ...mapState("editor", ["position"]),
    ...mapGetters("editor", ["isPreview", "isEmpty"])
  },
  watch: {
    isPreview(isPreview) {
      if (isPreview) {
        const { canvasInitX, canvasInitY } = editor;
        const x = canvasInitX + this.position.x;
        const y = canvasInitY + this.position.y;

        this.styleObj = {
          position: "fixed",
          left: x + "px",
          top: y + "px",
          transform: null
        };

        setTimeout(() => {
          this.styleObj = {};
          this.$store.commit("editor/setPosition", { x: x - 10, y: y - 10 });
        }, 500);
      }
    }
  },
  data() {
    return {
      styleObj: {},
      minWidth: 320,
      minHeight: 200,
      emptyImage: Empty.PRESENTED_IMAGE_SIMPLE
    };
  },
  mounted() {
    window.addEventListener("beforeunload", this.setLocalData);

    editor.setCanvas(this.$refs.canvas);

    // 监听撤销、恢复记录的操作
    editor.history.on("input", history => {
      // 更新对应的状态
      store.commit("editor/disableUndoRedo", [
        history.disableUndo,
        history.disableRedo
      ]);
    });

    // 不支持 ResizeObserver 的浏览器需要手动触发一次 resize 事件
    if (!window.ResizeObserver) {
      window.dispatchEvent(new Event("resize"));
      Modal.info({
        content: "为了有更好的体验，请使用最新版 Chrome 浏览器打开。"
      });
    }
  },
  beforeDestroy() {
    window.removeEventListener("beforeunload", this.setLocalData);
  },
  methods: {
    handleCanvasMouseover(event) {
      if (this.isPreview) return;

      const elPath = event.path || (event.composedPath && event.composedPath());
      const length = elPath.length;
      let hideParentLayer = true;
      let hideSingleLayer = true;

      for (let i = 0; i < length; i++) {
        const current = elPath[i];
        const type = getComponentType(current);

        if (type === "single") {
          hideSingleLayer = false;
          store.dispatch("selectedLayer/showLayerByComponentEl", current);
        } else if (type === "parent") {
          hideParentLayer = false;
          const { show, id } = store.state.selectedLayer.parentLayer;
          if (show && id === getComponentId(current)) {
            break;
          } else {
            store.dispatch("selectedLayer/showLayerByComponentEl", current);
            break;
          }
        }
      }

      if (hideParentLayer) {
        store.commit("selectedLayer/hideLayer", "parent");
      }

      if (hideSingleLayer) {
        store.commit("selectedLayer/hideLayer", "single");
      }
    },
    setLocalData() {
      localStorage.TREE = JSON.stringify(this.tree);
      localStorage.CANVAS_POSITION = JSON.stringify(this.position);
    },
    hideLayer() {
      store.commit("selectedLayer/hideLayer");
    },
    handleDragenter(event) {
      const elPath = event.path || (event.composedPath && event.composedPath());
      const el = elPath.find(el => getComponentType(el) === "parent");

      if (el) {
        this.$store.dispatch("selectedLayer/showLayerByComponentEl", el);
      } else {
        this.$store.commit("selectedLayer/hideLayer");
      }
    },
    handleDrop(event) {
      const { id, show } = this.$store.state.selectedLayer.parentLayer;
      const tag = event.dataTransfer.getData("tag");
      const moveId = event.dataTransfer.getData("moveId");

      if (tag) {
        this.$store.commit("component/add", {
          parentId: show && id,
          component: create(tag)
        });
      } else if (moveId) {
        this.$store.commit("component/move", {
          id: moveId,
          parentId: show && id
        });
      }
      this.$store.commit("editor/setCreateParentId", "");
    },
    handleResize({ target }) {
      clearTimeout(this.resizeTimer);
      this.resizeTimer = setTimeout(() => {
        editor.canvasInitX = target.offsetLeft;
        editor.canvasInitY = target.offsetTop;
      }, 200);
    }
  }
};
</script>

<style module>
.main {
  position: absolute;
  width: 100%;
  height: 100%;
  box-shadow: 1px 2px 15px rgba(0, 0, 0, 0.05);
  background-color: white;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
.canvas {
  position: relative;
  padding-top: 35px;
  width: 100%;
  height: 100%;
  overflow: auto;
}
.components {
  position: relative;
  z-index: 1;
  height: 100%;
}
.empty {
  display: none;
}
.emptyStatus {
  display: flex;
  justify-content: center;
  align-items: center;
}
.emptyStatus .empty {
  display: block;
}
.resizing .canvas,
.dragging .canvas {
  pointer-events: none;
}
.dragHandle {
  width: 100%;
}
</style>
