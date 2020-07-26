<template>
  <div :class="$style.inputColor">
    <div @click="showColorPicker" :class="$style.pickerWrap">
      <div :class="$style.color" :style="{ 'background-color': color }"></div>
      <div :class="$style.backgroundImage" />
    </div>
    <a-icon
      :class="$style.clean"
      type="delete"
      title="清除颜色"
      @click="clean"
    />
  </div>
</template>

<script>
import ColorPickerModal from "@/components/colorPickerModal";

export default {
  props: {
    value: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      color: this.value
    };
  },
  methods: {
    showColorPicker(event) {
      let { x, y } = event.target.getBoundingClientRect();
      const viewWidth = document.documentElement.clientWidth;
      const viewHeight = document.documentElement.clientHeight;
      const pickerWidth = 220;
      const pickerHeight = 309;

      y += 23;

      if (x + pickerWidth > viewWidth) {
        x = viewWidth - pickerWidth;
      }
      if (y + pickerHeight > viewHeight) {
        y = viewHeight - pickerHeight;
      }

      this.$store.commit("editor/setColorPickerModal", {
        x,
        y,
        show: true,
        color: this.color
      });

      ColorPickerModal.__updateValue = value => {
        clearTimeout(this.timer);
        this.timer = setTimeout(() => {
          const { r, g, b, a } = value.rgba;
          const color = `rgba(${r}, ${g}, ${b}, ${a})`;
          this.$emit("change", color);
          this.color = color;
        });
      };
    },
    clean() {
      this.color = "";
      this.$store.commit("editor/setColorPickerModal", { color: "" });
      this.$emit("change", "");
    }
  }
};
</script>

<style module>
.inputColor {
  margin-top: 9px;
  display: flex;
  align-items: center;
}
.pickerWrap {
  position: relative;
  width: 40px;
  height: 22px;
}
.backgroundImage {
  width: 100%;
  height: 100%;
  background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAMElEQVQ4T2N89uzZfwY8QFJSEp80A+OoAcMiDP7//483HTx//hx/Ohg1gIFx6IcBALl+VXknOCvFAAAAAElFTkSuQmCC");
}
.color {
  position: absolute;
  width: 100%;
  height: 100%;
  cursor: pointer;
  border: 1px solid #d9d9d9;
}
.clean {
  margin-left: 10px;
}
.clean:hover {
  color: #1890ff;
}
</style>
