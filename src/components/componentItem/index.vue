<script>
import {
  noWrap,
  componentsMap,
  COMPONENT_ID_PROP,
  COMPONENT_TYPE_PROP
} from "@/editor/components";

function getAttrs(component) {
  return {
    [COMPONENT_ID_PROP]: component.id,
    [COMPONENT_TYPE_PROP]: componentsMap[component.tag].type
  };
}

export default {
  props: {
    component: {
      type: Object,
      required: true
    }
  },
  render() {
    const component = this.component;

    function renderChildren(children = []) {
      return children.map(child => {
        if (noWrap(child.tag)) {
          const attrs = getAttrs(child);
          return (
            <child.tag {...{ attrs }} key={child.id} {...child}>
              {renderChildren(child.children)}
            </child.tag>
          );
        }
        return <ComponentItem component={child} />;
      });
    }

    const children = renderChildren(component.children);
    const attrs = getAttrs(component);

    return (
      <component.tag {...{ attrs }} key={component.id} {...component}>
        {children}
      </component.tag>
    );
  },
  renderError(h, err) {
    return h("pre", { style: { color: "red" } }, err.stack);
  }
};
</script>

<style></style>
