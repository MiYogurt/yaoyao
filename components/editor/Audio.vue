
<script>
const props = {
  src: {
    default: "",
    inputType: "text",
    label: "音频地址"
  }
};

export { props };

export default {
  name: "editor-audio",
  props,
  render(h) {
    return (
      <div class="editor-audio-component">
        <audio src={this.src} controls>
        </audio>
      </div>
    );
  }
};
</script>

<style lang="stylus" scoped>
.editor-audio-component {
    min-width 50px
    margin-bottom .5rem
    padding 20px

    audio {
        min-height: 54px;
    }
}
</style>
