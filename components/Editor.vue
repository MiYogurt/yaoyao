<template>
  <div id="editor" class="wrap" :class="{'show': show }" :style="style">
    <div class="controler-top" @mousedown="down"></div>
    <div class="close-wrap">
      <span class="notice">Ctrl or ⌘ + Enter</span>
      <span class="btn" @click="submit">提交</span>
      <i class="close far fa-times-circle" @click="close"></i>
    </div>
    <div class="editor" ref="editor" @keyup="pressup" @keydown="pressdown"></div>
  </div>
</template>

<style>
</style>

<style lang="stylus" scoped>
  .wrap {
    width 100%
    position fixed
    bottom 0
    left 0
    right 0
    background #f8faff
    // opacity 0
    z-index 99
    transition transform cubic-bezier(0.68, -0.55, 0.28, 1.3) .2s
  }

  .show {
    // transform none !important
    // opacity 1
    top 100%
  }
  .close-wrap {
    text-align: right
    height 30px
    margin-right 2rem
    margin-top 1rem
    margin-bottom 1rem
    color #4d648b
    .notice {
      color #4c648b61
    }
    span {
      font-size .9rem
      margin-right 1rem
      line-height 30px
      position relative
      top -2px
      user-select none
    }
    .btn {
      cursor pointer
    }
  }
  .close {
    color #4d648b
    font-size 1.2rem
    cursor pointer
    margin-top 5px
  }
  .btn,
  .close {
    color #4d648b
    transition all .2s
    user-select none
    &:hover {
      color #49a8fc
    }
  }
  .controler-top{
    height 1vh
    background #4d648b
    display flex
    cursor row-resize
    &::before {
      content '';
      display block;
      width 27px;
      margin auto;
      border-top 3px double #fff;
    }
  }
  .editor {
    height: calc(100% - 1vh - 5rem);
    padding: 0 2rem 2rem;
    display: flex;
    flex-direction: column;
    justify-content: stretch;
  }


</style>


<script>
export default {
  data() {
    return {
      resize: false,
      top: 50,
      text:'',
      meta: false,
      ctrl: false,
      enter: false
    }
  },

  computed: {
    show(){
      return this.$store.state.comment_show
    },
    style() {
      let top = this.top
      if (this.show) {
        return {
          top: `${top}%`,
          transform: `translateY(0%)`
        }
      }
      return {
        top: `${top}%`,
        transform: `translateY(100%)`
      }
    }
  },
  methods: {
    close() {
      this.$store.commit('toggle_comment')
    },
    pressup(e){
      if (!this.show) {
        return
      }
      if (this.enter && (this.meta || this.ctrl)) {
        this.submit()
        this.meta = false
        this.ctrl = false
        this.enter = false
      }

      if (e.key== 'Meta') {
        this.meta = false
      }

      if (e.key== 'Control') {
        this.ctrl = false
      }

      if (e.code == 'Enter') {
          this.enter = false
      }
    },
    pressdown(e){
      if (e.code == 'Enter') {
          this.enter = true
      }

      if (e.key== 'Meta') {
        this.meta = true
      }

      if (e.key== 'Control') {
        this.meta = true
      }
    },
    submit(){
      this.$store.commit('set_edit_text', this.text)
    },
    down(e) {
      this.resize = true
      document.body.addEventListener('mousemove', this.move, false)
      document.body.addEventListener('mouseup', this.up, false)
    },
    move(e) {
      if (!this.resize) {
        return
      }
      clearTimeout(this.timer)
      this.timer = setTimeout(this.up, 400)
      document.body.classList.add('unselect')

      e.preventDefault()

      let top = 100 * e.clientY / window.innerHeight
      top = top > 99 ? Math.min(99, top) : top
      top = top < 0 ? Math.max(0, top) : top

      this.top = top
    },
    up(e) {
      this.resize = false
      this.startY = 0
      if (this.top < 10) {
        this.top = 0
      }
      if (this.top > 90) {
        this.top = 99
      }
      document.body.removeEventListener('mousemove', this.move, false)
      document.body.classList.remove('unselect')
    }
  },
  mounted() {
    const pell = require('pell')
    window.editor = pell.init({
      element: this.$refs.editor,
      onChange: html => this.text = html,
      defaultParagraphSeparator: 'p',
      classes: {
        content: 'pell-content reading'
      }
    })
    window.editor.content.innerHTML = '<p></p>'
  }
}
</script>
