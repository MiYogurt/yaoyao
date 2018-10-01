<template>
  <transition name="fade">
    <div class="tip-warp" :class="tip.type" v-show="tip.body.length">
      <div class="content">
        <div class="title">{{ tip.title }}</div>
        <div class="body">{{ tip.body }}</div>
      </div>
      <div class="opts" v-show="tip.body.length">
          <div class="btn" @click="trigger(true, $event)">确定</div>
          <div class="btn" @click="trigger(false, $event)">取消</div>
      </div>
    </div>
  </transition>
</template>

<script>
import { mapState } from 'vuex'
export default {
  name: 'CheckTip',
  data(){
      return {
          tip: {
              type: '',
              title: '',
              body: '',
          }
      }
  },
  methods: {
      trigger(bool, e){
          this.callback && this.callback(bool, e)
          this.tip = {
              title: '',
              body: '',
          }
      }
  },
  mounted(){
      window.checkTip = (type, title, body , callback) => {
          this.tip.title = title
          this.tip.body = body
          this.tip.type = type
          this.callback = callback
      }
  }
}
</script>

<style lang="stylus" scoped>
.tip-warp {
  position: fixed;
  top: 20px;
  width: 400px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 9999;
  display: flex;
}

.content {
    width 80%
    padding: 20px 20px;
    word-break: break-all;
}

.opts {
    width 20%
}

.btn {
    cursor pointer
    font-size .7rem
    text-align center
    height 50%
    display: flex;
    align-items: center;
    justify-content: center;
    
    &:nth-of-type(1){
        background #334875
    }
    &:nth-of-type(2){
        background #334875
    }
    &:hover {
        background #49a8fc
    }
}

.title {
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
}
.body {
  font-size: 0.8rem;
}

.error {
  background: #2b3d62;
  color: #fff;
}

.success {
  background: #49a8fc;
  color: #fff;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
</style>
