<template>
  <div
    :class="[
      className,
      {
        [classNameResizing]: resizing,
        [classNameDragging]: dragging
      }
    ]"
    :style="positionStyle"
  >
    <div
      v-for="handle in handles"
      :key="handle"
      :class="[classNameHandle, classNameHandle + '-' + handle]"
      @mousedown="handleDown"
    />
    <slot />
  </div>
</template>

<script>
import { isNumber } from "@/utils/shared";

function getElementPosition(el) {
  const rect = el.getBoundingClientRect();
  return {
    w: rect.width,
    h: rect.height,
    x: rect.x,
    y: rect.y
  };
}

function limit(parent, child, minW, minH) {
  const { w, h, x, y } = child;
  const result = {
    w: Math.max(w, minW),
    h: Math.max(h, minH),
    x,
    y
  };
  const pw = Math.max(parent.w, minW);
  const ph = Math.max(parent.h, minH);

  if (w > pw) {
    result.w = pw;
    result.x = 0;
  } else if (w + x > pw) {
    result.x = pw - w;
  }
  if (h > ph) {
    result.h = ph;
    result.y = 0;
  } else if (h + y > ph) {
    result.y = ph - h;
  }
  if (x < 0) {
    result.x = 0;
  }
  if (y < 0) {
    result.y = 0;
  }

  return result;
}

function pointDown(point, event) {
  const { clientX, clientY } = event;
  point.startX = clientX;
  point.startY = clientY;
  point.distanceX = 0;
  point.distanceY = 0;
}

function pointMove(point, event) {
  const { clientX, clientY } = event;
  point.distanceX += clientX - point.startX;
  point.distanceY += clientY - point.startY;
  point.startX = clientX;
  point.startY = clientY;
  point.moving = true;
}

const handleActions = {
  br(position, { w, h }, { distanceX, distanceY }) {
    position.w = w + distanceX;
    position.h = h + distanceY;
  },
  tr(position, { w, h, y }, { distanceX, distanceY }) {
    position.w = w + distanceX;
    position.h = h - distanceY;
    position.y = y + distanceY;
  },
  tl(position, { w, h, x, y }, { distanceX, distanceY }) {
    position.w = w - distanceX;
    position.h = h - distanceY;
    position.x = x + distanceX;
    position.y = y + distanceY;
  },
  bl(position, { w, h, x }, { distanceX, distanceY }) {
    position.w = w - distanceX;
    position.h = h + distanceY;
    position.x = x + distanceX;
  },
  tm(position, { h, y }, { distanceY }) {
    position.h = h - distanceY;
    position.y = y + distanceY;
  },
  bm(position, { h }, { distanceY }) {
    position.h = h + distanceY;
  },
  ml(position, { w, x }, { distanceX }) {
    position.w = w - distanceX;
    position.x = x + distanceX;
  },
  mr(position, { w }, { distanceX }) {
    position.w = w + distanceX;
  },
  drag(position, { x, y }, { distanceX, distanceY }) {
    position.x = x + distanceX;
    position.y = y + distanceY;
  }
};

function setValue(max, min, obj, prop) {
  obj[prop] = Math.max(Math.min(max, obj[prop]), min);
}

