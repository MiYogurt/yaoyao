
<script>
const props = {
  title: {
    default: "",
    inputType: "text",
    label: "标题内容"
  },
  level: {
    default: 1,
    inputType: "select",
    select: [
      {
        key: 1,
        value: "一级标题"
      },
      {
        key: 2,
        value: "二级标题"
      },
      {
        key: 3,
        value: "三级标题"
      },
      {
        key: 4,
        value: "四级标题"
      },
      {
        key: 5,
        value: "五级标题"
      },
      {
        key: 6,
        value: "六级标题"
      }
    ],
    label: "标题等级"
  },
  text: {
    default: "",
    inputType: "textArea",
    label: "文本内容"
  }
};

export { props };

export default {
  name: "editor-p",
  props,
  render(h) {
    const HTag = "h" + this.level;
    return (
      <div class="editor-p-component">
        {this.title && <HTag>{this.title}</HTag>}
        <p>{this.text}</p>
      </div>
    );
  }
};
</script>

<style lang="stylus" scoped>
.editor-p-component {
    min-width 14px
    margin-bottom .5rem
}

</style>
