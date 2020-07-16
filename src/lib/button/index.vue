<script>
export default {
  props: {
    text: {
      type: String,
      default: ""
    }
  },
  render() {
    return (
      <a-button {...{ props: this.$vnode.data.props }}>{this.text}</a-button>
    );
  }
};
</script>
