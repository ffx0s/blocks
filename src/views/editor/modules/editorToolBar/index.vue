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
      <a-tooltip title="源码" placement="bottom">
        <a-button icon="code" @click="showCode" />
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

      <a-modal
        centered
        :width="820"
        v-model="showCodeModal"
        title=""
        @cancel="cancelCodeModal"
      >
        <div slot="closeIcon"></div>
        <div :class="$style.code">
          <pre class="language-html"><code v-html="code" /></pre>
        </div>
        <div slot="footer">
          <a-button @click="cancelCodeModal">关闭</a-button>
          <a-button v-if="copyError" type="error">失败</a-button>
          <a-button v-else-if="copySuccess" type="success">
            <a-icon type="check" :style="{ color: '#52c41a' }" />已复制
          </a-button>
          <a-button v-else type="primary" @click="copyCode">复制</a-button>
        </div>
      </a-modal>
    </div>
  </transition>
</template>

<script>
import { mapState } from "vuex";
import editor from "@/editor";
import Prism from "prismjs";
import { copy } from "@/utils/shared";

export default {
  computed: {
    ...mapState("editor", ["disableUndo", "disableRedo"]),
    isEdit() {
      return this.$store.getters["editor/isEdit"];
    }
  },
  data() {
    return {
      code: "",
      showCodeModal: false,
      copyError: false,
      copySuccess: false
    };
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
    showCode() {
      this._code = editor.toCode();
      this.code = Prism.highlight(this._code, Prism.languages.html, "html");

      this.showCodeModal = true;
    },
    copyCode() {
      const errMessage = copy(this._code);
      if (errMessage) {
        this.copyError = true;
      } else {
        this.copyError = false;
        this.copySuccess = true;
      }
      clearTimeout(this.copyTimer);
      this.copyTimer = setTimeout(() => {
        this.copyError = false;
        this.copySuccess = false;
      }, 3000);
    },
    cancelCodeModal() {
      this.showCodeModal = false;
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
          this.$message.error(errorMessage, 1);
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

.code {
  max-height: 70vh;
  overflow: auto;
}
</style>
