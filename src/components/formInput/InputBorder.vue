<template>
  <div>
    <a-form-item label="大小">
      <InputNumber :value="initialValues[0]" @change="handleSizeChange" />
    </a-form-item>
    <a-form-item label="样式">
      <a-select
        size="small"
        style="width: 80px"
        :value="initialValues[1]"
        @change="handleStyleChange"
      >
        <a-select-option v-for="style in borderStyles" :key="style">
          {{ style }}
        </a-select-option>
      </a-select>
    </a-form-item>
    <a-form-item label="颜色">
      <InputColor :value="initialValues[2]" @change="handleColorChange" />
    </a-form-item>
  </div>
</template>

<script>
import InputNumber from "./InputNumber";
import InputColor from "./InputColor";
import { colorRegular } from "@/utils/shared";

const styleRegular = new RegExp(
  ["solid", "dashed", "dotted", "double", "groove"].join("|"),
  "g"
);

export default {
  components: {
    InputNumber,
    InputColor
  },
  props: {
    value: {
      type: String,
      default: ""
    }
  },
  computed: {
    initialValues() {
      const value = this.value;
      let borderStyle = this.borderStyles[0];
      let borderColor = "";
      const borderWidth = value
        .replace(colorRegular, $0 => {
          borderColor = $0;
          return "";
        })
        .replace(styleRegular, $0 => {
          borderStyle = $0;
          return "";
        })
        .trim();
      return [borderWidth, borderStyle, borderColor];
    }
  },
  data() {
    return {
      borderStyles: ["solid", "dashed", "dotted", "double", "groove"]
    };
  },
  methods: {
    handleSizeChange(size) {
      const value = this.getValue(
        size,
        this.initialValues[1],
        this.initialValues[2]
      );
      this.$emit("change", value);
    },
    handleStyleChange(style) {
      const value = this.getValue(
        this.initialValues[0],
        style,
        this.initialValues[2]
      );
      this.$emit("change", value);
    },
    handleColorChange(color) {
      const value = this.getValue(
        this.initialValues[0],
        this.initialValues[1],
        color
      );
      this.$emit("change", value);
    },
    getValue(borderWidth, borderStyle, borderColor) {
      return [borderWidth, borderStyle, borderColor].join(" ").trim();
    }
  }
};
</script>
