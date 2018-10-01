<template>
  <div class="comment-item">
    <div class="wrap">
      <nuxt-link :to="{path: '/post/' + id + '#' + 'replay-' +  replay_index}" class="title">{{ title }}</nuxt-link>
      <div class="info">
        <div class="category"><span class="circle" :style="{background: color}"></span>{{ category }}</div>
        <div class="time-ago">{{ formate(time) }}</div>
      </div>

    </div>
    <div class="reading" v-html="content">
    </div>
  </div>
</template>

<script>
export default {
  name: 'CommentItem',
  props: ['title', 'category', 'content', 'time', 'color', 'id', 'replay_index'],
  methods: {
    formate(date) {
      if (typeof date === 'undefined') {
        return ''
      } else {
        return (
          date
            .getFullYear()
            .toString()
            .substr(2) +
          ' 年 ' +
          (date.getMonth() + 1) +
          ' 月'
        )
      }
    }
  }
}
</script>

<style lang="stylus" scoped>

.comment-item {
  display: flex;
  justify-content: space-between;
  color: #51678f;
  padding: 1.5rem 0;
  border-top: 1px solid #f8faff;
  flex-direction: column
  // &:last-of-type {
  //   border-bottom: 1px solid #f8faff;
  // }
  &:first-of-type {
    border-top: none;
  }

}

.wrap {
  display: flex;
  align-itesm: center
 @media (max-width: 682px) {
    display: block
  }
}

.title {
  display: block
  overflow hidden
  text-overflow: ellipsis
  white-space: nowrap
  color #51678f
  &:visited {
    color: #b4b8bf
  }
  &:hover {
      color: #2a5094
  }
  @media (max-width: 682px) {
    width: 100%;
  }
}

.info {
  margin-left: auto;
  display flex
  justify-content: space-between
  align-items: center
  @media (max-width: 682px) {
    width: 100%;
    margin-top 1rem
    justify-content: flex-start
    .category {
      width max-content
      margin-right 1rem
    }
  }
}

.circle {
  width 12px
  height 12px
  border-radius 50%
  display inline-block
  line-height 1.2
  position: relative
  top: 2px
  margin-right: .5rem
}


.time-ago {
  width: 90px;
  font-size: .8rem;
  line-height: 15px;
}

.category{
  width: 120px
  font-size: .8rem;
}

.reading {
  line-height: 1.6
  padding: 1rem 0
  max-height: 40px
  overflow: hidden
  font-size: .89rem
  white-space: nowrap
  text-overflow: ellipsis
  color #3c3c3c
}


</style>

<style>
.comment-item .reading p {
  padding: 0;
}
</style>
