<template>
  <div class="post-item">
    <nuxt-link :to="'/post/' + id" class="title">{{ title }}</nuxt-link>
    <div class="info">
      <div class="category"><span class="circle" :style="{background: color}"></span>{{ category }}</div>
      <div class="replay-count">{{ replayCount }}</div>
      <div class="read-count">{{ readCount }}</div>
      <div class="time-ago">{{ formate(time) }}</div>
    </div>

  </div>
</template>

<script>
export default {
  name: 'PostItem',
  props: ['title', 'category', 'replayCount', 'readCount', 'time', 'color', 'id'],
  methods: {
    formate(date) {
      console.log(date)
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

.post-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #51678f;
  padding: 1.5rem 0;
  border-top: 1px solid #f8faff;
  // &:last-of-type {
  //   border-bottom: 1px solid #f8faff;
  // }
  &:first-of-type {
    border-top: none;
  }
  @media (max-width: 682px) {
    display: block
  }
}

.title {
  display: block
  width 50%
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
  width 50%
  display flex
  justify-content: space-between
  @media (max-width: 682px) {
    width: 100%;
    margin-top 1rem
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

.replay-count,
.read-count {
  width: 60px;
  font-size: .8rem;
}

.time-ago {
  width: 90px;
  font-size: .8rem;
}

.category{
  width: 120px
  font-size: .8rem;
}
</style>
