<template>
  <a-form v-show="formItems.length" :form="form">
    <a-form-item :label="item.name" v-for="item in formItems" :key="item.name">
      <component
        size="small"
        v-bind="item.componentProps"
        :is="item.component"
        v-decorator="item.decorator"
      />
    </a-form-item>
  </a-form>
</template>

<script>
import { mapState, mapGetters } from "vuex";
import { componentsMap } from "@/editor/components";
import { deepCopy } from "@/utils/shared";
import store from "@/store";

function isEmptyString(value) {
  return typeof value === "string" && !value.trim();
}

export default {
  computed: {
    ...mapState("editor", ["editId"]),
    ...mapGetters("editor", ["editingComponent"])
  },
  data() {
    return {
      formItems: []
    };
  },
  watch: {
    editId: {
      handler: function(id) {
        if (id) {
          this.formItems = [];

          const { tag, props } = this.editingComponent;
          const defaultProps = componentsMap[tag].props;

          if (Array.isArray(defaultProps)) {
            const formItems = [];

            defaultProps.forEach(
              ({ name, component, componentProps, initialValue }) => {
                const item = {
                  name,
                  component,
                  componentProps: componentProps && deepCopy(componentProps),
                  decorator: [
                    name,
                    {
                      initialValue: props.hasOwnProperty(name)
                        ? props[name]
                        : initialValue
                    }
                  ]
                };
                if (component === "ASwitch") {
                  item.decorator[1].valuePropName = "checked";
                }
                formItems.push(item);
              }
            );

            this.$nextTick(() => {
              this.formItems = formItems;
            });
          }
        }
      },
      immediate: true
    }
  },
  beforeCreate() {
    this.form = this.$form.createForm(this, {
      name: "propEdit",
      onValuesChange: (props, values) => {
        Object.keys(values).forEach(prop => {
          const value = values[prop];
          let action = "setProp";
          if (value === null || isEmptyString(value)) {
            action = "deleteProp";
          }
          store.commit("component/" + action, {
            id: this.editId,
            targetName: "props",
            prop,
            value
          });
        });
      }
    });
  }
};
</script>

<style></style>
