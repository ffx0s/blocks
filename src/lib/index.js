import Vue from "vue";

const components = ["breadcrumb", "button", "tab", "text"];

components.forEach(component => {
  Vue.component("v-" + component, require("./" + component).default);
});
