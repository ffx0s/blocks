<template>
  <div :class="$style.layer">
    <div
      :class="$style.parent"
      :style="parentLayer.style"
      v-show="parentLayer.show"
    >
      <div :class="$style.actions">
        {{ parentLayer.tag }}
        <a-icon type="edit" title="编辑" @click="handleEdit(parentLayer.id)" />
        <a-icon type="copy" title="复制" @click="handleCopy(parentLayer.id)" />
        <a-icon
          type="delete"
          title="删除"
          @click="handleDelete(parentLayer.id)"
        />
        <div :class="$style.more">
          <a-icon type="ellipsis" :class="$style.moreIcon" />
          <ul :class="$style.menu">
            <li :class="$style.menuItem">
              <a-icon
                type="drag"
                title="移动组件"
                @click.stop
                @mousedown.stop="handleMousedown($event, parentLayer.id)"
              />
            </li>
          </ul>
        </div>
      </div>
    </div>

    <div
      :class="$style.single"
      :style="singleLayer.style"
      v-show="singleLayer.show"
      @click="handleEdit(singleLayer.id)"
      @mousedown.stop="handleMousedown($event, singleLayer.id)"
      @mouseleave="hideSingleLayer"
    >
      <div
        class="ant-tooltip ant-tooltip-placement-bottom"
        style="bottom:-40px;white-space: nowrap;"
        @mousemove.stop
      >
        <div class="ant-tooltip-content">
          <div class="ant-tooltip-arrow"></div>
          <div role="tooltip" class="ant-tooltip-inner">
            {{ singleLayer.tag }}
            <a-icon
              type="edit"
              title="编辑"
              @click.stop="handleEdit(singleLayer.id)"
            />
            <a-icon
              type="copy"
              title="复制"
              @click.stop="handleCopy(singleLayer.id)"
            />
            <a-icon
              type="delete"
              title="删除"
              @click.stop="handleDelete(singleLayer.id)"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// import Vue from "vue";
import store from "@/store";
import editor from "@/editor";
import { mapState } from "vuex";
import { getComponentEl, getComponentType } from "@/editor/components";

function stopPropagation(event) {
  event.stopPropagation();
}

// Vue.mixin({
//   mounted: function() {
//     const tag = this.$options._componentTag;
//     const id = this.$vnode && this.$vnode.key;
//     const type = getComponentType(this.$el);

//     if (tag && id && type) {
//       this.$once("hook:beforeDestroy", function() {});
//     }
//   }
// });

export default {
  computed: {
    ...mapState("selectedLayer", ["parentLayer", "singleLayer"])
  },
  methods: {
    hideLayer() {
      store.commit("selectedLayer/hideLayer");
    },
    hideSingleLayer() {
      store.commit("selectedLayer/hideLayer", "single");
    },
    handleDelete(id) {
      this.hideLayer();
      store.commit("component/remove", { id });
    },
    handleEdit(id) {
      store.commit("editor/setEditId", id);
    },
    handleCopy(id) {
      store.commit("component/copy", { id });
    },
    handleMousedown(event, id) {
      this.moveId = id;
      document.addEventListener("mousemove", this.handleMousemove);
      document.addEventListener("mouseup", this.handleMouseup);
      editor.canvasEl.addEventListener("mouseover", stopPropagation, true);
    },
    handleMousemove() {
      const el = getComponentEl(this.moveId);
      const type = getComponentType(el);

      store.commit("selectedLayer/setLayerProps", {
        type,
        props: {
          style: {
            pointerEvents: "none"
          }
        }
      });

      el.setAttribute("draggable", "true");
      el.addEventListener("dragstart", this.handleDragstart, { once: true });
      el.addEventListener("dragend", this.handleDragend, { once: true });
      document.removeEventListener("mousemove", this.handleMousemove);
    },
    handleMouseup() {
      const el = getComponentEl(this.moveId);
      if (el) {
        el.removeAttribute("draggable");
      }
      document.removeEventListener("mouseup", this.handleMouseup);
      document.removeEventListener("mousemove", this.handleMousemove);
      editor.canvasEl.removeEventListener("mouseover", stopPropagation, true);
    },
    handleDragstart(event) {
      event.dataTransfer.setData("moveId", this.moveId);
    },
    handleDragend(event) {
      event.dataTransfer.clearData();
      this.handleMouseup();
      this.hideLayer();
    }
  }
};
</script>

<style module>
.parent {
  pointer-events: none;
  position: absolute;
  border: 2px solid #1890ff;
  z-index: 4;
}
.actions {
  position: absolute;
  left: -2px;
  top: -27px;
  display: flex;
  align-items: center;
  padding: 1px 5px;
  font-size: 14px;
  color: #fff;
  background-color: rgba(24, 144, 255, 0.8);
  border: 2px solid #1890ff;
  border-radius: 5px 5px 0 0;
  white-space: nowrap;
  pointer-events: auto;
}
.single {
  position: absolute;
  display: flex;
  justify-content: center;
  background-color: rgba(115, 184, 255, 0.2);
  z-index: 4;
}
.actions::selection {
  background-color: transparent;
}
.layer i:first-child {
  margin-left: 4px;
}
.layer i {
  margin: 0 3px;
  cursor: pointer;
  font-size: 14px;
}

.more {
  position: relative;
  display: inline-block;
  padding-top: 4px;
  margin-bottom: -4px;
}
.menu {
  position: absolute;
  right: -7px;
  top: 22px;
  padding: 0 3px;
  display: none;
  list-style: none;
  margin: 0;
  border-radius: 0 0 4px 4px;
  background: rgba(24, 144, 255, 0.8);
}
.menuItem {
  display: inline-block;
  padding: 3px 4px;
  text-align: center;
}
.layer .menuItem i {
  margin: 0;
}
.more:hover .menu {
  display: block;
}
.moreIcon {
  position: relative;
  top: -3px;
}
</style>
