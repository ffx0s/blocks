<template>
  <transition name="v-slide">
    <div
      v-if="loaded"
      v-show="visible"
      :class="[$style.modal, mask && $style.mask]"
      @click.self="handleCancel"
    >
      <DraggableResizable
        :class="[$style.wrapper, wrapperClass]"
        :dragHandle="'.' + $style.dragHandle"
      >
        <div :class="$style.dragHandle" />
        <a-icon :class="$style.close" type="close" @click="handleCancel" />
        <div :class="['v-custom-scrollbar', $style.content]" :style="styles">
          <div :class="$style.header">
            <slot name="title">
              <h3 :class="$style.title" v-if="title">{{ title }}</h3>
            </slot>
          </div>
          <slot />
        </div>
      </DraggableResizable>
    </div>
  </transition>
</template>

<script>
import DraggableResizable from "@/components/dragResizable";

export default {
  components: {
    DraggableResizable
  },
  props: {
    title: {
      type: String,
      default: ""
    },
    visible: {
      type: Boolean,
      required: true
    },
    wrapperClass: {
      type: String,
      default: ""
    },
    styles: {
      type: Object,
      default: () => {}
    },
    mask: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      loaded: false
    };
  },
  watch: {
    visible: {
      handler: function(visible) {
        if (visible && !this.loaded) {
          this.loaded = true;
        }
      },
      immediate: true
    }
  },
  methods: {
    handleCancel() {
      this.$emit("cancel");
    }
  }
};
</script>

<style module>
.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 3;
  pointer-events: none;
}

.mask {
  pointer-events: auto;
}

.wrapper {
  position: fixed;
  left: 72%;
  top: 2%;
  max-height: 80vh;
  background: #fff;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  border: 1px solid #ebeef5;
  border-radius: 4px;
  pointer-events: auto;
  overflow: hidden;
}

.content {
  width: 100%;
  height: 100%;
  max-height: inherit;
  overflow: auto;
  word-break: break-all;
  padding: 12px;
  color: #606266;
  font-size: 14px;
}

.header {
  display: flex;
  align-items: center;
  margin-bottom: 12px;
}

.title {
  margin-bottom: 0;
}

.dragHandle {
  position: absolute;
  width: 100%;
  height: 15px;
  z-index: 3;
  cursor: move;
}

.close {
  position: absolute;
  right: 0;
  top: 6px;
  padding: 10px;
  z-index: 4;
}
</style>
