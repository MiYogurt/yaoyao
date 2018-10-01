<template>
  <div class="container" :class="{ 'better': simple }">
    <div class="columns">
      <div class="column is-9">
        <div class="post">
          <button class="change-reading-type" v-text="simple ? ' 进入正常模式' : '进入简约模式'" @click="changeReadingType"></button>
          <div class="category"><span class="reactangle" :style="{background:post.category.color}"></span>{{ post.category.name }}</div>
          <h4 class="post-title">{{ post.title }}</h4>
          <div class="content reading" @click="openImage">
            <text-editor :text="text" :show="true"></text-editor>
          </div>
        </div>
        <div class="post-infomation">
          <div>
            <div class="tag-list">
              <span class="tag" v-for="tag in post.tags" :key="tag.objectId" :style="{background: tag.background, color: tag.color}">{{tag.name}}</span>
              <span class="time">{{post.createdAt | ago}}</span>
            </div>
          </div>
          <div class="count-wrap">
            <div class="reading-count"><span class="count">{{ post.view + 1 | k }}</span><span>查看</span></div>
            <div class="reply-count"><span class="count">{{ post.comments ? post.comments.length : 0 }}</span><span>回复</span></div>
            <a class="reply-button linear" v-if="username==''" @click="toLogin">登陆以回复</a>
          </div>
        </div>
        <div class="comments">
          <post-comment @del="() => delComment(index)" @edit="() => editComment(index)" v-for="(comment,index) in post.comments" :comment="comment" :key="comment.objectId" :index="index + 1"/>
        </div>
      </div>
      <div class="column is-3">
        <div class="author-info">
          <div class="top">
            <div class="circle"><img :src="author_avatar"></div>
            <div class="right">
              <div class="top username"><nuxt-link :to="{name:'user-id', params: {id: post.author.objectId}}">{{post.author.username}}</nuxt-link> 
                <!-- <span class="designation"><i class="fas fa-chess-queen"></i>论坛女皇</span> -->
              </div>
              <div class="tag-list">
                <span class="tag" v-for="(tag, i) in tags" :key="i" :style="{
                  background: `rgba(${tag.bgColor.rgba.r},${tag.bgColor.rgba.g},${tag.bgColor.rgba.b}, ${tag.color.rgba.a}`,
                  color: `rgbaa(${tag.color.rgba.r},${tag.color.rgba.g},${tag.color.rgba.b}, ${tag.color.rgba.a}`,
                }">{{tag.text}}</span>
              </div>
            </div>
          </div>
          <p class="desc">{{post.author.description}}</p>
        </div>
        <div class="btns">
          <div class="block-3">
            <a class="block-btn" @click="editPost" v-if="canEditPost"><i class="fas fa-pencil-alt"></i> 编辑</a>
            <a class="block-btn" @click="delPost" v-if="canEditPost"><i class="far fa-trash-alt"></i> 删除</a>
            <a class="block-btn" @click="collection" v-if="username"><i class="fas fa-flag-checkered"></i> {{ this.collectioned ? '取消' : '收藏' }}</a>
          </div>
          <div class="block-3">
            <a class="block-btn" @click="openComment" v-if="username"><i class="fas fa-comment"></i> 评论</a>
            <a class="block-btn" @click="toggleTopLock" v-if="isAdmin"><i class="fas fa-thumbtack"></i> {{ post.top == 99 ? '取消': '置顶' }}</a>
          </div>
        </div>
      </div>
    </div>


    <div class="photo-box" v-show="img" @mouseup="up" @touchend="up" @touchstart="down" @mousedown="down" @mousemove="move" @touchmove="move" @dragstart.prevent="noop" @mousewheel="wheel" ref="imgBox">
      <div class="controll-bar">
        <div class="large" @click="resize('reset')"><i class="fas fa-undo-alt"></i> <span>重置</span></div>
        <div class="large" @click="resize('large')"><i class="fas fa-search-plus"></i> <span>放大</span></div>
        <div class="small" @click="resize('small')"><i class="fas fa-search-minus"></i> <span>缩小</span></div>
        <div class="link" v-show="link" @click="openLink"><i class="fas fa-external-link-alt"></i> <span>链接</span></div>
        <div class="close" @click="close"><i class="far fa-times-circle"></i> <span>关闭</span></div>
      </div>
      <transition name="fade">
        <img :src="img" ref="img" v-show="imgLoaded" @load="loaded">
     </transition>
      <div class="loading" v-if="!imgLoaded"><img src="/loading.svg" width="70"></div>
    </div>
  </div>
