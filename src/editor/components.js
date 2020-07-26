import shortid from "shortid";
import store from "@/store";
import { deepCopy } from "@/utils/shared";

// 创建组件数据对象
export function create(tag, data = {}, children) {
  const isParent = isParentComponent(tag);
  const [defaultData, defaultChildren] = componentsMap[tag].default
    ? componentsMap[tag].default()
    : isParent
    ? [{}, []]
    : [{}];
  const component = {
    tag,
    id: shortid.generate(),
    props: { ...defaultData.props, ...data.props },
    style: { ...defaultData.style, ...data.style }
  };
  if (isParent) {
    component.children = children || defaultChildren;
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
    default: () => [
      {
        props: { type: "flex" },
        style: { height: "50px", "background-color": "#e7e7e7" }
      },
      [create("a-col"), create("a-col")]
    ]
  },
  {
    tag: "a-col",
    name: "列",
    type: "parent",
    props: [
      {
        name: "flex",
        component: "AInput",
        componentProps: { placeholder: "1 / 100px / 1 1 auto" }
      },
      { name: "offset", component: "AInputNumber", initialValue: 0 },
      { name: "order", component: "AInputNumber", initialValue: 0 },
      { name: "pull", component: "AInputNumber", initialValue: 0 },
      { name: "push", component: "AInputNumber", initialValue: 0 },
      { name: "span", component: "AInputNumber" }
    ],
    default: () => [{ props: { flex: "1" } }, []]
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
    default: () => [{}, [create("a-menu-item"), create("a-menu-item")]]
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
    default: () => [{}, [create("v-text", { props: { content: "菜单" } })]]
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
    default: () => [{ props: { title: "子菜单" } }, [create("a-menu-item")]]
  },
  {
    tag: "a-layout",
    name: "布局",
    type: "parent",
    default: () => [{}, [create("v-text", { props: { content: "layout" } })]]
  },
  {
    tag: "a-layout-header",
    name: "头部",
    type: "parent"
  },
  {
    tag: "a-layout-content",
    name: "内容",
    type: "parent"
  },
  {
    tag: "a-layout-sider",
    name: "侧栏",
    type: "parent"
  },
  {
    tag: "a-layout-footer",
    name: "尾部",
    type: "parent"
  },
  {
    tag: "a-breadcrumb",
    name: "面包屑",
    type: "parent",
    childrenComponent: ["a-breadcrumb-item"],
    props: [{ name: "separator", component: "AInput", initialValue: "/" }],
    default: () => [
      {},
      [
        create("a-breadcrumb-item", {}, [
          create("a-icon", { props: { type: "home" } })
        ]),
        create("a-breadcrumb-item"),
        create("a-breadcrumb-item")
      ]
    ]
  },
  {
    tag: "a-breadcrumb-item",
    name: "面包屑子项",
    type: "parent",
    parentComponent: ["a-breadcrumb"],
    props: [],
    default: () => [
      {},
      [create("v-text", { props: { tag: "span", content: "页面" } })]
    ]
  },
  {
    tag: "v-button",
    name: "按钮",
    type: "single",
    props: [
      { name: "text", component: "AInput" },
      {
        name: "type",
        component: "ASelect",
        componentProps: {
          options: [
            "primary",
            "dashed",
            "danger",
            "link",
            "default"
          ].map(v => ({ label: v, value: v }))
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
    default: () => [{ props: { text: "button" } }],
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
        component: "ASelect",
        componentProps: {
          style: { width: "80px" },
          options: [
            { value: "div", label: "div" },
            { value: "span", label: "span" },
            { value: "strong", label: "strong" },
            { value: "p", label: "p" },
            { value: "h1", label: "h1" },
            { value: "h2", label: "h2" },
            { value: "h3", label: "h3" },
            { value: "h4", label: "h4" }
          ]
        },
        initialValue: "span"
      }
    ],
    default: () => [{ props: { content: "文字", tag: "span" } }],
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
    default: () => [{}, [create("a-tab-pane")]]
  },
  {
    tag: "a-tab-pane",
    name: "选项卡子项",
    type: "parent",
    parentComponent: ["a-tabs"],
    props: [
      { name: "tab", component: "AInput" },
      { name: "key", component: "AInput" }
    ],
    default: () => [
      { props: { tab: "tab", key: shortid.generate() } },
      [create("v-text", { props: { content: "Tab content" } })]
    ]
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
    default: () => [{ props: { size: 64, icon: "user" } }]
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
    default: () => [{ props: { type: "sketch" } }]
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
          options: ["text", "textarea", "password"]
        },
        initialValue: "text"
      },
      { name: "prefix", component: "AInput" },
      { name: "suffix", component: "AInput" }
    ],
    default: () => [{ props: { placeholder: "Basic usage" } }]
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
    ]
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
    ]
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
    default: () => [{ props: { title: "标题", subTitle: "子标题" } }, []]
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
    default: () => [{ props: { current: 1, pageSize: 10, total: 30 } }]
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
    default: () => [
      { props: { current: 1 } },
      [
        create("a-step", { props: { title: "Finished" } }),
        create("a-step", { props: { title: "In Progress" } }),
        create("a-step", { props: { title: "Waiting" } })
      ]
    ]
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
    default: () => [{ props: { title: "步骤条子项" } }]
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
    default: () => [{}, [create("a-timeline-item"), create("a-timeline-item")]]
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
    default: () => [
      {},
      [
        create("v-text", {
          props: {
            content: "<p>Create a services site</p><p>2015-09-01</p>"
          }
        })
      ]
    ]
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
    default: () => [{ props: { message: "Info text" } }]
  },
  {
    tag: "a-carousel",
    name: "走马灯",
    type: "parent",
    props: [
      { name: "autoplay", component: "ASwitch" },
      { name: "dots", component: "ASwitch", initialValue: true },
      {
        name: "dotPosition",
        component: "ARadioGroup",
        componentProps: {
          options: ["top", "bottom", "left", "right"]
        },
        initialValue: "bottom"
      },
      {
        name: "effect",
        component: "ARadioGroup",
        componentProps: {
          options: ["scrollx", "fade"]
        },
        initialValue: "scrollx"
      }
    ],
    default: () => [
      {},
      ["1", "2", "3"].map(i =>
        create("v-text", {
          props: { tag: "div", content: i },
          style: { height: "250px", "background-color": "pink" }
        })
      )
    ]
  },
  {
    tag: "a-collapse",
    name: "折叠面板",
    type: "parent",
    childrenComponent: ["a-collapse-panel"],
    props: [
      { name: "bordered", component: "ASwitch", initialValue: true },
      { name: "accordion", component: "ASwitch" },
      {
        name: "expandIconPosition",
        component: "ARadioGroup",
        componentProps: {
          options: ["left", "right"]
        },
        initialValue: "left"
      },
      { name: "destroyInactivePanel", component: "ASwitch" }
    ],
    default: () => [
      {},
      [create("a-collapse-panel"), create("a-collapse-panel")]
    ]
  },
  {
    tag: "a-collapse-panel",
    name: "折叠面板子项",
    type: "parent",
    parentComponent: ["a-collapse"],
    props: [
      { name: "disabled", component: "ASwitch" },
      { name: "header", component: "AInput" },
      { name: "key", component: "AInput" },
      { name: "forceRender", component: "ASwitch" },
      { name: "showArrow", component: "ASwitch", initialValue: true }
    ],
    default: () => [
      { props: { header: "header", key: shortid.generate() } },
      [create("v-text", { props: { content: "Collapse content" } })]
    ]
  },
  {
    tag: "a-descriptions",
    name: "描述列表",
    type: "parent",
    childrenComponent: ["a-descriptions-item"],
    props: [
      { name: "title", component: "AInput" },
      { name: "bordered", component: "ASwitch" },
      { name: "column", component: "AInputNumber", initialValue: 3 },
      {
        name: "size",
        component: "ARadioGroup",
        componentProps: {
          options: ["default", "middle", "small"]
        },
        initialValue: "default"
      },
      {
        name: "layout",
        component: "ARadioGroup",
        componentProps: {
          options: ["horizontal", "vertical"]
        },
        initialValue: "horizontal"
      },
      { name: "colon", component: "ASwitch" }
    ],
    default: () => [
      { props: { title: "User Info" } },
      [
        ["Product", "Cloud Database"],
        ["Billing", "Prepaid"],
        ["Time", "18:00:00"],
        ["Amount", "$80.00"],
        ["Discount", "$20.00"],
        ["Official", "$60.00"]
      ].map(([label, content]) =>
        create("a-descriptions-item", { props: { label } }, [
          create("v-text", { props: { content } })
        ])
      )
    ]
  },
  {
    tag: "a-descriptions-item",
    name: "描述列表子项",
    type: "parent",
    parentComponent: ["a-descriptions"],
    props: [
      { name: "label", component: "AInput" },
      { name: "span", component: "AInputNumber", initialValue: 1 }
    ],
    default: () => [{ props: { label: "label" } }, [create("v-text")]]
  },
  {
    tag: "a-statistic",
    name: "统计数值",
    type: "single",
    props: [
      { name: "title", component: "AInput" },
      { name: "value", component: "AInputNumber" },
      { name: "precision", component: "AInputNumber" },
      { name: "decimalSeparator", component: "AInput", initialValue: "." },
      { name: "groupSeparator", component: "AInput", initialValue: "," },
      { name: "prefix", component: "AInput" },
      { name: "suffix", component: "AInput" }
    ],
    default: () => [{ props: { title: "Active Users", value: "119988" } }]
  },
  {
    tag: "a-statistic-countdown",
    name: "倒计时",
    type: "single",
    props: [
      { name: "title", component: "AInput" },
      { name: "value", component: "AInputNumber" },
      { name: "format", component: "AInput", initialValue: "HH:mm:ss" },
      { name: "prefix", component: "AInput" },
      { name: "suffix", component: "AInput" }
    ],
    default: () => [
      {
        props: {
          title: "Countdown",
          value: Date.now() + 1000 * 60 * 60 * 24 * 2 + 1000 * 30
        }
      }
    ]
  },
  {
    tag: "a-badge",
    name: "徽标数",
    type: "parent",
    props: [
      { name: "count", component: "AInputNumber" },
      { name: "color", component: "InputColor" },
      {
        name: "status",
        component: "ASelect",
        componentProps: {
          style: { width: "100px" },
          options: [
            "success",
            "processing",
            "default",
            "error",
            "warning",
            "normal"
          ].map(v => ({ label: v, value: v === "normal" ? "" : v }))
        },
        initialValue: "normal"
      },
      { name: "text", component: "AInput" },
      { name: "title", component: "AInput" },
      { name: "dot", component: "ASwitch" },
      { name: "overflowCount", component: "AInputNumber", initialValue: 99 },
      { name: "showZero", component: "ASwitch" }
    ],
    default: () => [{ props: { count: 8 } }, []]
  },
  {
    tag: "a-tag",
    name: "标签",
    type: "parent",
    props: [
      { name: "closable", component: "ASwitch" },
      { name: "color", component: "InputColor" }
    ],
    default: () => [{}, [create("v-text")]]
  }
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

export function findParent(tree, id, idPath = [], props = { id: "id" }) {
  for (let i = 0; i < tree.length; i++) {
    const current = tree[i];
    const newPath = idPath.concat();

    newPath.push(current[props.id]);

    if (current[props.id] === id) {
      return [newPath[newPath.length - 2], i, newPath];
    }

    if (current.children) {
      const result = findParent(current.children, id, newPath, props);
      if (result) {
        return result;
      }
    }
  }
}
