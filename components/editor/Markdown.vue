
<script>
const props = {
  text: {
    default: "",
    inputType: "textArea",
    label: "文本内容"
  }
};

export { props };

export default {
  name: "editor-markdown",
  props,
  render(h) {
    return (
      <div class="editor-markdown-component">
        <div domPropsInnerHTML={this.$markdown.render(this.text)}></div>
      </div>
    );
  }
};
</script>

<style lang="stylus" scoped>
.editor-markdown-component {
    min-width 14px
    margin-bottom .5rem
}

p {
    padding 0
}

</style>


<style>
.reading img.emoji {
    width: 16px;
    height: 16px;
    margin: 0;
}
</style>
