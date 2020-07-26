<template>
  <router-view />
</template>

<style lang="postcss">
@import "~ant-design-vue/dist/antd.css";
body {
  background-color: rgb(246, 249, 252);
  overflow: hidden;
}

.v-slide-enter-active,
.v-slide-leave-active,
.v-slide-top-enter-active,
.v-slide-top-leave-active,
.v-slide-right-enter-active,
.v-slide-right-leave-active,
.v-slide-left-enter-active,
.v-slide-left-leave-active {
  transition: opacity 0.3s, transform 0.3s;
}

.v-slide-enter,
.v-slide-leave-to {
  opacity: 0;
  transform: translateY(10px);
}

.v-slide-right-enter,
.v-slide-right-leave-to {
  opacity: 0;
  transform: translateX(100%);
}

.v-slide-top-enter,
.v-slide-top-leave-to {
  opacity: 0;
  transform: translateY(-100%);
}

.v-slide-left-enter,
.v-slide-left-leave-to {
  opacity: 0;
  transform: translateX(-100%);
}
</style>
