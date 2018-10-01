<template>
  <div class="hoverable" @mouseover="hover" @mouseout="leave">
    <slot/>
    <div class="content" :class="{'show': show }" :style="style">
      <slot name="content" />
    </div>
  </div>
</template>


<script>
export default {
  name: 'drop-down',
  props: ['width'],
  data() {
    return {
      show: false,
      style: { width: this.width, left: '-20px' }
    }
  },
  methods: {
    hover() {
      this.show = true
      this.$emit('hoverChange', true)
    },
    leave() {
      this.show = false
    }
  }
}
</script>

<style scoped>
.hoverable {
  position: relative;
  height: 100%;
}
.content {
  position: absolute;
  top: 100%;
  display: none;
  background: #fff;
  padding: 5px;
  text-align: center;
  box-shadow: 2px 2px 25px 0px #f7f5f5;
  z-index: 100;
}
.show {
  display: block;
}
</style>
