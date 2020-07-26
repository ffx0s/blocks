<template>
  <DraggableResizable
    :class="$style.right"
    :position="position"
    :handles="['ml']"
    :draggable="false"
    :minWidth="minWidth"
    :styleObj="{ height: null, transform: null }"
  >
    <a-tabs class="__rightSideTabs" v-model="activeKey" :animated="false">
      <a-tab-pane key="edit">
        <span slot="tab">
          <a-icon type="edit" />
          编辑
        </span>
        <div :class="['v-custom-scrollbar', $style.scroll]">
          <ComponentEdit />
        </div>
      </a-tab-pane>
    </a-tabs>
  </DraggableResizable>
</template>

<script>
import DraggableResizable from "@/components/dragResizable";
import ComponentEdit from "../componentEdit";

const defaultWidth = 320;

export default {
  components: {
    DraggableResizable,
    ComponentEdit
  },
  computed: {
    activeKey: {
      get() {
        return this.$store.state.editor.rightTabActiveKey;
      },
      set(value) {
        this.$store.commit("editor/setRightTabActiveKey", value);
      }
    }
  },
  data() {
    return {
      minWidth: defaultWidth,
      position: {
        w: defaultWidth
      }
    };
  }
};
</script>

<style module>
.right {
  margin-left: var(--margin);
  width: 320px;
}
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
.__rightSideTabs {
  height: 100%;
}
.__rightSideTabs .ant-tabs-nav {
  width: 100%;
}
.__rightSideTabs .ant-tabs-nav > div {
  display: flex;
}
.__rightSideTabs .ant-tabs-tab {
  flex: 1;
  text-align: center;
  margin: 0;
}
</style>
