<template>
  <transition name="v-slide-top">
    <div :class="$style.tools" v-show="isEdit">
      <a-tooltip title="撤销" placement="bottom">
        <a-button
          class="ant-btn-icon-only"
          :disabled="disableUndo"
          @click="undo"
        >
          <my-icon type="icon-Undo" />
        </a-button>
      </a-tooltip>
      <a-tooltip title="恢复" placement="bottom">
        <a-button
          class="ant-btn-icon-only"
          :disabled="disableRedo"
          @click="redo"
        >
          <my-icon type="icon-Redo" />
        </a-button>
      </a-tooltip>
      <a-tooltip title="预览" placement="bottom">
        <a-button icon="eye" @click="preview" />
      </a-tooltip>
      <a-tooltip title="清空画布" placement="bottom">
        <a-button icon="delete" @click="cleanCanvas" />
      </a-tooltip>
      <a-tooltip title="下载" placement="bottom">
        <a-button icon="arrow-down" @click="download" />
      </a-tooltip>
      <a-tooltip title="导入" placement="bottom">
        <a-button icon="import" class="ant-btn-icon-only">
          <input
            @change="onChange($event)"
            type="file"
            :class="$style.export"
            accept=".html"
          />
        </a-button>
      </a-tooltip>
    </div>
  </transition>
</template>

<script>
import { mapState } from "vuex";
import editor from "@/editor";

export default {
  computed: {
    ...mapState("editor", ["disableUndo", "disableRedo"]),
    isEdit() {
      return this.$store.getters["editor/isEdit"];
    }
  },
  methods: {
    preview() {
      this.$store.commit("editor/setStatus", "PREVIEW");
    },
    undo() {
      editor.history.undo();
    },
    redo() {
      editor.history.redo();
    },
    cleanCanvas() {
      this.$confirm({
        title: "是否清空？",
        content: "清空后将无法恢复。",
        okText: "确认",
        cancelText: "取消",
        onOk: () => {
          this.$store.commit("component/removeAll");
        }
      });
    },
    download() {
      if (!this.$store.state.component.tree.length) {
        this.$message.warning("你还没有添加组件");
      } else {
        editor.download();
      }
    },
    onChange(event) {
      editor.import(event, (errorMessage, data) => {
        if (errorMessage) {
          this.$message.error(errorMessage);
        } else {
          this.$store.commit("component/setComponents", data);
        }
        event.target.value = "";
      });
    }
  }
};
</script>

<style lang="postcss" module>
:root {
  --toolsHeight: 32px;
}
.tools {
  width: 100%;
  height: var(--toolsHeight);
  background-color: #fff;
  display: flex;
  justify-content: center;
  z-index: 3;
  box-shadow: 1px 2px 15px rgba(0, 0, 0, 0.05);
  transition: 0.3s;
}
.tools button {
  border: none;
  box-shadow: none;
  background-color: transparent;
}
.tools button:hover {
  background-color: transparent;
}
.tools button:disabled {
  background-color: transparent;
}

.export {
  position: absolute;
  left: 0;
  top: 0;
  opacity: 0;
  width: 32px;
  height: 32px;
  font-size: 0;
  cursor: pointer;
}
</style>