</template>

<script>
import {mapState} from 'vuex'
import TextEditor from '~/components/TextEditor.vue';
import PostComment from '~/components/PostComment.vue';
import axios from 'axios'

export default {
  computed: {
    author_avatar(){
      return process.env.cdnUrl + this.post.author.avatar
    },
    text(){
      return JSON.parse(this.post.text)
    },
    tags(){
      return JSON.parse(this.post.author.tags)
    },
    canEditPost(){
      return (this.post.author.username == this.username) || this.isAdmin
    },
    ...mapState(['username', 'comment_show','edit_text', 'isAdmin', 'username'])
  },
  watch: {
    'edit_text': async function (val) {
      if (this.editCommentIndex >= 0) {
        let comment = this.post.comments[this.editCommentIndex]
        if (!comment) return
        comment.text = val // 更新视图先行，这个 from 之后不会被记录更改
        comment = this.$parse.Object.fromJSON(comment)
        comment.set('text', val) // 执行这个才会被记录更改
        comment.save().then(() => {
          this.msg_success('修改评论成功', '已成功修改评论')
          this.$store.commit('toggle_comment')
          this.$store.commit('set_edit_text', '')
          if(window.editor) window.editor.content.innerHTML = '<p></p>'
          this.editCommentIndex = -1
        }).catch(console.error)
        return;
      }
      if (val.length > 0) {
        const author = this.$parse.User.current()
        if(!author) return
        const Comment = this.$parse.Object.extend('Comment')
        let comment = new Comment()
        comment.set('author', author)
        comment.set('text', val)

        let _post = this.post
        _post.className = 'Post'
        _post = this.$parse.Object.fromJSON(_post)

        comment.set('post', _post)

        let acl = new this.$parse.ACL()
        acl.setPublicReadAccess(true)
        acl.setWriteAccess(this.$parse.User.current(), true)
        acl.setRoleWriteAccess('Administrator', true)
        comment.setACL(acl)
        comment = await comment.save()
        let post = await this.$parse.Cloud.run('post_comment', { comment_id: comment.id, post_id: this.post.objectId})
        if(!this.post.comments) {
          this.post.comments = [comment.toJSON()]
          this.$forceUpdate()
        }else {
          this.post.comments.push(comment.toJSON())
        }
        this.msg_success('评论成功', '已成功发表评论')
        this.$store.commit('toggle_comment')
        this.$store.commit('set_edit_text', '')
        if(window.editor) window.editor.content.innerHTML = '<p></p>'
        
      }
    }
  },
  components: {
    TextEditor,
    PostComment
  },
  async asyncData({params, env}){
    const Parse = require('create-api').default()
    const PoserQuery = new Parse.Query(Parse.Object.extend('Post'))
    PoserQuery.include('tags')
    PoserQuery.include('category')
    PoserQuery.include('author')
    PoserQuery.include('comments.author')
    PoserQuery.include('comments')
    PoserQuery.equalTo("objectId", params.id);
    let post = await PoserQuery.first()
    let data = post.toJSON()
    Parse.Cloud.run('view_post', { id: post.id })
    return {
      post: data
    }
  },
  head(){
    return {
      title: this.post.title
    }
  },
  data() {
    return {
      simple: true,
      img: '',
      link: '',
      scale: 1,
      start: {
        x: 0,
        y: 0
      },
      startDom: {
        x: 0,
        y: 0
      },
      imgLoaded: false,
      editCommentIndex: -1,
      collectioned: false
    }
  },
  methods: {
    async collection(){
      if(this.collectioned){
        return this.delCollection()
      }
      this.createCollection()
    },
    async createCollection(){
      const Collection = this.$parse.Object.extend('PostCollection')
      let collection = new Collection()
      collection.set('who', this.$parse.User.current())
      collection.set('post', this.restorePost())
      collection.setACL(this.newAcl())
      await collection.save()
      this.msg_success('操作成功', '已成功收藏该讨论');
      this.collectioned = collection
    },
    async delCollection(){
      window.checkTip && (window.checkTip('error', '取消收藏', '这将取消收藏该讨论', async (bool) => {
        if(!bool) return
        await this.collectioned.destroy()
        this.collectioned = false
        this.msg_success('操作成功', '已成功取消收藏');
      }))
    },
    async searchCollection(){
      const Collection = this.$parse.Object.extend('PostCollection')
      let q = new this.$parse.Query(Collection)
      q.equalTo('who', this.$parse.User.current())
      q.equalTo('post', this.restorePost())
      this.collectioned = await q.first()
    },
    newAcl(){
        let acl = new this.$parse.ACL()
        acl.setPublicReadAccess(true)
        acl.setWriteAccess(this.$parse.User.current(), true)
        acl.setRoleWriteAccess('Administrator', true)
        return acl
    },
    restorePost(){
      let post = this.post
      post.className = 'Post'
      post = this.$parse.Object.fromJSON(post)
      return post
    },
    async toggleTopLock(){
      let post = this.restorePost()
      if (this.post.top != 99) {
        post.set('top', 99)
        this.post.top = 99
      } else {
        post.set('top', 0)
        this.post.top = 0
      }
      await post.save()
      this.msg_success('操作成功', '已成功设定')
    },
    // 记录下当前的 url
    toLogin(){
      this.$store.commit('reback_history_url', this.$route.path)
      this.$router.push('/login')
    },
    editPost(){
      this.$router.push({name:'post-edit-id', params: {id: this.post.objectId}})
    },
    delPost(){
      window.checkTip && (window.checkTip('error', '删除操作', '这将删除该文章', async (bool) => {
        if(!bool) return
        let post = this.post
        console.log(this.post);
        post.className = 'Post'
        post = this.$parse.Object.fromJSON(post)
        console.log(post)
        if(post.get('comments')){
          await this.$parse.Cloud.run('del_post_comments', {
            id: post.id
          })
        }
        await post.destroy()
        this.msg_success('删除成功', `已成功删除《${post.get('title')}》`)
        this.$router.go(-1)
      }))
      
    },
    editComment(index){
      this.editCommentIndex = index
      window.editor && (window.editor.content.innerHTML = this.post.comments[index].text)
      this.openComment()
    },
    async delComment(index){
      const comments = this.post.comments.splice(index , 1)
      let comment = comments[0]
      if (!comment) {
        return
      }
      comment.className = 'Comment'
      comment = this.$parse.Object.fromJSON(comment)
      await this.$parse.Cloud.run('del_comment', {
        post_id: this.post.objectId,
        comment_id: comment.id
      })
      await comment.destroy()
      this.msg_success('操作成功', '已成功删除该评论！')
    },
    openComment(){
      this.$store.commit('toggle_comment')
    },
    async changeReadingType() {
      this.simple = !this.simple
      await this.$lf.setItem('reading-type', this.simple)
    },
    openImage(e) {
      if (e.target.tagName.toLowerCase() !== 'img') {
        return
      }
      if (e.target.parentElement.tagName.toLowerCase() == 'a') {
        e.preventDefault()
        const tag_a = e.target.parentElement
        this.link = tag_a.href
      }
      this.img = e.target.src
      this.imgLoaded = false
    },
    openLink() {
      window.open(this.link)
    },
    close() {
      this.link = this.img = ''
      this.scale = 1
      this.$refs.img.style = {}
      this.imgLoaded = false
    },
    loaded() {
      this.imgLoaded = true
    },
    noop() {},
    wheel(e) {
      e.preventDefault()
      const delta = e.deltaY | e.detail
      if (delta < 0) {
        this.resize('small')
      } else {
        this.resize('large')
      }
    },
    resize(type, step = 0.1) {
      if (!this.$refs.img) {
        return
      }
      switch (type) {
        case 'large':
          this.scale += step
          if (this.scale > 2) {
            this.scale = 2
          }
          break
        case 'small':
          this.scale -= step
          if (this.scale < 0.1) {
            this.scale = 0.1
          }
          break
        case 'reset':
          const img = this.$refs.img
          img.style.left = '0px'
          img.style.top = '0px'
          this.scale = 1
          break
      }
      this.$refs.img.style.transform = `scale(${this.scale})`
    },
    down(e) {
      const img = this.$refs.img
      if (e.touches) {
        e = e.touches[0]
      }
      this.start = {
        x: e.clientX,
        y: e.clientY
      }
      this.startDom = {
        x: parseInt(img.style.left.replace('px', '')) || 0,
        y: parseInt(img.style.top.replace('px', '')) || 0
      }
      this.canMove = true
    },
    move(e) {
      if (!this.canMove) {
        return
      }

      if (e.touches) {
        e.preventDefault()
        e = e.touches[0]
      }

      const img = this.$refs.img

      const distanceX = e.clientX - this.start.x
      const distanceY = e.clientY - this.start.y

      img.style.left = this.startDom.x + distanceX + 'px'
      img.style.top = this.startDom.y + distanceY + 'px'
    },
    up(e) {
      this.canMove = false
    }
  },
  destroy() {
    this.$refs.imgBox.removeEventListener('DOMMouseScroll', this.wheel, false)
  },
  async beforeMount() {
    this.simple = await this.$lf.getItem('reading-type')
  },
  mounted() {
    this.$refs.imgBox.addEventListener('DOMMouseScroll', this.wheel, false)
    this.searchCollection()
  }
}
</script>

