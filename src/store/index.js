import Vue from "vue";
import Vuex from "vuex";
import selectedLayer from "./modules/selectedLayer";
import component from "./modules/component";
import editor from "./modules/editor";

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    selectedLayer,
    component,
    editor
  }
});
