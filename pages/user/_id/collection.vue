<template>
  <div>
    <post-item v-for="post in posts" :key="post.objectId" :id="post.objectId" :title="post.title" :color="post.category.color" :category="post.category.name" :replayCount="post.comments.length || 0" :readCount="post.view" :time="new Date(post.lastupdate.iso)" />
    <div class="none" v-if="!posts.length">还没有任何收藏</div>
    <div class="wrap" v-if="all > page">
      <a class="button primary" @click="loadMore">载入更多</a>
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
    loadMore(){
      this.page++
      this.fetch()
    },
    async countPage(){
      const PostModel = this.$parse.Object.extend('PostCollection')
      const PostQuery = new this.$parse.Query(PostModel)
      PostQuery.equalTo('who', this.User())
      const count = await PostQuery.count()
      this.all = Math.ceil(count / this.page_size)
    },
    User(){
      return this.$parse.User.createWithoutData(this.$route.params.id)
    },
    async fetch(){
      const page_size = this.page_size
      const PostModel = this.$parse.Object.extend('PostCollection')
      const PostQuery = new this.$parse.Query(PostModel)
      PostQuery.equalTo('who', this.User())
      PostQuery.include('post')
      PostQuery.limit(page_size)
      PostQuery.skip(page_size * (this.page - 1))
      let posts = (await PostQuery.find())
      posts = posts.map(toJSON).map(t => t.post)
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