<style lang="stylus" scoped>

.photo-box
  position fixed
  z-index 99
  left 0
  right 0
  bottom 0
  top 0
  display flex
  justify-content center
  align-items center
  .controll-bar
    position fixed
    top 0
    left 0
    right 0
    height 4rem
    background #000
    color #fff
    z-index 5
    display flex
    justify-content flex-end
    align-items: center
    div
      display flex
      align-items center
      user-select: none;
      font-size .9rem
      padding 1.5rem
      font-weight 300
      cursor pointer
      i
        font-size 1.1rem
        margin-right .5rem
      &:hover
        background #232323

  img
    z-index 2
    max-width 100vw
    max-height 100vh
    position relative
    user-select none
  &::after
    background rgba(0,0,0, .95)
    z-index -1
    position absolute
    filter: grayscale(50%)
    left 0
    right 0
    top 0
    bottom 0
    content: ' '

.reply-button
  border none
  outline none
  color #fff
  font-size 0.8rem
  padding .7rem 1rem
  margin-left 1.5rem
  cursor pointer
  border-radius 2px
  display inline-block
.reading-count,
.reply-count
  float left
  margin-left 20px
  span
    display block
    text-align center
    font-size 1rem
    color rgba(34, 52, 88, .451)
    &:first-child
      margin-bottom .4rem
    &.count ~ span
      font-size .7rem
