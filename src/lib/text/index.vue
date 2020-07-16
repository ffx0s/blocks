<template>
  <component :class="$style.text" :is="tag" v-html="content"></component>
</template>

<script>
export default {
  props: {
    tag: {
      type: String,
      default: "div"
    },
    content: {
      type: String,
      default: ""
    }
  }
};
</script>

<style module>
.text {
  word-break: break-all;
}
</style>
