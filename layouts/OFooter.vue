<template>
  <footer>
    <img class="footer-logo" src="~assets/logo.png" width="45" height="45">
    <div class="center">
      <nuxt-link to="/about">关于我们</nuxt-link>
      <nuxt-link to="/about">联系我们</nuxt-link>
      <nuxt-link :to="{path:'/',query: {category: '意见反馈'}}">意见反馈</nuxt-link>
    </div>
  </footer>
</template>

<style lang="stylus" scoped>
link-color = #1D1D1F
hover-color = #6190E8
footer
  display: flex
  background: #fff
  padding: 2rem
  align-items: center
  flex-direction: column
.footer-logo
  margin-bottom: 20px
a
  color: link-color
  font-size: .8rem
  display: inline-block
  padding: .5rem 1rem
  &:hover
    color: hover-color
</style>
