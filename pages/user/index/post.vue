<template>
  <div>
    <post-item v-for="post in posts" :key="post.objectId" :id="post.objectId" :title="post.title" :color="post.category.color" :category="post.category.name" :replayCount="getCount(post)" :readCount="post.view" :time="new Date(post.lastupdate.iso)" />
    <div class="wrap">
      <a class="button primary" v-if="all > page" @click="loadMore">载入更多</a>
    </div>
    <div class="none" v-if="posts.length == 0">
      没有任何文章
    </div>
  </div>
</template>

<script>
import PostItem from '@/components/PostItem.vue'
const toJSON = t => t.toJSON()
export default {
  components: {
    PostItem
  },
  data() {
    return {
      page_size: 10,
      page: 1,
      all: 1,
      posts: []
    }
  },
  methods: {
    getCount(post) {
      if (!post.comments) {
        return 0
      }
      return post.comments.length
    },
    loadMore(){
      this.page++
      this.fetch()
    },
    async countPage(){
      const PostModel = this.$parse.Object.extend('Post')
      const PostQuery = new this.$parse.Query(PostModel)
      const user = this.$parse.User.current()
      PostQuery.equalTo('author', user)
      const count = await PostQuery.count()
      this.all = Math.ceil(count / this.page_size)
    },

    async fetch(){
      const page_size = this.page_size
      const user = this.$parse.User.current()
      const PostModel = this.$parse.Object.extend('Post')
      const PostQuery = new this.$parse.Query(PostModel)
      PostQuery.equalTo('author', user)
      PostQuery.include('comments')
      PostQuery.include('category')
      PostQuery.limit(page_size)
      PostQuery.skip(page_size * (this.page - 1))
      let posts = (await PostQuery.find())
      posts = posts.map(toJSON)
      if (this.posts.length == 0) {
        this.posts = posts
      }else {
        this.posts = this.posts.concat(posts)
      }
    }
  },
  mounted() {
    this.countPage()
    this.fetch()
  },
}
</script>

<style lang="stylus" scoped>
.wrap {
  text-align center
  margin-top 1rem
  .button {
    cursor pointer
  }
}
</style>
