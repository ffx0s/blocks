export default [
  {
    tag: "a-layout",
    props: {},
    id: "t_EwM5xWHb",
    children: [
      {
        tag: "a-layout-sider",
        props: {},
        id: "-nHTcYCng",
        children: [
          {
            tag: "a-menu",
            props: { mode: "inline", theme: "dark", selectable: true },
            id: "54DxZyWhBa",
            children: [
              {
                tag: "a-sub-menu",
                props: { title: "子菜单" },
                id: "w4EzgGBibI",
                children: [
                  {
                    tag: "a-menu-item",
                    props: {},
                    id: "i_HE9U_mpn",
                    children: [
                      {
                        tag: "a-icon",
                        props: { type: "sketch" },
                        id: "kQYRTD7bW"
                      },
                      {
                        tag: "v-text",
                        props: { content: "菜单", tag: "span" },
                        id: "BBTRB4Cq2q"
                      }
                    ]
                  },
                  {
                    tag: "a-menu-item",
                    props: {},
                    id: "oua5qM2Pr",
                    children: [
                      {
                        tag: "v-text",
                        props: { content: "菜单", tag: "span" },
                        id: "PMT7QiD2gl"
                      }
                    ]
                  }
                ],
                style: {}
              },
              {
                tag: "a-menu-item",
                props: { disabled: true },
                id: "ykM1d3_isS",
                children: [
                  { tag: "a-icon", props: { type: "user" }, id: "B9pfyn7aF" },
                  {
                    tag: "v-text",
                    props: { content: "菜单", tag: "span" },
                    id: "M49J0o68J"
                  }
                ]
              },
              {
                tag: "a-menu-item",
                props: {},
                id: "GIAWYLKbf",
                children: [
                  { tag: "a-icon", props: { type: "sketch" }, id: "Mda1_KmnW" },
                  {
                    tag: "v-text",
                    props: { content: "菜单", tag: "span" },
                    id: "euQuNHsqLm"
                  }
                ]
              },
              {
                tag: "a-menu-item",
                props: {},
                id: "ERHrlrkVYf",
                children: [
                  {
                    tag: "v-text",
                    props: { content: "菜单", tag: "span" },
                    id: "9U7mKhePMY"
                  }
                ]
              },
              {
                tag: "a-menu-item",
                props: { disabled: false },
                id: "rFxkukB7o",
                children: [
                  {
                    tag: "v-text",
                    props: { content: "home", tag: "span" },
                    id: "aRqj-yaQOd"
                  }
                ]
              },
              {
                tag: "a-menu-item",
                props: {},
                id: "LhN-EAJlD",
                children: [
                  {
                    tag: "v-text",
                    props: { content: "菜单", tag: "span" },
                    id: "Gj1IpZWtJc"
                  }
                ]
              },
              {
                tag: "a-menu-item",
                props: {},
                id: "8ZY6-Bwh1",
                children: [
                  {
                    tag: "v-text",
                    props: { content: "菜单", tag: "span" },
                    id: "9gYLX_jtrG"
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        tag: "a-layout",
        props: {},
        id: "ql08xE0ZL3",
        children: [
          {
            tag: "a-layout-header",
            props: {},
            id: "WYfgcWXbg",
            children: [
              {
                tag: "a-row",
                props: { type: "flex" },
                id: "GRXniXRKXI",
                children: [
                  {
                    tag: "a-col",
                    props: { span: 12 },
                    id: "7WN6QahDh",
                    children: [
                      {
                        tag: "a-avatar",
                        props: { size: 48, icon: "user" },
                        id: "-NNfbV3s9"
                      }
                    ]
                  },
                  {
                    tag: "a-col",
                    props: { span: 12 },
                    id: "f28EPz3yEQ",
                    children: [
                      {
                        tag: "a-input",
                        props: {
                          placeholder: "搜索",
                          size: "default",
                          allowClear: false,
                          disabled: false
                        },
                        id: "eJHgZyt8S"
                      }
                    ]
                  }
                ]
              }
            ]
          },
          {
            tag: "a-layout-content",
            props: {},
            id: "UDoH0jZ_u",
            children: [
              {
                tag: "a-page-header",
                props: {
                  ghost: false,
                  title: "测试",
                  subTitle: "这是默认的测试数据"
                },
                id: "HkL_TLIJI",
                children: [
                  {
                    tag: "a-breadcrumb",
                    props: {},
                    id: "9MNAHGMoGV",
                    children: [
                      {
                        tag: "a-breadcrumb-item",
                        props: {},
                        id: "VEj9rcP-5A",
                        children: [
                          {
                            tag: "a-icon",
                            props: { type: "home" },
                            id: "vWodUEeTR"
                          }
                        ]
                      },
                      {
                        tag: "a-breadcrumb-item",
                        props: {},
                        id: "QhygDrq7DK",
                        children: [
                          {
                            tag: "v-text",
                            props: { content: "页面", tag: "span" },
                            id: "L9L11dUykC"
                          }
                        ]
                      },
                      {
                        tag: "a-breadcrumb-item",
                        props: {},
                        id: "zzlQf3rHYM",
                        children: [
                          {
                            tag: "v-text",
                            props: { content: "页面", tag: "span" },
                            id: "h0YAGRwaeh"
                          }
                        ]
                      }
                    ],
                    style: { "margin-bottom": "20px" }
                  },
                  {
                    tag: "a-alert",
                    props: {
                      type: "info",
                      message: "信息提示",
                      description: "描述",
                      banner: true,
                      closable: false,
                      showIcon: true
                    },
                    id: "hrR9bLrNN",
                    style: { "margin-bottom": "30px" }
                  },
                  {
                    tag: "a-steps",
                    props: {
                      current: 1,
                      status: "process",
                      direction: "horizontal",
                      size: "small",
                      type: "default",
                      labelPlacement: "horizontal"
                    },
                    id: "gTopCex3eb",
                    children: [
                      {
                        tag: "a-step",
                        props: { title: "步骤1" },
                        id: "MrJ2XIoSI"
                      },
                      {
                        tag: "a-step",
                        props: {
                          title: "步骤2",
                          description: "描述",
                          disabled: false
                        },
                        id: "KkbMg38B5g"
                      },
                      {
                        tag: "a-step",
                        props: { title: "步骤3", subTitle: "子标题" },
                        id: "BJh0HyF7G"
                      }
                    ]
                  },
                  {
                    tag: "a-timeline",
                    props: { reverse: false, pending: "pending", mode: "left" },
                    id: "-rD4WDRkaT",
                    children: [
                      {
                        tag: "a-timeline-item",
                        props: {
                          color: "rgba(35, 122, 103, 1)",
                          position: "left"
                        },
                        id: "8C0f1h57OX",
                        children: [
                          {
                            tag: "v-text",
                            props: {
                              content:
                                "<p>Create a services site</p><p>2015-09-01</p>",
                              tag: "span"
                            },
                            id: "LP4NumlGn"
                          }
                        ]
                      },
                      {
                        tag: "a-timeline-item",
                        props: {
                          color: "rgba(0, 0, 255, 0.48999999999999955)"
                        },
                        id: "WCUve9CYde",
                        children: [
                          {
                            tag: "v-text",
                            props: {
                              content:
                                "<p>Create a services site</p><p>2015-09-01</p>",
                              tag: "strong"
                            },
                            id: "UojXRjchS"
                          }
                        ]
                      },
                      {
                        tag: "a-timeline-item",
                        props: { color: "green", position: "left" },
                        id: "CIjkC52DD",
                        children: [
                          {
                            tag: "v-text",
                            props: {
                              content:
                                "<p>Create a services site</p><p>2015-09-01</p>",
                              tag: "span"
                            },
                            id: "PMhQLHW4nC"
                          }
                        ]
                      }
                    ],
                    style: { width: "400px" }
                  },
                  {
                    tag: "a-progress",
                    props: {
                      percent: 60,
                      strokeColor: "rgba(209, 145, 145, 1)"
                    },
                    id: "24tBb1EXS",
                    style: { "margin-top": "30px" }
                  },
                  {
                    tag: "a-progress",
                    props: {
                      percent: 30,
                      strokeColor: "rgba(80, 227, 194, 1)",
                      status: "normal",
                      strokeLinecap: "square",
                      type: "circle"
                    },
                    id: "igV5XD4to",
                    style: { "margin-top": "30px" }
                  },
                  {
                    tag: "a-tabs",
                    props: {},
                    id: "12tWLtjJIz",
                    children: [
                      {
                        tag: "a-tab-pane",
                        props: { tab: "tab" },
                        id: "FWjtxd9_4n",
                        children: [
                          {
                            tag: "v-text",
                            props: { content: "Tab content", tag: "span" },
                            id: "z4gYJpHAj"
                          }
                        ]
                      },
                      {
                        tag: "a-tab-pane",
                        props: { tab: "tab2" },
                        id: "9l7Zx2YR1",
                        children: [
                          {
                            tag: "v-text",
                            props: { content: "Tab content", tag: "span" },
                            id: "0pvTJFDG-E"
                          }
                        ]
                      }
                    ]
                  }
                ]
              },
              {
                tag: "a-pagination",
                props: {
                  current: 1,
                  pageSize: 10,
                  total: 30,
                  showSizeChanger: true,
                  showQuickJumper: false
                },
                id: "uhi0D9mzn",
                style: { "margin-top": "30px", "margin-left": "10px" }
              }
            ],
            style: {}
          }
        ]
      }
    ]
  },
  {
    tag: "a-layout-footer",
    props: {},
    id: "lk-xwlQIE",
    children: [
      {
        tag: "v-text",
        props: { content: "尾部", tag: "strong" },
        id: "WfMegz70r"
      }
    ]
  }
];
