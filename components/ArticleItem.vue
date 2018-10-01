<template>
  <div class="article">
    <img :src="img">
    <div class="detail">
      <nuxt-link to="/" class="title">{{ title }}</nuxt-link>
      <p class="desc" v-html="desc"></p>
      <div class="info">
        <nuxt-link class="author" to="/">{{author}}</nuxt-link>
        <span class="commentCount"><i class="fas fa-comment-alt"></i>{{ commentCount }}</span>
        <span class="likeCount"><i class="fas fa-heart"></i>{{ likeCount }}</span>
        <span class="time"><i class="fas fa-clock"></i>{{ time }}</span>
        <span class="category"><i class="fas fa-bookmark"></i>{{ category }}</span>
      </div>
    </div>
  </div>

</template>

<script>
export default {
  props: [
    'author',
    'commentCount',
    'title',
    'likeCount',
    'time',
    'category',
    'img',
    'desc'
  ]
}
</script>

<style lang="stylus" scoped>
.article
  padding: 2rem 0;
  padding-top .5rem
  &:first-of-type
    border-top none
.detail,
.author
  color #b4b8bf
.author:hover
  color #6190e8
.title
  display block
  font-size 1.1rem
  margin-bottom .5rem
  line-height 1.5
  color #51678f
  &:hover
    color #2a5094
.desc
  line-height 1.9
  font-size .8rem
  color #b4b8bf
img
  float right
  height 100px
  width 125px
  border-radius 2px
  margin-left 1rem
  object-fit cover
  margin-top .3rem
  margin-bottom .3rem
  @media (max-width 500px)
    display none
.info
  font-size .7rem
  margin-top 1rem

i
  margin-right .3rem
  margin-left 1rem
</style>