.post-infomation
  background #fff
  padding 1rem
  margin-top 15px
  display flex
  justify-content: space-between
  align-items: center
  .tag-list
    margin-top 0
    .time
      font-size .8rem
      margin-left .5rem
      color rgba(34, 52, 88, .451)
.comments .reading
  padding 0
  font-size 14px
  p
    padding 0
    margin-bottom 1rem
.comments
  margin-top 15px
  margin-bottom 15px
.block-3
  display flex
  background #fff
  margin-top 15px
  justify-content: space-between

.block-btn
  background #fff
  display block
  padding: 1rem 1rem
  cursor pointer
  color #49a8fc
  i
    padding-right .5rem
  &:hover
    box-shadow 3px 5px 20px 0px rgba(138, 214, 255, 0.06)

@media ( max-width: 950px ) and (min-width: 768px )
  .author-info .top
    flex-direction column
  .circle
    margin-bottom: 1rem
  .designation
    margin .5rem 0
    position: relative
    top: -2px
  .right .top.username
    display block


@media ( max-width: 768px )
  .post-infomation
    display block
    .count-wrap
      margin-top 20px
      overflow hidden
      div
        float right
    button
      float left
      margin-left 0

  .controll-bar span
    display none
  .better .columns .is-9
    width 100%
    margin 0
  .columns
    .is-3
    .is-9
      width 100%
  .is-3
    order 0
    *
      position static !important
  .is-9
    order 1
    .post
      padding 1rem .5rem
      .post-title
        line-height 1.4
        margin 1.5rem 0 .5rem
        &::before
          display none
      p
        padding 0
      & > .reading
        padding .5rem
        left 0
        border-left none
        h1,
        h2,
        h3,
        h4,
        h5,
        h6
          &::before
            display none

  .columns
    flex-direction: column

