<template>
  <a-collapse
    v-if="editId"
    class="__componentEdit"
    v-model="activeKey"
    :bordered="false"
  >
    <div :class="$style.info">
      <a-tag
        @mouseenter="showLayer"
        @mouseleave="hideLayer"
        @click="scrollTo"
        color="blue"
        style="cursor: pointer"
      >
        组件：{{ editingComponent.tag }}
      </a-tag>
      <a-tag>ID: {{ editId }}</a-tag>
    </div>
    <a-collapse-panel key="props" header="组件属性">
      <PropEdit />
    </a-collapse-panel>
    <a-collapse-panel key="styles" header="自定义样式">
      <StyleEdit />
    </a-collapse-panel>
  </a-collapse>
  <a-empty v-else :image="emptyImage" description="当前没有组件处于编辑中" />
</template>

<script>
import { mapState, mapGetters } from "vuex";
import { Empty } from "ant-design-vue";
import store from "@/store";
import PropEdit from "./PropEdit";
import StyleEdit from "./StyleEdit";

export default {
  components: {
    PropEdit,
    StyleEdit
  },
  computed: {
    ...mapState("editor", ["editId"]),
    ...mapGetters("editor", ["editingComponent"])
  },
  data() {
    return {
      activeKey: ["props", "styles"],
      emptyImage: Empty.PRESENTED_IMAGE_SIMPLE
    };
  },
  methods: {
    showLayer() {
      store.dispatch("selectedLayer/showLayerById", this.editId);
    },
    hideLayer() {
      store.commit("selectedLayer/hideLayer");
    },
    scrollTo() {
      store.dispatch("selectedLayer/scrollTo", this.editId);
    }
  }
};
</script>

<style module>
.info {
  margin-left: 15px;
}
</style>

<style>
.__componentEdit.ant-collapse {
  background-color: #fff;
}
.__componentEdit .ant-form-item {
  margin-bottom: 0px;
  display: flex;
}
.__componentEdit .ant-form {
  margin-bottom: 25px;
}
</style>
