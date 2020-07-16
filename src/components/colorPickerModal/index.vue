<template>
  <div v-show="modal.show" @click.self="hideModal" :class="$style.modal">
    <ColorPicker
      :class="$style.picker"
      :value="modal.color"
      :style="position"
      @input="updateValue"
    />
  </div>
</template>

<script>
import { Sketch } from "vue-color";
import { mapState } from "vuex";
import store from "@/store";

const noop = function() {};

const component = {
  components: {
    ColorPicker: Sketch
  },
  computed: {
    ...mapState("editor", {
      modal: state => state.colorPickerModal
    }),
    position() {
      const { x, y } = this.modal;
      return {
        left: x + "px",
        top: y + "px"
      };
    }
  },
  methods: {
    hideModal() {
      store.commit("editor/setColorPickerModal", {
        show: false
      });
      component.__updateValue = noop;
    },
    updateValue(value) {
      component.__updateValue(value);
    }
  },
  // 对外提供色值更新时的钩子函数，外部通过重新赋值此方法即可（为单例方法，只允许存在一个触发函数）
  __updateValue: noop
};

export default component;
</script>

<style module>
.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 3;
}
.picker {
  position: fixed;
  z-index: 4;
  font-family: arial;
}
</style>