export default {
  props: {
    position: {
      type: Object,
      default: () => ({
        x: 0,
        y: 0,
        w: "auto",
        h: "auto"
      })
    },
    parent: {
      type: Boolean,
      default: false
    },
    className: {
      type: String,
      default: "v-resizable"
    },
    classNameHandle: {
      type: String,
      default: "v-resizable__handle"
    },
    classNameResizing: {
      type: String,
      default: "v-resizable--resizing"
    },
    classNameDragging: {
      type: String,
      default: "v-resizable--dragging"
    },
    dragHandle: {
      type: String,
      default: ""
    },
    handles: {
      type: Array,
      default: () => ["tl", "tr", "bl", "br", "tm", "bm", "ml", "mr"]
    },
    draggable: {
      type: Boolean,
      default: true
    },
    minWidth: {
      type: Number,
      default: 0
    },
    minHeight: {
      type: Number,
      default: 0
    },
    maxWidth: {
      type: Number,
      default: Infinity
    },
    maxHeight: {
      type: Number,
      default: Infinity
    },
    styleObj: {
      type: Object,
      default: () => ({})
    }
  },
  computed: {
    positionStyle() {
      const { w, h, x, y } = this.position;
      return {
        width: w + "px",
        height: h + "px",
        transform: `translate(${x}px, ${y}px)`,
        userSelect: this.dragging || this.resizing ? "none" : "auto",
        ...this.styleObj
      };
    }
  },
  data() {
    return {
      resizing: false,
      dragging: false
    };
  },
  watch: {
    position: {
      handler: function() {
        if (this.point.moving) return;
        this.check();
      },
      deep: true
    }
  },
  beforeCreate() {
    this.point = {};
  },
  mounted() {
    this.autoSize();
    this.bindDragEvent();
    this.bindResizeEvent();
  },
  methods: {
    bindDragEvent() {
      const dragHandleEl = this.dragHandle
        ? document.querySelector(this.dragHandle)
        : this.$el;

      dragHandleEl.addEventListener("mousedown", this.handleDown);

      this.$once("hook:beforeDestroy", function() {
        dragHandleEl.removeEventListener("mousedown", this.handleDown);
      });
    },
    bindResizeEvent() {
      if (window.ResizeObserver) {
        const resizeObserver = new ResizeObserver(entries => {
          if (this.parent) {
            const { width, height } = entries[0].contentRect;
            this.parentPosition = { w: width, h: height };
            this.check();
            this.$emit("resize", entries[0]);
          }
        });

        resizeObserver.observe(this.$el.parentNode);

        this.$once("hook:beforeDestroy", function() {
          resizeObserver.disconnect();
        });
      } else {
        const handleResize = () => {
          clearTimeout(this.resizeTimer);

          this.resizeTimer = setTimeout(() => {
            if (this.parent) {
              const { w, h } = getElementPosition(this.$el.parentNode);

              this.parentPosition = { w, h };

              this.check();

              this.$emit("resize", {
                target: this.$el.parentNode,
                contentRect: { width: w, height: h }
              });
            }
          }, 100);
        };

        window.addEventListener("resize", handleResize);

        this.$once("hook:beforeDestroy", function() {
          window.removeEventListener("resize", handleResize);
        });
      }
    },
    handleDown(event) {
      this.handleName = event.target.className
        .toString()
        .split("-")
        .pop();

      if (this.handles.indexOf(this.handleName) === -1) {
        if (this.draggable) {
          this.handleName = "drag";
        } else {
          return;
        }
      }

      event.preventDefault();

      pointDown(this.point, event);

      this.startPosition = { ...this.position };

      document.documentElement.addEventListener("mousemove", this.handleMove);
      document.documentElement.addEventListener("mouseup", this.handleUp);

      this.$emit("down", this.startPosition);
    },
    handleMove(event) {
      if (this.parent && !this.point.moving) {
        this.calcLimits();
      }

      pointMove(this.point, event);

      const { parent, point, startPosition, position, handleName } = this;

      handleActions[handleName] &&
        handleActions[handleName](position, startPosition, point);

      let limits;
      let props;

      if (parent) {
        limits = this.limits;
        props = ["x", "y", "w", "h"];
      } else {
        limits = {
          maxW: this.maxWidth,
          maxH: this.maxHeight,
          minW: this.minWidth,
          minH: this.minHeight
        };
        props = ["w", "h"];
      }

      props.forEach(prop => {
        const upperCaseProp = prop.toLocaleUpperCase();
        const max = limits["max" + upperCaseProp];
        const min = limits["min" + upperCaseProp];
        isNumber(max) && setValue(max, min, position, prop);
      });

      if (this.handleName === "drag") {
        this.dragging = true;
        this.$emit("dragging", position);
      } else {
        this.resizing = true;
        this.$emit("resizing", position);
      }
    },
    handleUp() {
      document.documentElement.removeEventListener(
        "mousemove",
        this.handleMove
      );
      document.documentElement.removeEventListener("mouseup", this.handleUp);

      const resizing = this.resizing;
      const moving = this.point.moving;

      this.resizing = false;
      this.dragging = false;
      this.point.moving = false;

      if (moving) {
        this.$emit(resizing ? "resizestop" : "dragstop", this.position);
      }
    },
    check() {
      const { parent, parentPosition, position, minWidth, minHeight } = this;
      if (parent && parentPosition) {
        const newPosition = limit(
          parentPosition,
          position,
          minWidth,
          minHeight
        );
        Object.assign(position, newPosition);
      }
    },
    calcLimits() {
      const {
        minWidth,
        minHeight,
        maxWidth,
        maxHeight,
        startPosition,
        parentPosition,
        handleName
      } = this;
      const { w: pw, h: ph } = parentPosition;
      const { w: startW, h: startH, x: startX, y: startY } = startPosition;
      let maxW, maxH, minW, minH, minX, minY, maxX, maxY;

      if (handleName === "drag") {
        minX = 0;
        minY = 0;
        maxX = pw - startW;
        maxY = ph - startH;
      } else {
        if (handleName.indexOf("r") !== -1) {
          maxW = Math.min(maxWidth, pw, pw - startX);
          minW = Math.min(minWidth, pw);
        } else if (handleName.indexOf("l") !== -1) {
          maxW = Math.min(maxWidth, pw, startW + startX);
          minW = Math.min(minWidth, pw);
          maxX = startW - minW + startX;
          minX = startX - (maxW - startW);
        }

        if (handleName.indexOf("b") !== -1) {
          maxH = Math.min(maxHeight, ph, ph - startY);
          minH = Math.min(minHeight, ph);
        } else if (handleName.indexOf("t") !== -1) {
          maxH = Math.min(maxHeight, ph, startH + startY);
          minH = Math.min(minHeight, ph);
          maxY = startH - minH + startY;
          minY = startY - (maxH - startH);
        }
      }

      this.limits = {
        maxW,
        maxH,
        minW,
        minH,
        maxX,
        maxY,
        minX,
        minY
      };
    },
    autoSize() {
      const { position, $el } = this;
      let newPosition;

      Object.keys(position).forEach(prop => {
        if (position[prop] === "auto") {
          if (!newPosition) {
            newPosition = getElementPosition($el);
          }
          position[prop] = newPosition[prop];
        }
      });
    }
  }
};
</script>

<style>
.v-resizable {
  position: relative;
}
.v-resizable__handle {
  position: absolute;
  z-index: 4;
}
.v-resizable__handle-tl,
.v-resizable__handle-tr,
.v-resizable__handle-bl,
.v-resizable__handle-br {
  box-sizing: border-box;
  width: 10px;
  height: 10px;
  z-index: 5;
}
.v-resizable__handle-tl {
  left: 0;
  cursor: nwse-resize;
}
.v-resizable__handle-tr {
  right: 0;
  cursor: nesw-resize;
}
.v-resizable__handle-bl {
  bottom: 0;
  cursor: nesw-resize;
}
.v-resizable__handle-br {
  bottom: 0;
  right: 0;
  cursor: nwse-resize;
}

.v-resizable__handle-tm,
.v-resizable__handle-bm {
  cursor: ns-resize;
  width: 100%;
  height: 2px;
}

.v-resizable__handle-bm {
  bottom: 0;
}

.v-resizable__handle-ml,
.v-resizable__handle-mr {
  top: 0;
  width: 2px;
  height: 100%;
  cursor: ew-resize;
}
.v-resizable__handle-ml {
  left: 0;
}
.v-resizable__handle-mr {
  right: 0;
}
</style>
