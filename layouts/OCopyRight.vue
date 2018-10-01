<template>
  <footer>
    <div class="wrapper container">
      <div class="left">
        <!-- <div>许可证号: 湘ICP备15015392号-3</div> -->
        <!-- <div>公安机关备案号: 43112902000009</div> -->
      </div>
      <div class="right">
        <a href="https://github.com/MiYogurt" target="_blank" rel="noopener noreferrer">🌀CopyRight Yugo &nbsp; <i class="fab fa-github"></i></a>
      </div>
    </div>
  </footer>
</template>

<style lang="stylus" scoped>

i
  font-size: 25px

.wrapper
  margin: 0 auto
  display: flex
  @media screen and (max-width: 768px)
    flex-direction: column
  .right
    margin-left auto
    text-align: center
    display: flex;
    align-items: center;
    @media screen and (max-width: 1080px)
      margin-left: 0
footer
  background: #f7fcff
  border-top 1px solid #f8faff
  padding: .5rem
  flex-direction: column
.footer-logo
  margin-bottom: 20px
div
  color: #122447
  font-size: .7rem
  padding: .2rem
a
  color: #122447
  border-bottom: #122447
</style>