.change-reading-type
  position absolute
  right 10px
  top 10px
  border: none
  font-size: .7rem
  padding: .5rem
  color: #22345873
  outline none
  cursor pointer
  transition all .5s
  background transparent
  &:hover
    color #fff
    background #1c2e51

.better
  .columns
    overflow hidden
  .is-3
    opacity 0
    position absolute
    *
      opacity 0
      display none
      min-width max-content
      overflow hidden
  .is-9
    width 70%
    // margin 2rem auto
    // position relative
    margin 1rem 0 1rem 15%
    // margin-left -10%
  .comments .item .left-comment
    opacity 0
    width 0
  .comment-username
    color #e6e6e6
  .comment-info
    .time,
    .designation
      display none

.columns
 .is-3
 .is-9
    transition all .8s
.desc
  margin-top 1rem
  font-size .9rem
  line-height 1.4
.author-info > .top
  display flex
  align-items center
.right
  display flex
  flex-direction: column
  height: 50px
  justify-content: space-around
.top.username
  display flex
  align-items center
.designation
  font-size .7rem
  padding 3px
  color #7773f7
  margin-left .5rem
.tag-list
  margin-top 5px
.tag
  font-size .7rem
  background #eee
  color #fff
  padding 3px 6px
  margin-right 5px
  border-radius 2px
  margin-bottom 2px
.author-info
  background #fff
  padding 1rem
  margin-top 20px
.circle
  width 48px
  height 48px
  margin-right 1rem
  & img
    height 48px
    width 48px
    border-radius 50%
    object-fit cover

.is-9
  margin-top: 20px
  margin-right 1rem
  box-sizing border-box
  position relative
  .post
    padding: 1rem
    background #fff
.is-3
  width 25%
  margin-left auto
  position: sticky
  top: 0
  height: max-content

.category
  font-size .9rem
  line-height .9rem
  margin-bottom .5rem
  display flex
  align-items center
.reactangle
  font-size 0
  line-height .9rem
  height 12px
  width 12px
  background red
  margin-right .5rem
  display inline-block
.post-title
  font-size: 1.4rem
  margin 1rem 0 0
  display flex
  align-items center
  &::before
    content: 'title'
    padding: .3rem .5rem
    font-size .7rem
    background #1c2e511f
    color #fff
    text-transform: uppercase
    position: relative
    left: -11px
    display inline-block
.post > .reading
  padding 1.5rem 20px
  border-left 1px solid #1c2e511f
  position relative
  left .7rem
  img
    cursor pointer
.columns
  min-height: calc(100vh - 300px)
</style>
