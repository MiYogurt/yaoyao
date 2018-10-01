<template>
  <div>
    <tip/>
    <nuxt/>
  </div>
</template>

<script>
import Tip from '~/components/Tip.vue'
export default {
  components: {
    Tip
  }
}
</script>

<style lang="stylus">
.container {
  max-width: 1440px;
  margin: 0 auto;
}
</style>
