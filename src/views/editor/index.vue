<template>
  <div :class="$style.layout">
    <transition name="v-slide-top">
      <EditorToolBar v-show="isEdit" />
    </transition>
    <div :class="$style.editor">
      <transition name="v-slide-left">
        <EditorLeftSide :class="$style.side" v-show="isEdit" />
      </transition>
      <div :class="$style.middle">
        <EditorMain />
      </div>
      <transition name="v-slide-right">
        <EditorRightSide :class="$style.side" v-show="isEdit" />
      </transition>
    </div>
    <ColorPickerModal />
  </div>
</template>

<script>
import EditorToolBar from "./modules/editorToolBar";
import EditorMain from "./modules/editorMain";
import EditorLeftSide from "./modules/editorSide/LeftSide";
import EditorRightSide from "./modules/editorSide/RightSide";
import ColorPickerModal from "@/components/colorPickerModal";

import { mapGetters } from "vuex";

export default {
  components: {
    EditorToolBar,
    EditorMain,
    EditorLeftSide,
    EditorRightSide,
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
.middle {
  position: relative;
  flex: 1;
}
.side {
  height: 100%;
  background-color: #fff;
  box-shadow: 1px 2px 15px rgba(0, 0, 0, 0.05);
  z-index: 2;
}
</style>
