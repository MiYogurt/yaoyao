<script>
import EImage, { props as EImageProps } from "./editor/Image.vue";
import EP, { props as EPProps } from "./editor/P.vue";
import EMarkdown, { props as EMarkdownProps } from "./editor/Markdown.vue";
import EVideo, { props as EVideoProps } from "./editor/Video.vue";
import EAudio, { props as EAudioProps } from "./editor/Audio.vue";
import EPlaceholder from "./editor/Placeholder.vue";
import EOperatBar from "./EditorOperatBar.vue";
import EConfig from "./editor/config/Index.vue";
const throttle = require("lodash.throttle");

const propMaps = {
  EImage: EImageProps,
  EP: EPProps,
  EMarkdown: EMarkdownProps,
  EAudio: EAudioProps,
  EVideo: EVideoProps
};

export default {
  name: "text-editor",
  components: {
    EImage,
    EOperatBar,
    EPlaceholder,
    EConfig,
    EP,
    EMarkdown,
    EAudio,
    EVideo
  },
  model: {
    prop: "text",
    event: "change"
  },
  props: ["text", "show"],
  watch: {
    textSource(newVal) {
      this.$emit("change", newVal);
    },
    text() {
      this.textSource = this.text;
    }
  },
  data() {
    return {
      textSource: this.text || [
        {
          name: "EP",
          props: {
            text: "请输入你的内容"
          },
          showOperator: false,
          status: false
        }
      ],
      activeIndex: 0,
      activeUp: true,
      edit: {
        index: -1,
        config: {}
      },
      onlyShow: this.show
    };
  },
  computed: {
    index() {
      return this.activeUp ? this.activeIndex : this.activeIndex + 1;
    }
  },
  methods: {
    renderList(h) {
      return this.textSource.map((component, index) =>
        h(
          "div",
          {
            class: [
              "drag-wrap",
              component.status || "none",
              component.showOperator ? "operator" : ""
            ],
            on: {
              dragenter: e => this.ondragenter(e, index),
              dragover: this.ondragover,
              dragleave: e => this.ondragleave(e, index),
              drop: e => this.ondrop(e),
              mouseover: e => this.hover("over", index),
              mouseout: e => this.hover("out", index)
              // dragstart: (e) => e.preventDefault()
            }
          },
          [
            h(
              component.name,
              { key: index, props: component.props || {} },
              null
            ),
            h("div", { class: "component-operator" }, [
              h(
                "i",
                {
                  class: "fas fa-cog",
                  on: {
                    click: e =>
                      this.editComponent(
                        index,
                        component.name,
                        propMaps[component.name]
                      )
                  }
                },
                null
              ),
              h(
                "i",
                {
                  class: "far fa-trash-alt",
                  on: { click: e => this.deleteComponent(index) }
                },
                null
              ),
              h(
                "i",
                {
                  class: "fas fa-angle-up",
                  on: { click: e => this.moveComponent("up", index) }
                },
                null
              ),
              h(
                "i",
                {
                  class: "fas fa-angle-down",
                  on: { click: e => this.moveComponent("down", index) }
                },
                null
              )
            ])
          ]
        )
      );
    },
    onlyShowRender(h) {
      return (
        <div class="only-show">
          {this.textSource.map((component, index) =>
            h(
              component.name,
              { key: index, props: component.props || {} },
              null
            )
          )}
        </div>
      );
    },
    ondragenter(e, activeIndex) {
      this.activeIndex = activeIndex;
      try {
        this.activeUp = e.offsetY <= e.fromElement.offsetHeight ? true : false;
        this.textSource[activeIndex].status = this.activeUp ? "top" : "bottom";
      } catch (error) {
        console.log("无法获取拖拽物体的高度");
      }
    },
    ondragleave(e, activeIndex) {
      this.textSource[activeIndex].status = "none";
    },
    ondragover(e) {
      e.preventDefault();
      const wrap = e.path.find(e => e.classList.contains("drag-wrap"));
      const bound = wrap.getBoundingClientRect();
      const scrollTop = Math.max(
        document.documentElement.scrollTop,
        document.body.scrollTop
      );
      const height = e.pageY - (bound.top + scrollTop);
      this.activeUp = height <= bound.height / 2 ? true : false;
      this.textSource[this.activeIndex].status = this.activeUp
        ? "top"
        : "bottom";
    },
    ondrop(e) {
      this.textSource.forEach((item, key) => {
        if (item.status != "none") this.textSource[key].status = "none";
      });
      try {
        const config = JSON.parse(e.dataTransfer.getData("data"));
        this.textSource.splice(this.index, 0, {
          ...config
        });
        this.closeConfig();
      } catch (e) {
        console.log("未收到组件初始化数据");
      }
    },
    hover(type, index) {
      if (type == "over") {
        this.textSource[index].showOperator = true;
      } else {
        this.textSource[index].showOperator = false;
      }
    },
    deleteComponent(index) {
      if (this.textSource.length == 1) {
        return this.msg_error("操作错误", "无法删除最后一个组件");
      }
      this.textSource.splice(index, 1);
      if ((this.edit.index = index)) {
        this.closeConfig();
      } else if (this.edit.index < index) {
        this.edit.index = this.edit.index - 1;
      }
    },
    editComponent(index, name, props) {
      if (this.edit.index != -1 && this.edit.index != index) {
        this.closeConfig();
        return this.$nextTick(() => {
          this.edit.index = index;
          this.edit.config = props;
        });
      }
      this.edit.index = index;
      this.edit.config = props;
    },
    moveComponent(type, index) {
      let tmp = null;
      switch (type) {
        case "up":
          if (index == 0) {
            return this.msg_error("操作错误", "已经是第一个了");
          }
          tmp = this.textSource[index];
          this.textSource[index] = this.textSource[index - 1];
          this.textSource[index - 1] = tmp;

          // 在编辑时候移动
          if (this.edit.index == index) {
            this.edit.index = index - 1;
            return;
          }
          // 在编辑是，将正在编辑的下方元素移动到编辑位置
          if (this.edit.index == index - 1) {
            this.edit.index = index;
          }
          break;
        case "down":
          if (index == this.textSource.length - 1) {
            return this.msg_error("操作错误", "已经是最后一个了");
          }
          tmp = this.textSource[index];
          this.textSource[index] = this.textSource[index + 1];
          this.textSource[index + 1] = tmp;

          if (this.edit.index == index) {
            this.edit.index = index + 1;
            return;
          }
          // 在编辑是，将正在编辑的上方元素移动到编辑位置
          if (this.edit.index == index + 1) {
            this.edit.index = index;
          }
          break;
        default:
          break;
      }
    },
    fire(key, value) {
      this.textSource[this.edit.index]["props"][key] = value;
      this.$forceUpdate();
      this.$emit("change", this.textSource);
    },
    closeConfig() {
      this.edit.index = -1;
      this.edit.config = {};
    },
    save() {
      console.log(this.textSource);
      this.$emit("submit", this.textSource);
    }
  },
  render(h) {
    if (this.onlyShow) {
      return this.onlyShowRender(h);
    }
    return (
      <div class="editor">
        <keep-alive>
          <div class="show-container reading">{this.renderList(h)}</div>
        </keep-alive>
        <EOperatBar save={this.save} />
        <transition name="slide-fade">
          {this.edit.index != -1 && (
            <EConfig
              config={this.edit.config}
              fire={(k, v) => this.fire(k, v)}
              close={() => this.closeConfig()}
              source={this.textSource[this.edit.index].props}
            />
          )}
        </transition>
      </div>
    );
  }
};
</script>

