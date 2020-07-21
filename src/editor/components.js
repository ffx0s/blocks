import shortid from "shortid";
import store from "@/store";
import { deepCopy } from "@/utils/shared";

// 创建组件数据对象
export function create(tag, componentProps, childrenComponent) {
  const { props, children } = componentsMap[tag].init(
    componentProps,
    childrenComponent
  );
  const component = {
    tag,
    props,
    id: shortid.generate()
  };
  if (children) {
    component.children = children;
  }
  return component;
}

export const components = [
  {
    tag: "a-row",
    name: "行",
    type: "parent",
    props: [
      { name: "gutter", component: "AInputNumber", initialValue: 0 },
      {
        name: "type",
        component: "ARadioGroup",
        componentProps: {
          options: [
            {
              label: "flex",
              value: "flex"
            },
            {
              label: "default",
              value: ""
            }
          ]
        }
      },
      {
        name: "align",
        component: "ARadioGroup",
        componentProps: {
          options: ["top", "middle", "bottom"]
        },
        initialValue: "top"
      },
      {
        name: "justify",
        component: "ARadioGroup",
        componentProps: {
          options: ["start", "end", "center", "space-around", "space-between"]
        },
        initialValue: "start"
      }
    ],
    init(props = {}, children = [create("v-text", { content: "row" })]) {
      return {
        props: {
          ...props
        },
        children
      };
    }
  },
  {
    tag: "a-col",
    name: "列",
    type: "parent",
    props: [
      { name: "offset", component: "AInputNumber", initialValue: 0 },
      { name: "order", component: "AInputNumber", initialValue: 0 },
      { name: "pull", component: "AInputNumber", initialValue: 0 },
      { name: "push", component: "AInputNumber", initialValue: 0 },
      { name: "span", component: "AInputNumber" }
    ],
    init(props = {}, children = [create("v-text", { content: "col" })]) {
      return {
        props: {
          span: 12,
          ...props
        },
        children
      };
    }
  },
  {
    tag: "a-menu",
    name: "导航菜单",
    type: "parent",
    childrenComponent: ["a-menu-item", "a-sub-menu"],
    props: [
      {
        name: "mode",
        component: "ARadioGroup",
        componentProps: {
          options: ["vertical", "vertical-right", "horizontal", "inline"]
        },
        initialValue: "vertical"
      },
      {
        name: "theme",
        component: "ARadioGroup",
        componentProps: {
          options: ["light", "dark"]
        },
        initialValue: "light"
      },
      { name: "multiple", component: "ASwitch", initialValue: false },
      { name: "selectable", component: "ASwitch", initialValue: true },
      {
        name: "subMenuCloseDelay",
        component: "AInputNumber",
        initialValue: 0.1
      },
      {
        name: "subMenuOpenDelay",
        component: "AInputNumber",
        initialValue: 0
      }
    ],
    init(props = {}, children = [create("a-menu-item")]) {
      return {
        props: {
          ...props
        },
        children
      };
    }
  },
  {
    tag: "a-menu-item",
    name: "导航菜单项",
    type: "parent",
    parentComponent: ["a-menu", "a-sub-menu"],
    props: [
      { name: "disabled", component: "ASwitch", initialValue: false },
      {
        name: "title",
        component: "AInput",
        componentProps: { placeholder: "设置收缩时展示的悬浮标题" }
      }
    ],
    init(props = {}, children = [create("v-text", { content: "菜单" })]) {
      return {
        props: {
          ...props
        },
        children
      };
    }
  },
  {
    tag: "a-sub-menu",
    name: "子菜单",
    type: "parent",
    parentComponent: ["a-menu"],
    childrenComponent: ["a-menu-item"],
    props: [
      {
        name: "title",
        component: "AInput",
        componentProps: { placeholder: "子菜单标题" }
      }
    ],
    init(props = {}, children = [create("a-menu-item")]) {
      return {
        props: {
          title: "子菜单",
          ...props
        },
        children
      };
    }
  },
  {
    tag: "a-layout",
    name: "布局",
    type: "parent",
    init(props = {}, children = [create("v-text", { content: "layout" })]) {
      return {
        props: {
          ...props
        },
        children
      };
    }
  },
  {
    tag: "a-layout-header",
    name: "头部",
    type: "parent",
    init(props = {}, children = []) {
      return {
        props: {
          ...props
        },
        children
      };
    }
  },
  {
    tag: "a-layout-content",
    name: "内容",
    type: "parent",
    init(props = {}, children = []) {
      return {
        props: {
          ...props
        },
        children
      };
    }
  },
  {
    tag: "a-layout-sider",
    name: "侧栏",
    type: "parent",
    init(props = {}, children = []) {
      return {
        props: {
          ...props
        },
        children
      };
    }
  },
  {
    tag: "a-layout-footer",
    name: "尾部",
    type: "parent",
    init(props = {}, children = []) {
      return {
        props: {
          ...props
        },
        children
      };
    }
  },
  {
    tag: "a-breadcrumb",
    name: "面包屑",
    type: "parent",
    childrenComponent: ["a-breadcrumb-item"],
    props: [{ name: "separator", component: "AInput", initialValue: "/" }],
    init(
      props = {},
      children = [
        create("a-breadcrumb-item", {}, [create("a-icon", { type: "home" })]),
        create("a-breadcrumb-item"),
        create("a-breadcrumb-item")
      ]
    ) {
      return {
        props: {
          ...props
        },
        children
      };
    }
  },
  {
    tag: "a-breadcrumb-item",
    name: "面包屑子项",
    type: "parent",
    parentComponent: ["a-breadcrumb"],
    props: [],
    init(
      props = {},
      children = [create("v-text", { tag: "span", content: "页面" })]
    ) {
      return {
        props: {
          ...props
        },
        children
      };
    }
  },
  {
    tag: "v-button",
    name: "按钮",
    type: "single",
    props: [
      { name: "text", component: "AInput" },
      {
        name: "type",
        component: "ARadioGroup",
        componentProps: {
          options: ["primary", "dashed", "danger", "link", "default"]
        },
        initialValue: "default"
      },
      {
        name: "size",
        component: "ARadioGroup",
        componentProps: {
          options: ["default", "small", "large"]
        },
        initialValue: "default"
      },
      {
        name: "shape",
        component: "ARadioGroup",
        componentProps: {
          options: [
            { label: "circle", value: "circle" },
            { label: "round", value: "round" },
            { label: "default", value: "" }
          ]
        }
      },
      { name: "icon", component: "AInput" },
      { name: "disabled", component: "ASwitch" },
      { name: "loading", component: "ASwitch" },
      { name: "block", component: "ASwitch" },
      { name: "ghost", component: "ASwitch" }
    ],
    init(props = {}) {
      return {
        props: {
          text: "button",
          ...props
        }
      };
    },
    parse({ props, style }) {
      const styleData = parseStyle(style);
      const text = props.text;
      props = deepCopy(props);
      delete props.text;
      const propsData = parseProps(props);
      return `<a-button ${propsData} ${styleData}>${text}</a-button>`;
    }
  },
  {
    tag: "v-text",
    name: "文字",
    type: "single",
    props: [
      {
        name: "content",
        component: "ATextarea",
        componentProps: {
          autoSize: { maxRows: 10 }
        }
      },
      {
        name: "tag",
        component: "ARadioGroup",
        componentProps: {
          options: ["p", "span", "strong", "h1"]
        },
        initialValue: "span"
      }
    ],
    init(props = {}) {
      return {
        props: {
          content: "文字",
          tag: "span",
          ...props
        }
      };
    },
    parse({ props, style }) {
      const styleData = parseStyle(style);
      return `<${props.tag} ${styleData}>${props.content}</${props.tag}>`;
    }
  },
  {
    tag: "a-tabs",
    name: "选项卡",
    type: "parent",
    childrenComponent: ["a-tab-pane"],
    props: [
      { name: "animated", component: "ASwitch", initialValue: true },
      {
        name: "size",
        component: "ARadioGroup",
        componentProps: {
          options: ["default", "small", "large"]
        },
        initialValue: "default"
      },
      {
        name: "tabPosition",
        component: "ARadioGroup",
        componentProps: {
          options: ["top", "right", "bottom", "left"]
        },
        initialValue: "top"
      },
      {
        name: "type",
        component: "ARadioGroup",
        componentProps: {
          options: ["line", "card", "editable-card"]
        },
        initialValue: "line"
      },
      { name: "tabBarGutter", component: "AInputNumber" }
    ],
    init(props = {}, children = [create("a-tab-pane")]) {
      return {
        props: {
          ...props
        },
        children
      };
    }
  },
  {
    tag: "a-tab-pane",
    name: "选项卡子项",
    type: "parent",
    parentComponent: ["a-tabs"],
    props: [{ name: "tab", component: "AInput" }],
    init(
      props = {},
      children = [create("v-text", { content: "Tab content" })]
    ) {
      return {
        props: {
          tab: "tab",
          key: shortid.generate(),
          ...props
        },
        children
      };
    }
  },
  {
    tag: "a-avatar",
    name: "头像",
    type: "single",
    props: [
      { name: "size", component: "AInputNumber" },
      { name: "icon", component: "AInput" },
      { name: "src", component: "AInput" },
      { name: "alt", component: "AInput" },
      {
        name: "shape",
        component: "ARadioGroup",
        componentProps: {
          options: ["circle", "square"]
        },
        initialValue: "circle"
      }
    ],
    init(props = {}) {
      return {
        props: {
          size: 64,
          icon: "user",
          ...props
        }
      };
    }
  },
  {
    tag: "a-icon",
    name: "图标",
    type: "single",
    props: [
      { name: "type", component: "AInput" },
      {
        name: "theme",
        component: "ARadioGroup",
        componentProps: {
          options: ["filled", "outlined", "twoTone"]
        },
        initialValue: "outlined"
      },
      { name: "spin", component: "ASwitch" },
      { name: "rotate", component: "AInputNumber" },
      { name: "twoToneColor", component: "InputColor" }
    ],
    init(props = {}) {
      return {
        props: {
          type: "sketch",
          ...props
        }
      };
    }
  },
  {
    tag: "a-input",
    name: "输入框",
    type: "single",
    props: [
      { name: "value", component: "AInput" },
      { name: "placeholder", component: "AInput" },
      { name: "disabled", component: "ASwitch" },
      { name: "allowClear", component: "ASwitch" },
      { name: "maxLength", component: "AInputNumber" },
      {
        name: "size",
        component: "ARadioGroup",
        componentProps: {
          options: ["default", "small", "large"]
        },
        initialValue: "default"
      },
      {
        name: "type",
        component: "ARadioGroup",
        componentProps: {
          options: ["text", "textarea"]
        },
        initialValue: "text"
      },
      { name: "prefix", component: "AInput" },
      { name: "suffix", component: "AInput" }
    ],
    init(props = {}) {
      return {
        props: {
          placeholder: "Basic usage",
          ...props
        }
      };
    }
  },
  {
    tag: "a-progress",
    name: "进度条",
    type: "single",
    props: [
      {
        name: "type",
        component: "ARadioGroup",
        componentProps: {
          options: ["line", "circle", "dashboard"]
        },
        initialValue: "line"
      },
      { name: "percent", component: "AInputNumber" },
      { name: "showInfo", component: "ASwitch", initialValue: true },
      {
        name: "status",
        component: "ARadioGroup",
        componentProps: {
          options: ["success", "exception", "normal", "active"]
        }
      },
      {
        name: "strokeLinecap",
        component: "ARadioGroup",
        componentProps: {
          options: ["round", "square"]
        },
        initialValue: "round"
      },
      { name: "successPercent", component: "AInputNumber" },
      { name: "strokeColor", component: "InputColor" }
    ],
    init(props = {}) {
      return {
        props: {
          ...props
        }
      };
    }
  },
  {
    tag: "a-rate",
    name: "评分",
    type: "single",
    props: [
      { name: "value", component: "AInputNumber" },
      { name: "disabled", component: "ASwitch" },
      { name: "allowClear", component: "ASwitch", initialValue: true },
      { name: "allowHalf", component: "ASwitch" },
      { name: "autoFocus", component: "ASwitch" },
      { name: "character", component: "AInput" },
      { name: "count", component: "AInputNumber", initialValue: 5 }
    ],
    init(props = {}) {
      return {
        props: {
          ...props
        }
      };
    }
  },
  {
    tag: "a-page-header",
    name: "页头",
    type: "parent",
    props: [
      { name: "title", component: "AInput" },
      { name: "subTitle", component: "AInput" },
      // { name: "backIcon", component: "AInput" },
      { name: "ghost", component: "ASwitch", initialValue: true }
    ],
    init(props = {}, children = []) {
      return {
        props: {
          title: "标题",
          subTitle: "子标题",
          ...props
        },
        children
      };
    }
  },
  {
    tag: "a-pagination",
    name: "分页",
    type: "single",
    props: [
      { name: "total", component: "AInputNumber" },
      { name: "current", component: "AInputNumber" },
      { name: "pageSize", component: "AInputNumber" },
      { name: "disabled", component: "ASwitch" },
      { name: "hideOnSinglePage", component: "ASwitch" },
      { name: "showLessItems", component: "ASwitch" },
      { name: "showQuickJumper", component: "ASwitch" },
      { name: "showSizeChanger", component: "ASwitch" },
      { name: "simple", component: "ASwitch" },
      {
        name: "size",
        component: "ARadioGroup",
        componentProps: {
          options: ["default", "small", "large"]
        },
        initialValue: "default"
      }
    ],
    init(props = {}) {
      return {
        props: {
          current: 1,
          pageSize: 10,
          total: 30,
          ...props
        }
      };
    }
  },
  {
    tag: "a-steps",
    name: "步骤条",
    type: "parent",
    childrenComponent: ["a-step"],
    props: [
      {
        name: "type",
        component: "ARadioGroup",
        componentProps: {
          options: ["default", "navigation"]
        },
        initialValue: "default"
      },
      { name: "current", component: "AInputNumber" },
      {
        name: "status",
        component: "ARadioGroup",
        componentProps: {
          options: ["wait", "process", "finish", "error"]
        },
        initialValue: "process"
      },
      {
        name: "direction",
        component: "ARadioGroup",
        componentProps: {
          options: ["horizontal", "vertical"]
        },
        initialValue: "horizontal"
      },
      {
        name: "size",
        component: "ARadioGroup",
        componentProps: {
          options: ["default", "small"]
        },
        initialValue: "default"
      },
      {
        name: "labelPlacement",
        component: "ARadioGroup",
        componentProps: {
          options: ["horizontal", "vertical"]
        },
        initialValue: "horizontal"
      }
    ],
    init(
      props = {},
      children = [
        create("a-step", { title: "Finished" }),
        create("a-step", { title: "In Progress" }),
        create("a-step", { title: "Waiting" })
      ]
    ) {
      return {
        props: {
          current: 1,
          ...props
        },
        children
      };
    }
  },
  {
    tag: "a-step",
    name: "步骤条子项",
    type: "single",
    parentComponent: ["a-steps"],
    props: [
      { name: "description", component: "AInput" },
      { name: "title", component: "AInput" },
      { name: "subTitle", component: "AInput" },
      { name: "disabled", component: "ASwitch" }
    ],
    init(props = {}) {
      return {
        props: {
          title: "步骤条子项",
          ...props
        }
      };
    }
  },
  {
    tag: "a-timeline",
    name: "时间轴",
    type: "parent",
    childrenComponent: ["a-timeline-item"],
    props: [
      { name: "pending", component: "AInput" },
      { name: "reverse", component: "ASwitch" },
      {
        name: "mode",
        component: "ARadioGroup",
        componentProps: {
          options: ["left", "alternate", "right"]
        },
        initialValue: "left"
      }
    ],
    init(
      props = {},
      children = [create("a-timeline-item"), create("a-timeline-item")]
    ) {
      return {
        props: {
          ...props
        },
        children
      };
    }
  },
  {
    tag: "a-timeline-item",
    name: "时间轴子项",
    type: "parent",
    parentComponent: ["a-timeline"],
    props: [
      {
        name: "color",
        component: "InputColor",
        initialValue: "blue"
      },
      {
        name: "position",
        component: "ARadioGroup",
        componentProps: {
          options: ["left", "right"]
        }
      }
    ],
    init(
      props = {},
      children = [
        create("v-text", {
          content: "<p>Create a services site</p><p>2015-09-01</p>"
        })
      ]
    ) {
      return {
        props: {
          ...props
        },
        children
      };
    }
  },
  {
    tag: "a-alert",
    name: "警告提示",
    type: "single",
    props: [
      {
        name: "type",
        component: "ARadioGroup",
        componentProps: {
          options: ["success", "info", "warning", "error"]
        },
        initialValue: "info"
      },
      { name: "description", component: "AInput" },
      { name: "message", component: "AInput" },
      { name: "banner", component: "ASwitch" },
      { name: "showIcon", component: "ASwitch" },
      { name: "closable", component: "ASwitch" },
      { name: "closeText", component: "AInput" }
    ],
    init(props = {}) {
      return {
        props: {
          message: "Info text",
          ...props
        }
      };
    }
  }
  // {
  //   tag: "a-affix",
  //   name: "固钉",
  //   type: "parent",
  //   props: [
  //     { name: "offsetTop", component: "AInputNumber" },
  //     { name: "offsetBottom", component: "AInputNumber" }
  //   ],
  //   init(props = {}, children = [create("v-button", { text: "a-affix" })]) {
  //     return {
  //       props: {
  //         offsetTop: 10,
  //         ...props
  //       },
  //       children
  //     };
  //   }
  // }
];

