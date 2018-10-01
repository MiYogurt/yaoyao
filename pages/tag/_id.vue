<template>
  <div class="wrap">
    <section class="container">
      <div class="columns">
        <div class="column is-9 post-list-group">
          <router-link to="/post/new" class="primary button" v-if="username.length">新的讨论</router-link>
          <div class="light button exit-btn" v-if="username.length" @click="exit">退出登陆</div>
          <router-link to="/login" class="primary button" v-else>登录以发表</router-link>
          <hr>
          <h4 v-if="category">分类：{{category}}</h4>
          <h4 v-if="tag">标签：{{tag}}</h4>
          <div class="post-list">
            <index-post-item v-for="post in posts" :key="post.objectId" :post="post" />
          </div>
        </div>
        <div class="column is-3 right-list-group">
          <div class="category">
            <h3>分类</h3>
            <div class="category-list">
              <nuxt-link :to="{ path:'/' }" class="tag">所有</nuxt-link>
              <nuxt-link :to="{name:'category-id', params: {id: category.name}}" class="tag" v-for="category in categorys" :key="category.objectId">{{ category.name }}</nuxt-link>
            </div>
          </div>
          <div class="hot-tag">
            <h3>热门标签</h3>
            <div class="tag-list">
              <nuxt-link :to="{name:'tag-id', params: {id: tag.name}}" class="tag" v-for="tag in tags" :key="tag.objectId">{{ tag.name }}</nuxt-link>
            </div>
          </div>
        </div>
      </div>

    </section>
  </div>
</template>

<script>
import AppLogo from '~/components/AppLogo.vue'
import IndexPostItem from '~/components/IndexPostItem.vue'
import { mapState } from 'vuex'

const toJSON = t => t.toJSON()

export default {
  components: {
    AppLogo,
    IndexPostItem
  },
  async asyncData({app, query, params}){
    let { page = 1, tag, category, limit = 10 } = query
    tag = params.id
    const skipCount = (page - 1) * limit
    const Parse = require('create-api').default()
    const PostQuery = new Parse.Query(Parse.Object.extend('Post'))
    const TagQuery = new Parse.Query(Parse.Object.extend('Tag'))
    const CategoryQuery = new Parse.Query(Parse.Object.extend('Category'))
    PostQuery.include('tags')
    PostQuery.include('category')
    PostQuery.include('author')
    PostQuery.include('comments')
    PostQuery.descending('lastupdate')
    PostQuery.descending('createdAt')

    let post_count = await PostQuery.count();

    PostQuery.limit(limit)
    PostQuery.skip(skipCount)

    if (tag) {
      const innerTagQuery = new Parse.Query(Parse.Object.extend('Tag'))
      innerTagQuery.equalTo('name', tag)
      let mathedTag = await innerTagQuery.first()
      if (!mathedTag) { // 没有该 tag
        let tags = (await TagQuery.find()).map(toJSON)
        let categorys = (await CategoryQuery.find()).map(toJSON)
        return {
          posts: [],
          tags,
          tag,
          categorys,
          page: 1,
          all_page: 1
        }
      }
      PostQuery.matchesQuery('tags', innerTagQuery)
    }

    if (category) {
      const innerCategoryQuery = new Parse.Query(Parse.Object.extend('Category'))
      innerCategoryQuery.equalTo('name', category)
      let mathedCategory = await innerCategoryQuery.first()

      if (!mathedCategory) { // 没有该 category
        let tags = (await TagQuery.find()).map(toJSON)
        let categorys = (await CategoryQuery.find()).map(toJSON)
        return {
          posts: [],
          tags,
          categorys,
          page : 1,
          all_page: 1
        }
      }
      PostQuery.matchesQuery('category', innerCategoryQuery)
    }

    PostQuery.select('tags', 'category', 'title', 'comments','author','view','createdAt', 'lastupdate')
    let posts = (await PostQuery.find()).map(toJSON);
    let tags = (await TagQuery.find()).map(toJSON)
    let categorys = (await CategoryQuery.find()).map(toJSON)

    return {
      posts,
      tags,
      tag,
      category,
      categorys,
      page,
      all_page: Math.ceil(post_count / limit)
    }
  },
  async mounted(){
    if (!this.$parse.User.current()) {
      this.exit()
    }
  },
  data() {
    return {
    }
  },
  computed: mapState(['username']),
  methods: {
    fetchPosts(){
      const query = this.$model['Post'].query()
      query.include('tags')
      query.include('category')
      query.include('author')
      query.include('comments')
      return query.find()
    },
    fetchTags(){
      return this.$fetchBase('Tag')
    },
    exit() {
      ;['username', 'avatar', 'message_count', 'token'].forEach(
        this.$lf.removeItem
      )
      this.msg_success('操作成功', '已成功退出账户！')
      this.$store.commit('logout')
      this.$parse.User.logOut()
    }
  }
}
</script>

