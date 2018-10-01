<template>
    <div class="item" v>
        <div class="left-comment">
            <div class="circle"><img :src="addCdnPath(comment.author.avatar)"></div>
        </div>
        <div class="right-comment">
            <div class="comment-info" :id="'replay-' + index">
                <nuxt-link :to="{name:'user-id', params: {id: comment.author.objectId}}" class="comment-username">{{ comment.author.username }}</nuxt-link>
                <!-- <span class="designation">论坛女皇</span> -->
                <span class="time">{{ comment.createdAt | ago }}</span>
                <span class="ops">
                    <i v-if="showops" class="far fa-trash-alt" @click="del"></i>
                    <i v-if="showops" class="fas fa-pencil-alt" @click="edit"></i>
                    <a :href="'#replay-' + index" class="anchor">#{{index}}</a>
                </span>
            </div>
            <div class="content reading" v-html="safe_html(comment.text)">
            </div>
        </div>
    </div>
</template>

<script>

export default {
    name: 'post-comment',
    props: ['comment', 'index'],
    mounted() {
        console.log(this.comment)
    },
    methods: {
        safe_html(text) {
            const xssfn = require('xss')
            return xssfn(text)
        },
        del(){
            window.checkTip && window.checkTip('error', '确认操作', '这将删除该评论，你确定吗？', (bool) => {
                if (bool) {
                    this.$emit('del')
                }
            })
            
        },
        edit(){
            this.$emit('edit')
        },
        addCdnPath(val){
            return process.env.cdnUrl + val
        }
    },
    data(){
        return {

        }
    },
    
    computed: {
        showops(){
            return this.comment.author.username == this.username || this.isAdministrator
        },
        username(){
            const user = this.$store.state.username
            if (user) {
                return user
            }
            return ''
        },
        isAdministrator(){
            this.$store.state.isAdmin
        }
    }
}
</script>

<style lang="stylus">
.right-comment .reading p
  padding 0
</style>

<style lang="stylus" scoped>

@media ( max-width: 950px ) and (min-width: 768px )
  .circle
    margin-bottom: 1rem
  .designation
    margin .5rem 0
    position: relative
    top: -2px
  .right .top.username
    display block

@media ( max-width: 768px )
   .left-comment
     display none
   .better .columns .is-9
     width 100%
     margin 0
   div
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
.item
    background #fff
    padding 1rem
    transition all .2
    display flex
    border-bottom 1px solid #f8faff
    .right-comment
        flex-grow 1
        max-width 100%
        
.comment-info
  display flex
  margin-bottom .5rem
  .time
    font-size .7rem
    line-height: 1.5
    color rgba(34, 52, 88, .451)
  .designation
    background #eee
    border-radius 10px
    margin 0 .5rem
    font-size .7rem
    padding 0.2rem 0.4rem
    background #49a8fc
    color #fff
    display block
  .ops
    margin-left auto
    i
        cursor pointer
        font-size .7em
        margin-right 10px
        color rgba(34, 52, 88, .451)
        &:hover
            color #333
  .anchor
    color rgba(34, 52, 88, .451)
    font-size .7rem

.reading
    padding 0
    *
        max-width 100%
.circle
  width 48px
  height 48px
  margin-right 1rem
  & img
    border-radius 50%
    height 48px
    width 48px
    object-fit cover


.comment-username
  display block
  color #1c2e51
  font-weight 900
  margin-right 10px
  &:hover
    color #1c2e51
</style>

