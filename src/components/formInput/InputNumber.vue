<template>
  <a-input-group compact>
    <a-input-number
      autoFocus
      size="small"
      style="width:70px"
      :value="initialValues[0]"
      @change="handleNumberChange"
    />
    <a-select
      style="width: 64px"
      size="small"
      :value="initialValues[1]"
      @change="handleUnitChange"
    >
      <a-select-option :key="unit" v-for="unit in units">
        {{ unit }}
      </a-select-option>
    </a-select>
  </a-input-group>
</template>

<script>
import { getCssUnit, getCssNumber, isNumber } from "@/utils/shared";

export default {
  props: {
    value: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      units: ["px", "%", "vw", "vh", "em", "rem", "vmin", "vmax"]
    };
  },
  computed: {
    initialValues() {
      const value = this.value;
      return [getCssNumber(value), getCssUnit(value) || this.units[0]];
    }
  },
  methods: {
    handleNumberChange(number) {
      this.$emit(
        "change",
        isNumber(number) ? number + this.initialValues[1] : ""
      );
    },
    handleUnitChange(unit) {
      this.$emit("change", this.initialValues[0] + unit);
    }
  }
};
</script>
