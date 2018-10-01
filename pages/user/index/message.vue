<template>
  <div class="wrap">
    <div class="info" v-if="messages.length">
      <div class="type">
        <span class="circle reply"></span> 回复
      </div>
      <div class="type">
        <span class="circle like"></span> 赞
      </div>
      <div class="type">
        <span class="circle at"></span> 点名
      </div>

      <div class="type del-type-btn" @click="delAll">
        <i class="far fa-minus-square"></i>
        删除全部
      </div>
    </div>

    <div class="message-list">
      <message-item v-for="(msg, index) in messages" :key="msg.objectId" :message="msg" @del="del" :index="index" />
    </div>

    <div class="none" v-if="messages.length == 0">
      没有任何消息
    </div>
  </div>

</template>

<script>
import MessageItem from '@/components/MessageItem.vue'
export default {
  components: {
    MessageItem
  },
  data(){
    return {
      messages: []
    }
  },
  methods: {
    async fetch(){
      let mq = this.$model['Message'].query()
      mq.equalTo('to', this.$parse.User.current())
      mq.include(['from'])
      let messages = await mq.find()
      this.messages = messages.map(m => m.toJSON())
    },
    del(index) {
      this.messages.splice(index, 1)
    },
    async delAll(){
      window.checkTip && window.checkTip('error', '删除所有消息', '确认吗？', async (bool) => {
        if (!bool) {
          return
        }

        const restore = json => this.$parse.Object.fromJSON({
          className: 'Message',
          ...json
        })

        await Promise.all(
          this.messages.map(restore).map(async m => {
            m.destroy()
          })
        )
        this.msg_success('操作成功', '已全部删除')
        this.messages = []
      })

    }
  },
  mounted() {
    this.fetch()
  },
}
</script>

<style lang="stylus" scoped>
.none{
  color #d8d8d8
  height 200px
  display flex 
  justify-content center
  align-items center
  font-size 2rem
}

.circle {
  margin-right: .2rem
  position relative
  top 2px
}
.info {
  margin-bottom: 2rem
  font-size .8rem
  .type {
    display: inline-block
    margin-right: 2rem
  }
}
.del-type-btn {
  border 1px solid transparent
  cursor pointer
  padding 2px 5px
  &:hover {
    border 1px solid
  }
}
</style>

<style lang="stylus">
  .circle {
    width: 13px
    height: 13px
    background #333
    border-radius 50%
    display: inline-block
  &.reply {
    background #FFC107
  }
  &.at {
    background #3f51b5
  }

  &.like {
    background #2196f3
  }
}
</style>
