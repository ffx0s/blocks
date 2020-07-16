<template>
  <div :class="$style.header">
    <div class="__canvasInputNumber" @mousedown.stop>
      <a-input-number
        size="small"
        :value="position.w"
        @change="canvasSizeChange($event, 'w')"
        @blur="canvasSizeChange($event.target.value, 'w', 'blur')"
      />
      <span>&nbsp;x&nbsp;</span>
      <a-input-number
        size="small"
        :value="position.h"
        @change="canvasSizeChange($event, 'h')"
        @blur="canvasSizeChange($event.target.value, 'h', 'blur')"
      />
      &nbsp;
      <a-dropdown>
        <a-icon type="down" style="font-size: 10px;" />
        <a-menu slot="overlay">
          <a-menu-item
            v-for="device in devices"
            :key="device.name"
            @click="setPosition({ w: device.size[0], h: device.size[1] })"
          >
            {{ device.name }}
          </a-menu-item>
          <a-menu-item @click="setPosition({ w: 1100, h: 800 })">
            默认
          </a-menu-item>
        </a-menu>
      </a-dropdown>
    </div>
    <a-tooltip v-show="isPreview" title="取消预览" placement="bottom">
      <a-icon
        type="eye-invisible"
        @click="cancelPreview"
        :class="$style.cancelPreview"
      />
    </a-tooltip>
  </div>
</template>

<script>
import { isNumber } from "@/utils/shared";
import { mapState, mapGetters } from "vuex";

export default {
  computed: {
    ...mapState("editor", ["position"]),
    ...mapGetters("editor", ["isPreview"])
  },
  data() {
    return {
      devices: [
        { name: "华为 P30", size: [360, 780] },
        { name: "IPhone 6/7/8", size: [375, 667] },
        { name: "IPhone X", size: [375, 812] },
        { name: "IPad", size: [768, 1024] },
        { name: "Galaxy A10", size: [360, 760] }
      ]
    };
  },
  methods: {
    canvasSizeChange(newValue, prop, eventName) {
      if (eventName) {
        this.setPosition({ [prop]: +newValue });
      } else if (isNumber(newValue)) {
        const currentValue = this.position[prop];
        if (Math.abs(currentValue - newValue) === 1) {
          this.setPosition({ [prop]: newValue });
        }
      }
    },
    setPosition(position) {
      const { w: pw } = this.$parent.parentPosition;
      position.x = (pw - position.w) / 2;
      this.$store.commit("editor/setPosition", position);
    },
    cancelPreview() {
      this.$store.commit("editor/setStatus", "EDIT");
    }
  }
};
</script>

<style module>
.header {
  position: absolute;
  width: 100%;
  height: 35px;
  z-index: 3;
  cursor: move;
  background-color: #fff;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: -3px 3px 12px -5px rgba(0, 0, 0, 0.15);
}
.cancelPreview {
  position: absolute;
  right: 15px;
}
</style>

<style>
.__canvasInputNumber {
  color: rgba(0, 0, 0, 0.45);
  cursor: auto;
}
.__canvasInputNumber .ant-input-number-handler-wrap {
  display: none;
}
.__canvasInputNumber .ant-input-number-input {
  text-align: center;
  font-size: 12px;
  height: 19px;
  color: rgba(0, 0, 0, 0.45);
  border-color: #eaeaea;
}
.__canvasInputNumber .ant-input-number-sm {
  width: 50px;
  height: 20px;
  line-height: 0;
}
</style>
