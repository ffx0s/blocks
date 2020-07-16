<template>
  <div :class="$style.layout">
    <EditorToolBar />
    <div :class="$style.editor">
      <div :class="$style.left">
        <EditorMain />
      </div>
      <transition name="v-slide-right">
        <div :class="$style.right" v-show="isEdit">
          <EditorSide />
        </div>
      </transition>
    </div>
    <ColorPickerModal />
  </div>
</template>

<script>
import EditorToolBar from "./modules/editorToolBar";
import EditorMain from "./modules/editorMain";
import EditorSide from "./modules/editorSide";
import ColorPickerModal from "@/components/colorPickerModal";
import { mapGetters } from "vuex";

export default {
  components: {
    EditorToolBar,
    EditorMain,
    EditorSide,
    ColorPickerModal
  },
  computed: {
    ...mapGetters("editor", ["isEdit"])
  }
};
</script>

<style module>
:root {
  --margin: 10px;
}
.layout {
  display: flex;
  flex-direction: column;
  height: 100%;
}
.editor {
  margin: var(--margin);
  display: flex;
  flex: 1;
}
.left {
  position: relative;
  flex: 1;
}
.right {
  margin-left: var(--margin);
  width: 380px;
  height: 100%;
  background-color: #fff;
  box-shadow: 1px 2px 15px rgba(0, 0, 0, 0.05);
  z-index: 2;
}
</style>
