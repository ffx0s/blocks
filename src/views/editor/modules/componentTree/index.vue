<template>
  <div>
    <a-input-search
      style="margin-bottom: 4px"
      placeholder="搜索节点"
      :value="searchValue"
      @change="handleSearch"
    />
    <a-tree
      v-if="tree.length"
      showLine
      draggable
      :treeData="tree"
      :defaultExpandAll="true"
      :selectedKeys="selectedKeys"
      :expandedKeys="expandedKeys"
      :autoExpandParent="autoExpandParent"
      @expand="handleExpand"
      @drop="handleDrop"
      @select="handleSelect"
      style="margin-top:-7px"
    >
      <a-icon slot="switcherIcon" type="caret-down" />
      <template slot="item" slot-scope="{ title, key, isParentNode }">
        <span
          :id="'tree-id-' + key"
          @mouseenter="handleMouseenter(key)"
          @mouseleave="handleMouseleave"
        >
          <span v-if="title.indexOf(searchValue) > -1">
            {{ title.substr(0, title.indexOf(searchValue))
            }}<span style="color: #f50">{{ searchValue }}</span
            >{{ title.substr(title.indexOf(searchValue) + searchValue.length) }}
          </span>
          <span v-else>{{ title }}</span>

          <span class="__componentTreeBtns">
            <a-icon
              v-if="isParentNode"
              type="plus"
              title="添加子组件"
              @click.stop="hendleAdd(key)"
            />
            <a-icon type="edit" title="编辑" @click.stop="handleEdit(key)" />
            <a-icon type="copy" title="复制" @click="handleCopy(key)" />
            <a-icon
              type="delete"
              title="删除"
              @click.stop="handleDelete(key)"
            />
          </span>
        </span>
      </template>
    </a-tree>
    <a-empty v-else :image="emptyImage" description="空空如也" />
  </div>
</template>

<script>
import store from "@/store";
import { Empty } from "ant-design-vue";
import { findParent } from "@/editor/components";

function transform(component) {
  const item = {
    key: component.id,
    title: component.tag,
    children: [],
    scopedSlots: { title: "item" }
  };

  if (component.children) {
    component.children.forEach(child => {
      const childItem = transform(child);
      item.children.push(childItem);
    });
    item.isParentNode = true;
  } else {
    item.isParentNode = false;
  }

  return item;
}

export default {
  props: {
    id: {
      type: String,
      default: ""
    },
    showAll: {
      type: Boolean,
      default: true
    }
  },
  computed: {
    editId() {
      return store.state.editor.editId;
    },
    tree() {
      let tree = [];

      if (this.id) {
        const component = store.state.component.treeMap[this.id];
        if (component) {
          tree = [transform(component)];
        }
      } else if (this.showAll) {
        tree = store.state.component.tree.map(transform);
      }

      return tree;
    }
  },
  watch: {
    editId: {
      handler: function(id) {
        if (id && this.isExpandedCurrentId) {
          const [, , expandedKeys] = findParent(this.tree, id, [], {
            id: "key"
          });
          this.expandedKeys = expandedKeys;
          this.searchValue = "";
          this.selectedKeys = [id];
        } else {
          this.selectedKeys = [];
        }
        this.isExpandedCurrentId = true;
      },
      immediate: true
    }
  },
  data() {
    return {
      expandedKeys: [],
      selectedKeys: [],
      searchValue: "",
      autoExpandParent: true,
      emptyImage: Empty.PRESENTED_IMAGE_SIMPLE,
      isExpandedCurrentId: true
    };
  },
  methods: {
    handleMouseenter(id) {
      store.dispatch("selectedLayer/showLayerById", id);
    },
    handleMouseleave() {
      store.commit("selectedLayer/hideLayer");
    },
    hendleAdd(id) {
      store.commit("editor/setLeftTabActiveKey", "add");
      store.commit("editor/setCreateParentId", id);
    },
    handleEdit(id) {
      this.isExpandedCurrentId = false;
      store.commit("editor/setEditId", id);
    },
    handleCopy(id) {
      store.commit("component/copy", { id });
    },
    handleDelete(id) {
      store.commit("component/remove", { id });
    },
    handleDrop(info) {
      const dragPos = info.dragNode.pos.split("-");
      const dropPos = info.node.pos.split("-");
      const dropPosition =
        info.dropPosition - Number(dropPos[dropPos.length - 1]);

      dropPos.shift();
      dragPos.shift();

      store.commit("component/drop", {
        id: this.id,
        dragPos,
        dropPos,
        dropPosition
      });
    },
    handleSelect(ids) {
      if (ids.length) {
        store.dispatch("selectedLayer/scrollTo", ids[0]);
      }
    },
    handleSearch(event) {
      const value = event.target.value;
      const treeMap = store.state.component.treeMap;
      let expandedKeys = [];

      for (let id in treeMap) {
        const current = treeMap[id];
        if (
          current.tag.indexOf(value) > -1 &&
          expandedKeys.indexOf(id) === -1
        ) {
          const [, , idPath] = findParent(this.tree, id, [], {
            id: "key"
          });
          expandedKeys = expandedKeys.concat(idPath);
        }
      }

      expandedKeys = expandedKeys.filter(
        (item, i, self) => item && self.indexOf(item) === i
      );

      Object.assign(this, {
        expandedKeys,
        searchValue: value,
        autoExpandParent: true
      });
    },
    handleExpand(expandedKeys) {
      this.expandedKeys = expandedKeys;
      this.autoExpandParent = false;
    }
  }
};
</script>

<style>
.__componentTreeBtns {
  display: none;
}
.__componentTreeBtns .anticon {
  margin: 0 2px;
}
.__componentTreeBtns .anticon:hover {
  color: #1890ff;
}
.ant-tree-node-content-wrapper:hover .__componentTreeBtns {
  display: inline;
}
</style>
