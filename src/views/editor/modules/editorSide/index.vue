<template>
  <a-tabs class="__rightTabs" v-model="tabActiveKey" :animated="false">
    <a-tab-pane key="add">
      <span slot="tab">
        <a-icon type="plus" />
        添加
      </span>
      <div :class="['v-custom-scrollbar', $style.scroll]">
        <ComponentAdd />
      </div>
    </a-tab-pane>
    <a-tab-pane key="edit">
      <span slot="tab">
        <a-icon type="edit" />
        编辑
      </span>
      <div :class="['v-custom-scrollbar', $style.scroll]">
        <ComponentEdit />
      </div>
    </a-tab-pane>
    <a-tab-pane key="tree">
      <span slot="tab">
        <my-icon type="icon-jiegou" />
        组件树
      </span>
      <div :class="['v-custom-scrollbar', $style.scroll]">
        <ComponentTree showAll />
      </div>
    </a-tab-pane>
  </a-tabs>
</template>

<script>
import ComponentAdd from "../componentAdd";
import ComponentEdit from "../componentEdit";
import ComponentTree from "../componentTree";

export default {
  components: {
    ComponentAdd,
    ComponentEdit,
    ComponentTree
  },
  computed: {
    tabActiveKey: {
      get: function() {
        return this.$store.state.editor.tabActiveKey;
      },
      set: function(value) {
        this.$store.commit("editor/setTabActiveKey", value);
      }
    }
  }
};
</script>

<style module>
.scroll {
  position: absolute;
  top: 48px;
  right: 0;
  bottom: 10px;
  left: 0;
  width: 100%;
  padding: 10px;
  overflow: auto;
}
</style>

<style>
.__rightTabs {
  height: 100%;
}
.__rightTabs .ant-tabs-nav {
  width: 100%;
}
.__rightTabs .ant-tabs-nav > div {
  display: flex;
}
.__rightTabs .ant-tabs-tab {
  flex: 1;
  text-align: center;
  margin: 0;
}
</style>
