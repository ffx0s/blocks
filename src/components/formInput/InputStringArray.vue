<template>
  <div :class="$style.input">
    <a-input
      size="small"
      v-for="(val, index) in value"
      :key="index"
      :value="val"
      @change="change($event, index)"
    />
    <a-button size="small" shape="circle" icon="plus" @click="add" />
  </div>
</template>

<script>
export default {
  props: {
    value: {
      type: Array,
      default: () => []
    }
  },
  methods: {
    add() {
      const value = [...this.value, ""];
      this.$emit("change", value);
    },
    change(event, index) {
      const value = [...this.value];
      value.splice(index, 1, event.target.value);
      this.$emit("change", value);
    }
  }
};
</script>

<style module>
.input {
  display: block;
}
</style>