<style lang="stylus" scoped>
.editor {
    width: 100%;
    padding: 1rem;
    display: flex;
    overflow-x: hidden;
}

.show-container {
    width: 100%;
    min-height: 80vh;
    background: #fff;
}

.only-show {
    width: 100%;
    min-height: min-content;
    background: #fff;
}

.slide-fade-enter-active {
    transition: all 0.3s ease;
}

.slide-fade-leave-active {
    transition: all 0.3s cubic-bezier(1, 0.5, 0.8, 1);
}

.slide-fade-enter, .slide-fade-leave-to {
    transform: translateX(100%);
}

.drag-wrap {
    border-bottom: 2px solid transparent;
    border-top: 2px solid transparent;
    position: relative;
    will-change: transform;
    transition: transform 150ms;
    transform: translate3d(0, 0, 0);

    &.top {
        border-top-color: #52c1ed;
    }

    &.bottom {
        border-bottom-color: #49a8fc;
    }

    &.operator {
        background: #f8faff;
    }

    &.operator .component-operator {
        display: block;
    }

    .component-operator {
        position: absolute;
        display: none;
        left: 50%;
        margin-left: -50px;
        top: 0;
        background: #ffffff;
        width: 100px;
        height: 25px;
        line-height: 25px;
        box-shadow: 0 0 8px 0px rgba(0, 0, 0, 0.02);

        i {
            width: 25px;
            text-align: center;
            cursor: pointer;
            color: #49a8fc;

            &:hover {
                color: #52c1ed;
            }
        }
    }
}
</style>


