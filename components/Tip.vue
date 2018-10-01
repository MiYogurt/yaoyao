<template>
  <transition name="fade">
    <div class="tip-warp" :class="tip.type" v-show="tip.body.length">
      <div class="title">{{ tip.title }}</div>
      <div class="body">{{ tip.body }}</div>
    </div>
  </transition>
</template>

<script>
import { mapState } from 'vuex'
export default {
  name: 'Tip',
  computed: mapState(['tip'])
}
</script>

<style scoped>
.tip-warp {
  position: fixed;
  top: 20px;
  width: 400px;
  left: 50%;
  transform: translateX(-50%);
  padding: 20px 20px;
  z-index: 9999;
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