<style>
</style>

<style lang="stylus" scoped>
.exit-btn {
  margin-left: 1rem;
  cursor: pointer;
}

.wrap {
  background: #fff;
  padding: 2rem 0;
  border-top: 1px solid #eef5f7;
  border-bottom: 1px solid #eef5f7;
  min-height: calc(100vh - 300px);
}

@media (max-width: 768px) {
  .right-list-group {
    display: none;
  }

  .post-list-group.is-9 {
    width: 100%;
  }
}

.post-item {
  margin: 2rem 0;

  .title {
    margin: 0 0 8px 1rem;
    font-weight: normal;
    font-size: 18px;
    line-height: 1.2;
    display: block;
    color: #51678f;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;

    &:hover {
      color: #2a5094;
    }
  }
}

.info {
  margin-left: 12px;
  line-height: 1.5;
}

.post-tag-list {
  display: inline-block;
}

.time-ago, .author {
  font-size: 0.6rem;
  color: #15274969;

  a {
    color: #15274969;

    &:hover {
      color: #333;
    }
  }
}

.replay-count, .view-count {
  display: inline-flex;
  flex-direction: column;
  text-align: center;
  padding: 0 1rem;

  .count {
    padding-bottom: 0.5rem;

    & ~ span {
      font-size: 0.5rem;
    }
  }
}

.count-group {
  text-align: center;
  color: #15274969;
  margin-left: auto;
  display: flex;
  justify-content: flex-end;
}

.avatar {
  width: 48px;
  height: 48px;
  border-radius: 5px;
}

.post-list-group {
  padding-right: 2rem;
  box-sizing: border-box;
}

.category
.hot-tag {
  background: #fbfbfb;
  color: #51678f;
  padding: 0.5rem;
  border: 2px;

  margin-bottom 10px 

  h3 {
    font-size: 0.98rem;
    margin: 0.5rem 0.25rem;
  }
  .category-list
  .tag-list {
    display: flex;
    flex-wrap: wrap;
  }
}

.tag {
  background: #fdfdfd;
  padding: 0.5rem;
  color: #51678f;
  font-size: 0.7rem;
  white-space: nowrap;
  margin: 0.2rem;
  border-radius: 2px;
  border: 1px solid #eee;
  cursor: pointer;
  text-decoration: none;

  &:hover {
    background: linear-gradient(to right, #49a8fc 0%, #52c1ed 100%);
    color: #fff;
    border-color: #52c1ed;
  }

  .info & {
    font-size: 0.5rem;
    padding: 0.2rem 0.4rem;
    background: #eee;
    color: #15274969;
    border: none;
  }
}

.container {
  padding: 0 1rem;
}

h4 {
  font-weight: normal;
  color: rgba(21, 39, 73, 0.412);
  font-size: 0.9rem;
}

.button.primary {
  box-shadow: 9px 6px 15px 0 rgba(138, 214, 255, 0.1), -9px -6px 15px 0 rgba(138, 214, 255, 0.1);

  &:hover {
    box-shadow: 0 8px 15px 0 rgba(138, 214, 255, 0.3);
  }
}
</style>
