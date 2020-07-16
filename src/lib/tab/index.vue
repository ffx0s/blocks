<script>
export default {
  props: {
    titles: {
      type: Array,
      required: true
    }
  },
  render() {
    const titles = this.titles;
    const children = this.$slots.default.map((slot, i) => (
      <a-tab-pane key={i} tab={titles[i] || "Tab" + (i + 1)}>
        {slot}
      </a-tab-pane>
    ));
    return <a-tabs {...{ props: this.$vnode.data.props }}>{children}</a-tabs>;
  }
};
</script>
