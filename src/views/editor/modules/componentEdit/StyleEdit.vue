<template>
  <div>
    <a-form
      v-show="formItems.length"
      :form="form"
      :label-col="{ span: 7 }"
      :wrapper-col="{ span: 17 }"
    >
      <a-form-item
        v-for="item in formItems"
        :key="item.fieldName"
        :class="$style.formItem"
      >
        <span slot="label">
          <a-icon
            :class="$style.deleteBtn"
            theme="twoTone"
            type="delete"
            title="删除"
            @click="handleDeleteStyle(item)"
          />
          {{ item.label }}
        </span>
        <component
          size="small"
          :is="item.component"
          v-decorator="[item.fieldName, { initialValue: item.initialValue }]"
          v-bind="item.componentProps"
        />
      </a-form-item>
    </a-form>
    <a-auto-complete
      :dropdownMatchSelectWidth="false"
      placeholder="输入需要添加的 CSS 样式"
      optionLabelProp="value"
      @select="handleSelect"
      @search="handleSearch"
      v-model="searchValue"
      style="width:100%"
    >
      <template slot="dataSource">
        <a-select-option
          v-for="item in dataSource"
          :key="item.prop"
          :text="item.prop"
        >
          <div :class="$style.option">
            {{ item.name }}
            <span :class="$style.prop">{{ item.prop }}</span>
          </div>
        </a-select-option>
      </template>
    </a-auto-complete>
  </div>
</template>

<script>
import { mapState, mapGetters } from "vuex";
import store from "@/store";
import InputNumber from "@/components/formInput/InputNumber";
import InputBorder from "@/components/formInput/InputBorder";
import InputColor from "@/components/formInput/InputColor";
import { deepCopy, camelCaseToLine } from "@/utils/shared";

const styleProps = [
  { name: "宽度", prop: "width", component: "InputNumber" },
  { name: "高度", prop: "height", component: "InputNumber" },
  { name: "外边距", prop: "margin", component: "InputNumber" },
  { name: "左外边距", prop: "margin-left", component: "InputNumber" },
  { name: "右外边距", prop: "margin-right", component: "InputNumber" },
  { name: "上外边距", prop: "margin-top", component: "InputNumber" },
  { name: "下外边距", prop: "margin-bottom", component: "InputNumber" },
  { name: "内边距", prop: "padding", component: "InputNumber" },
  { name: "左内边距", prop: "padding-left", component: "InputNumber" },
  { name: "右内边距", prop: "padding-right", component: "InputNumber" },
  { name: "上内边距", prop: "padding-top", component: "InputNumber" },
  { name: "下内边距", prop: "padding-bottom", component: "InputNumber" },
  { name: "字体大小", prop: "font-size", component: "InputNumber" },
  { name: "字体颜色", prop: "color", component: "InputColor" },
  { name: "背景颜色", prop: "background-color", component: "InputColor" },
  // { name: "背景图", prop: "background-image" },
  { name: "边框", prop: "border", component: "InputBorder" },
  { name: "左边框", prop: "border-left", component: "InputBorder" },
  { name: "右边框", prop: "border-right", component: "InputBorder" },
  { name: "上边框", prop: "border-top", component: "InputBorder" },
  { name: "下边框", prop: "border-bottom", component: "InputBorder" },
  { name: "圆角", prop: "border-radius", component: "InputNumber" },
  {
    name: "左上圆角",
    prop: "border-top-left-radius",
    component: "InputNumber"
  },
  {
    name: "左下圆角",
    prop: "border-bottom-left-radius",
    component: "InputNumber"
  },
  {
    name: "右上圆角",
    prop: "border-top-right-radius",
    component: "InputNumber"
  },
  {
    name: "右下圆角",
    prop: "border-bottom-right-radius",
    component: "InputNumber"
  },
  {
    name: "定位",
    prop: "position",
    component: "ASelect",
    componentProps: {
      options: [
        "relative",
        "absolute",
        "fixed",
        "static",
        "sticky",
        "inherit",
        "initial"
      ].map(v => ({
        label: v,
        value: v
      }))
    }
  },
  { name: "top", prop: "top", component: "InputNumber" },
  { name: "right", prop: "right", component: "InputNumber" },
  { name: "bottom", prop: "bottom", component: "InputNumber" },
  { name: "left", prop: "left", component: "InputNumber" },
  {
    name: "overflow",
    prop: "overflow",
    component: "ASelect",
    componentProps: {
      options: [
        "auto",
        "hidden",
        "scroll",
        "visible",
        "inherit",
        "initial"
      ].map(v => ({
        label: v,
        value: v
      }))
    }
  },
  {
    name: "行高",
    prop: "line-height",
    component: "InputNumber"
  }
];

