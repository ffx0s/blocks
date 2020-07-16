<script>
export default {
  render() {
    const children = this.$slots.default.map((slot, i) => (
      <a-breadcrumb-item key={i}>{slot}</a-breadcrumb-item>
    ));
    return (
      <a-breadcrumb {...{ props: this.$vnode.data.props }}>
        {children}
      </a-breadcrumb>
    );
  }
};
</script>
