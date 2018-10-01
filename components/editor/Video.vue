
<script>
const props = {
  src: {
    default: "",
    inputType: "text",
    label: "视频地址"
  }
};

export { props };

export default {
  name: "editor-video",
  props,
  render(h) {
    return (
      <div class="editor-video-component">
        <video src={this.src} controls />
      </div>
    );
  }
};
</script>

<style lang="stylus" scoped>
.editor-video-component {
    min-width 50px
    margin-bottom .5rem
    padding 20px
}
</style>
