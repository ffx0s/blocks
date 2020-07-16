import {
  getComponentEl,
  getComponentType,
  getComponentData
} from "../../editor/components";
import editor from "@/editor";

const state = () => ({
  parentLayer: {
    id: null,
    show: false,
    tag: "",
    style: {}
  },
  singleLayer: {
    id: null,
    show: false,
    tag: "",
    style: {}
  }
});

function toggleLayer(state, name, value) {
  if (name) {
    state[`${name}Layer`].show = value;
  } else {
    state.parentLayer.show = value;
    state.singleLayer.show = value;
  }
}

const mutations = {
  setLayerProps(state, { type, props }) {
    const layer = state[`${type}Layer`];
    Object.keys(props).forEach(prop => {
      layer[prop] = props[prop];
    });
  },
  showLayer(state, name) {
    toggleLayer(state, name, true);
  },
  hideLayer(state, name) {
    toggleLayer(state, name, false);
  }
};

const actions = {
  showLayerByComponentEl({ commit, rootState }, el) {
    const type = getComponentType(el);
    if (type) {
      const { id, tag } = getComponentData(el);
      const { width, height, x, y } = el.getBoundingClientRect();
      const { canvasInitX, canvasInitY, canvasEl } = editor;
      const position = rootState.editor.position;
      const props = {
        id,
        tag,
        show: true,
        style: {
          width: width + "px",
          height: height + "px",
          top: y + canvasEl.scrollTop - (canvasInitY + position.y) + "px",
          left: x - (canvasInitX + position.x) + "px"
        }
      };

      commit("setLayerProps", { type, props });
    }
  },
  showLayerById({ commit, rootState }, id) {
    const el = getComponentEl(id);
    if (el) {
      actions.showLayerByComponentEl({ commit, rootState }, el);
    }
  },
  scrollTo(ctx, id) {
    const el = getComponentEl(id);
    if (el) {
      if (el.scrollIntoViewIfNeeded) {
        el.scrollIntoViewIfNeeded();
      } else if (el.scrollIntoView) {
        el.scrollIntoView();
      }
    }
  }
};

export default {
  state,
  mutations,
  actions,
  namespaced: true
};
