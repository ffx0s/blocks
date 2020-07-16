<template>
  <div>
    <a-input placeholder="搜索组件" v-model="searchValue">
      <a-icon slot="suffix" type="search" />
    </a-input>
    <a-card size="small" :class="$style.card" :bordered="false">
      <a-card-grid
        draggable="true"
        v-for="item in filterComponents"
        :key="item.tag"
        :class="$style.items"
        @click="addComponent(item.tag)"
        @dragstart="dragstart($event, item.tag)"
        @dragend="dragend"
      >
        <div>{{ item.name }}</div>
        <div style="font-size: 12px;color:rgba(0, 0, 0, 0.45);">
          {{ item.tag }}
        </div>
      </a-card-grid>
    </a-card>
  </div>
</template>

<script>
import { mapState } from "vuex";
import { components, create } from "@/editor/components";

export default {
  data() {
    return {
      searchValue: "",
      components: components.map(({ tag, name }) => {
        return { tag, name };
      })
    };
  },
  computed: {
    ...mapState("editor", {
      parentId: state => state.createParentId
    }),
    filterComponents() {
      const searchValue = this.searchValue;
      return searchValue
        ? this.components.filter(({ name, tag }) => {
            return (
              name.indexOf(searchValue) >= 0 || tag.indexOf(searchValue) >= 0
            );
          })
        : this.components;
    }
  },
  methods: {
    addComponent(tag) {
      const data = {
        parentId: this.parentId,
        component: create(tag)
      };

      this.$store.commit("component/add", data);

      if (this.parentId) {
        this.$store.commit("editor/setCreateParentId", "");
        this.$store.commit("editor/setTabActiveKey", "tree");
      }

      this.$message.success("添加成功");
    },
    dragstart(event, tag) {
      event.dataTransfer.setData("tag", tag);
    },
    dragend(event) {
      this.$store.commit("selectedLayer/hideLayer");
      event.dataTransfer.clearData();
    }
  }
};
</script>

<style module>
.card {
  margin-top: 10px;
}
.items {
  position: relative;
  width: 50%;
  text-align: center;
  padding: 5px;
  cursor: pointer;
  background-color: #fff;
}
.items.avtive {
  background-color: #f0f2f5;
}
</style>
