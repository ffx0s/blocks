import Vue from "vue";

const components = ["button", "text"];

components.forEach(component => {
  Vue.component("v-" + component, require("./" + component).default);
});