export const componentsMap = (function() {
  const map = {};
  components.forEach(component => {
    map[component.tag] = component;
  });
  return map;
})();

export const COMPONENT_ID_PROP = "data-component-id";
export const COMPONENT_TYPE_PROP = "data-component-type";

export function getComponentEl(id) {
  return document.querySelector(`[${COMPONENT_ID_PROP}='${id}']`);
}

export function getComponentId(el) {
  return el.getAttribute && el.getAttribute(COMPONENT_ID_PROP);
}

export function getComponentType(el) {
  return el.getAttribute && el.getAttribute(COMPONENT_TYPE_PROP);
}

export function getComponentData(el) {
  const id = getComponentId(el);
  if (id) {
    return store.state.component.treeMap[id];
  }
}

export function isParentComponent(tag) {
  return componentsMap[tag] && componentsMap[tag].type === "parent";
}

export function isSingleComponent(tag) {
  return componentsMap[tag] && componentsMap[tag].type === "single";
}

export function noWrap(tag) {
  return (
    componentsMap[tag] &&
    componentsMap[tag].parentComponent &&
    componentsMap[tag].parentComponent.length
  );
}

function parseStyle(style = {}) {
  const styleString = JSON.stringify(style);
  const styleData = styleString === "{}" ? "" : `:style='${styleString}'`;
  return styleData;
}

function parseProps(props = {}) {
  const propsData = Object.keys(props)
    .map(key => {
      let value = props[key];
      let prefix = "";
      let symbol = '"';
      if (typeof value !== "string") {
        prefix = ":";
        if (typeof value === "object") {
          value = JSON.stringify(value);
          symbol = "'";
        }
      }
      return `${prefix}${key}=${symbol}${value}${symbol}`;
    })
    .join(" ");

  return propsData;
}

export function parseComponent(component) {
  const { children, tag, props, style } = component;

  if (componentsMap[tag].parse) {
    return componentsMap[tag].parse(component);
  }

  let content = "";

  if (children) {
    content = children.map(parseComponent).join("");
  }

  const propsData = parseProps(props);
  const styleData = parseStyle(style);

  return `<${tag} ${propsData} ${styleData}>${content}</${tag}>`;
}
