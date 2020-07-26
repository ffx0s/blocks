<template>
  <DraggableResizable
    :class="$style.left"
    :position="position"
    :handles="['mr']"
    :draggable="false"
    :minWidth="minWidth"
    :styleObj="{ height: null, transform: null }"
    @resizing="resizing"
    @resizestop="resizestop"
  >
    <a-tabs
      class="__leftSideTabs"
      @tabClick="togglePane"
      v-model="activeKey"
      tabPosition="left"
      :animated="false"
    >
      <a-tab-pane v-for="item in tabs" :key="item.key">
        <span slot="tab">
          <component
            :title="item.title"
            :is="item.icon ? 'a-icon' : 'my-icon'"
            style="font-size:16px"
            :type="item.icon || item.myIcon"
          />
        </span>
        <div :class="['v-custom-scrollbar', $style.scroll]">
          <component :is="item.component" />
        </div>
      </a-tab-pane>
    </a-tabs>
  </DraggableResizable>
</template>

<script>
import DraggableResizable from "@/components/dragResizable";
import ComponentAdd from "../componentAdd";
import ComponentTree from "../componentTree";
import { mapState } from "vuex";

const defaultWidth = 250;
const minWidth = 35;

export default {
  components: {
    DraggableResizable,
    ComponentAdd,
    ComponentTree
  },
  data() {
    return {
      tabs: [
        {
          title: "添加组件",
          icon: "file-add",
          key: "add",
          component: "ComponentAdd"
        },
        {
          title: "组件树",
          myIcon: "icon-jiegou",
          key: "tree",
          component: "ComponentTree"
        }
      ],
      minWidth,
      position: {
        w: defaultWidth
      }
    };
  },
  computed: {
    ...mapState("editor", ["leftTab"]),
    activeKey: {
      get() {
        return this.leftTab.activeKey;
      },
      set(value) {
        this.$store.commit("editor/setLeftTabActiveKey", value);
      }
    }
  },
  watch: {
    "leftTab.isFold": {
      handler: function(isFold) {
        const width = this.position.w;

        if (isFold) {
          this.position.w = this.minWidth;
        } else if (this._lastWidth) {
          this.position.w = this._lastWidth;
        }
        this._lastWidth = Math.max(width, defaultWidth);
      },
      immediate: true
    }
  },
  methods: {
    togglePane(key) {
      if (this.activeKey === key) {
        this.$store.commit("editor/setLeftTabActiveKey", "");
      }
    },
    resizing({ w }) {
      // 当 key 没有值并且宽度大于 minWidth 时 展开第一个 tab
      if (!this.activeKey && w > this.minWidth) {
        this._lastWidth = null;
        this.$store.commit("editor/setLeftTabActiveKey", "add");
      }
    },
    resizestop({ w }) {
      // 当宽度小于 minWidth 时收起 tab
      if (w < this.minWidth + 60) {
        this.$store.commit("editor/setLeftTabActiveKey", "");
      }
    }
  }
};
</script>

<style module>
.scroll {
  position: absolute;
  top: 0;
  bottom: 10px;
  left: 37px;
  right: 0;
  padding: 10px;
  overflow: auto;
}
.left {
  margin-right: var(--margin);
  width: 250px;
}
</style>

<style>
.__leftSideTabs {
  height: 100%;
}
.__leftSideTabs .ant-tabs-left-bar .ant-tabs-tab {
  padding: 8px 9px;
}
.__leftSideTabs .ant-tabs-tab .anticon {
  margin-right: 2px;
}
</style>
