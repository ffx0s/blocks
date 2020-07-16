import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import Antd, { Icon } from "ant-design-vue";
import "@/lib";

Vue.use(Antd);

const MyIcon = Icon.createFromIconfontCN({
  scriptUrl: "//at.alicdn.com/t/font_1839424_60hsh046yja.js"
});
Vue.component("my-icon", MyIcon);

Vue.component(
  "InputStringArray",
  require("@/components/formInput/InputStringArray").default
);
Vue.component(
  "InputColor",
  require("@/components/formInput/InputColor").default
);
Vue.component("ComponentItem", require("@/components/componentItem").default);

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
