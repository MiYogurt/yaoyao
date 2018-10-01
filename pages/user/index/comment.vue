<template>
  <div>
    <comment-item v-if="comments.length" v-for="comment in comments" :replay_index="findIndex(comment, comment.post.comments)" :id="comment.post.objectId" :key="comment.objectId" :title="comment.post.title" :color="comment.post.category.color" :category="comment.post.category.name" :content="comment.text" :time="new Date(comment.createdAt)" />
    <div class="wrap">
      <a class="button primary" v-if="all > page" @click="loadMore">载入更多</a>
    </div>
    <div class="none" v-if="comments.length == 0">
      没有任何评论
    </div>
  </div>
</template>

<script>
import CommentItem from '@/components/CommentItem.vue'
const toJSON = t => t.toJSON()
export default {
  components: {
    CommentItem
  },
  data() {
    return {
      page_size: 10,
      page: 1,
      all: 1,
      comments: []
    }
  },
  methods: {
    loadMore(){
      this.page++
      this.fetch()
    },
    findIndex(i , arr){
      console.log(i, arr);
      return arr.findIndex(a => a.objectId == i.objectId) + 1
    },

    async countPage(){
      const CommentModel = this.$parse.Object.extend('Comment')
      const CommentQuery = new this.$parse.Query(CommentModel)
      const user = this.$parse.User.current()
      CommentQuery.equalTo('author', user)
      const count = await CommentQuery.count()
      this.all = Math.ceil(count / this.page_size)
    },

    async fetch(){
      const page_size = this.page_size
      const user = this.$parse.User.current()
      const CommentModel = this.$parse.Object.extend('Comment')
      const CommentQuery = new this.$parse.Query(CommentModel)
      CommentQuery.equalTo('author', user)
      CommentQuery.includeAll()
      CommentQuery.limit(page_size)
      CommentQuery.skip(page_size * (this.page - 1))
      let comments = (await CommentQuery.find())
      comments = await Promise.all(comments.map(async (v) => {
        let json = toJSON(v)
        json.post = toJSON(await v.get('post').fetchWithInclude(['category', 'comments']))
        return json
      }))
      if (this.comments.length == 0) {
        this.comments = comments
      }else {
        this.comments = this.comments.concat(comments)
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
