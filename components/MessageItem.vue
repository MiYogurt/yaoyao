<template>
  <div class="message">
    <div class="read-btn" @click="setRead" v-if="!read">
      未读
      <div class="tip">点击已读</div>
    </div>
    <div class="reply">
      <div class="line">
        <img :src="avatar" alt="" class="avatar">
        <nuxt-link :to="'/post/'+id" class="title" v-text="title"></nuxt-link>
        <span class="del-btn" @click="del"><i class="far fa-minus-square"></i></span>
      </div>
      <div class="info">
        <span class="circle" :class="{reply: type == 'comment', at: type == 'at', like: type == 'like'}"></span>
        <span class="time">{{ message.createdAt | ago }}</span>
        <span class="category">{{ message.from.username }}</span>
      </div>
      <div class="content" v-html="text">
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ['message', 'index'],
  data(){
    return {
      read: this.message.read
    }
  },
  computed:{
    avatar(){
      return process.env.cdnUrl + this.message.from.avatar
    },
    type(){
      return this.message.type
    },
    meta(){
      const meta = this.message[this.type]
      return meta
    },
    id(){
      return this.meta.post_id;
    },
    title(){
      return this.meta.title
    },
    text(){
      if (this.type == 'comment') {
        return this.meta.comment
      }
      return  ''
    },
  },
  methods: {
    msg(){
      return this.$parse.Object.fromJSON({
        className: 'Message',
        ...this.message
      })
    },
    async setRead(){
      console.log("read");
      let msg = this.msg()
      msg.set('read', true)
      await msg.save()
      this.read = true
      this.msg_success('操作成功', '已成功设为已读')
    },
    async del(){
      window.checkTip && window.checkTip('error','删除消息', '是否确认删除该消息', async (bool) => {
        if(!bool) {return}
        let msg = this.msg()
        await msg.destroy()
        this.$emit('del', this.index)
        this.msg_success('操作成功', '已成功删除')
      })

    }
  }
}
</script>

<style lang="stylus" scoped>

.del-btn {
  margin-left auto
  cursor pointer
  &:hover {
    color #49a8fc
  }
}

.message {
  margin-top: 2.5rem
  border-bottom: 1px solid #f8faff;
  padding-bottom: 1rem;
  &:first-of-type{
    margin-top: 0
  }
}

.tip {
  position: absolute
  top 50px
  background #333
  width 70px
  height 40px
  left: -15px
  font-size .6rem
  transition all .2s
  opacity 0
  z-index: 1
  &:after {
    content: ''
    background transparent
    border-left 5px solid transparent
    border-right 5px solid transparent
    border-top 5px solid transparent
    border-bottom 5px solid #333
    top: -10px;
    position: absolute;
    left: 30px;
  }
}

.avatar{
  width: 18px
  height 18px
  border-radius 25%
  margin-right 1rem
}
.line {
  display: flex;
}
.read-btn {
  float left
  width 40px
  height 40px
  background #e91e63
  line-height 40px
  text-align center
  font-size .7rem
  color #fff
  margin-right 1rem
  border-radius 5px
  cursor pointer
  position relative
  &:hover {
    background #ec4e84

    .tip {
      opacity: 1;
    }
  }
}
.title {
  color #51678f

  &:hover {
    color #2a5094
  }

  &:visited {
    color: #b4b8bf
  }
}
.content {
  margin-top: 1rem;
  font-size .9rem
  color #3c3c3c
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  max-height: 300px
}

.info {
  font-size .7rem
  margin-top 1rem
  display flex
  align-items center
  span {
    margin-right: 1rem
  }
}
.unread {
  color: #e91e63;
}
.readed {
  color: #009688;
}

</style>

<style>
.message .reading {
  padding: 0;
}
.message .reading .p {
  padding: 0;
}
</style>