const stylePropsMap = (function() {
  const map = {};
  styleProps.forEach(item => {
    map[item.prop] = item;
  });
  return map;
})();

export default {
  components: {
    InputNumber,
    InputBorder,
    InputColor
  },
  provide() {
    return {
      form: this.form
    };
  },
  computed: {
    ...mapState("editor", ["editId"]),
    ...mapGetters("editor", ["editingComponent"])
  },
  data() {
    return {
      formItems: [],
      dataSource: [],
      searchValue: ""
    };
  },
  watch: {
    editId: {
      handler: function(id) {
        if (id) {
          this.formItems = [];

          const formItems = [];
          const style = this.editingComponent.style;

          if (style) {
            Object.keys(style).map(styleProp => {
              this.addFormItem(formItems, styleProp, style[styleProp]);
            });
          }

          this.$nextTick(() => {
            this.formItems = formItems;
          });
        }
      },
      immediate: true
    }
  },
  beforeCreate() {
    this.form = this.$form.createForm(this, {
      name: "styleEdit",
      onValuesChange: (props, values) => {
        Object.keys(values).forEach(prop => {
          store.commit("component/setProp", {
            prop,
            value: values[prop],
            id: this.editId,
            targetName: "style"
          });
        });
      }
    });
  },
  methods: {
    handleSelect(styleProp) {
      const style = this.editingComponent.style || {};

      if (style.hasOwnProperty(styleProp)) {
        this.$notification.warning({
          message: "样式已存在"
        });
      } else {
        store.commit("component/setProp", {
          id: this.editId,
          targetName: "style",
          prop: styleProp,
          value: ""
        });

        this.addFormItem(this.formItems, styleProp, style[styleProp]);
      }

      this.searchValue = "";
      this.dataSource = [];
    },
    handleSearch(value) {
      this.dataSource = value ? this.searchResult(value) : [];
    },
    searchResult(query) {
      return styleProps.filter(item => {
        return item.name.indexOf(query) >= 0 || item.prop.indexOf(query) >= 0;
      });
    },
    handleDeleteStyle(item) {
      store.commit("component/deleteProp", {
        id: this.editId,
        targetName: "style",
        prop: item.fieldName
      });
      this.removeFormItem(item.fieldName);
    },
    createFormItem(styleProp, initialValue) {
      const value = stylePropsMap[camelCaseToLine(styleProp)];
      if (value) {
        return {
          label: value.name, // 属性名，例：宽度...
          fieldName: styleProp, // 字段名，例：width...
          component: value.component, // 组件名，例：inputNumber...
          componentProps:
            value.componentProps && deepCopy(value.componentProps), // 组件属性
          initialValue: initialValue || "" // 对应样式属性的值，例：100px
        };
      }
    },
    addFormItem(formItems, styleProp, initialValue) {
      const item = this.createFormItem(styleProp, initialValue);
      item && formItems.push(item);
    },
    removeFormItem(styleProp) {
      this.formItems.find((item, index) => {
        if (item.fieldName === styleProp) {
          this.formItems.splice(index, 1);
          return true;
        }
      });
    }
  }
};
</script>

<style module>
.option {
  display: flex;
  justify-content: space-between;
}
.prop {
  margin-left: 5px;
  font-size: 12px;
  color: #999;
}
.deleteBtn {
  visibility: hidden;
  transition: 0.3s;
  opacity: 0;
}
.formItem:hover .deleteBtn {
  visibility: visible;
  opacity: 1;
}
</style>
