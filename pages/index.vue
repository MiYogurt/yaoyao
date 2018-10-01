<template>
  <div class="wrap">
    <section class="container">
      <div class="columns">
        <div class="column is-9 post-list-group">
          <router-link to="/post/new" class="primary button" v-if="username.length">新的讨论</router-link>
          <div class="light button exit-btn" v-if="username.length" @click="exit">退出登录</div>
          <router-link to="/login" class="primary button" v-else>登录以发表</router-link>
          <hr>
          
          <h4 v-if="category">分类：{{category}} <i v-if="isAdmin" class="fas fa-minus-circle click" @click="delTagOrCategory"></i> </h4>
          <h4 v-else-if="tag">标签：{{tag}} <i v-if="isAdmin" class="fas fa-minus-circle click" @click="delTagOrCategory"></i> </h4>
          <h4 v-else>所有</h4>
            
          <div class="post-list" v-if="posts.length">
            <index-post-item v-for="post in posts" :key="post.objectId" :post="post" />
          </div>

          <div v-else class="none-list">
            当前节点还没有任何内容
          </div>

          <hr/>
          <div class="page-operator">
            <a @click="prevPage" v-if="page > 1" class="primary button"> <i class="fas fa-caret-left"></i> </a>
            <a @click="nextPage" v-if="page < all_page" class="primary button"> <i class="fas fa-caret-right"></i> </a>
            <div class="select-page" v-show="all_page!=1"><f-select @change="changePage" v-model="bindingPage" :value="Array.from({length: all_page}, (_,i) => ({name: '第 ' + (i + 1) + ' 页', id: (i + 1)}))"></f-select></div>
            <div class="all-page-box">共 {{ all_page }} 页</div>
          </div>
          
        </div>
        <div class="column is-3 right-list-group">
          <div class="category">
            <h3>分类</h3>
            <div class="category-list">
              <nuxt-link :to="{ path:'/' }" class="tag">所有</nuxt-link>
              <nuxt-link :to="{name:'index', query: {category: category.name}}" class="tag" v-for="category in categorys" :key="category.objectId">{{ category.name }}</nuxt-link>
              <span class="tag" v-if="isAdmin" @click="addCategory"><i class="fas fa-plus-circle"></i></span>
            </div>
          </div>
          <div class="hot-tag">
            <h3>热门标签</h3>
            <div class="tag-list">
              <nuxt-link :to="{name:'index', query: {tag: tag.name}}" class="tag" v-for="tag in tags" :key="tag.objectId">{{ tag.name }}</nuxt-link>
              <span class="tag" v-if="isAdmin" @click="addTag"><i class="fas fa-plus-circle"></i></span>
            </div>
          </div>
        </div>
      </div>
      <div class="category-tag-wrap" v-if="isAdmin" v-show="open">
        <div class="box">
          <f-input v-model="text" label="内容"></f-input>
          <f-input v-model="color" label="颜色"></f-input>
          <f-input v-model="background" label="背景"></f-input>
          <a class="button primary" @click="submit">确认</a>
          <a class="button" @click="close">关闭</a>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import AppLogo from '~/components/AppLogo.vue'
import IndexPostItem from '~/components/IndexPostItem.vue'
import { mapState } from 'vuex'
import FSelect from '~/components/form/Select.vue';
import FInput from '~/components/form/Input.vue';

const toJSON = t => t.toJSON()

export default {
  components: {
    AppLogo,
    FInput,
    IndexPostItem,
    FSelect
  },
  head(){
    return {
      title: '就爱瑶族'
    }
  },
  async asyncData({app, query}){
    const { page = 1, tag = null, category = null, limit = 10, search = null } = query
    const skipCount = (page - 1) * limit
    const Parse = require('create-api').default()
    const PostQuery = new Parse.Query(Parse.Object.extend('Post'))
    const TagQuery = new Parse.Query(Parse.Object.extend('Tag'))
    const CategoryQuery = new Parse.Query(Parse.Object.extend('Category'))

    PostQuery.include('tags')
    PostQuery.include('category')
    PostQuery.include('author')
    PostQuery.include('comments')
    PostQuery.descending(['top', 'lastupdate', 'createdAt'])

    if(search) {
      PostQuery.fullText('title', search);
    }


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
          category,
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
          tag,
          category,
          categorys,
          page : 1,
          all_page: 1
        }
      }
      PostQuery.matchesQuery('category', innerCategoryQuery)
    }

    PostQuery.select('tags', 'category', 'title', 'comments','author','view','createdAt', 'lastupdate', 'top')
    let posts = (await PostQuery.find()).map(toJSON);
    let tags = (await TagQuery.find()).map(toJSON)
    let categorys = (await CategoryQuery.find()).map(toJSON)
    let post_count = await PostQuery.count();

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
    
  },
  data() {
    return {
      bindingPage: {
        name: `第 ${this.$route.query.page || 1} 页`
      },
      text: '文字',
      color: '#fff',
      background: '#000',
      isCategory: false,
      isTag: false,
    }
  },
  computed: {
    open(){
      return this.isCategory || this.isTag
    },
    ...mapState(['username', 'isAdmin'])
  },
  watch: {
    '$route.query': function(newValue) {
      this.category = this.tag = ''
      this.fetch()
    }
  },
  methods: {
    addCategory(){
      this.isCategory = true
    },
    addTag(){
      this.isTag = true
    },
    close(){
      this.isTag = false
      this.isCategory = false
    },
    async delTagOrCategory(){
      if (this.category) {
        let cq = this.$model['Category'].query()
        cq.equalTo('name', this.category)
        let instance = await cq.first()
        if (instance) {
          let name = instance.get('name')
          window.checkTip && window.checkTip('error',`删除分类：${name} 吗`,'确认吗？', async (bool) => {
            if(!bool){return}
            let delIndex = this.categorys.findIndex(category => category.objectId == instance.id)
            this.categorys.splice(delIndex, 1)
            await instance.destroy()
            this.msg_success('操作成功', `删除分类：${name} 成功`)
            this.$router.push('/')
          })
        }
      }else if (this.tag) {
        let tq = this.$model['Tag'].query()
        tq.equalTo('name', this.tag)
        let instance = await tq.first()
        if (instance) {
          let name = instance.get('name')
          window.checkTip && window.checkTip('error',`删除标签：${name} 吗`,'确认吗？', async (bool) => {
            if(!bool){return}
            let delIndex = this.tags.findIndex(tag => tag.objectId == instance.id)
            this.tags.splice(delIndex, 1)
            await instance.destroy()
            this.msg_success('操作成功', `删除标签：${name} 成功`)
            this.$router.push('/')
          })
        }
      }
    },
    async submit(){
      if (this.isTag) {
        const tag = new this.$model['Tag']
        tag.set('color', this.color)
        tag.set('name', this.text)
        tag.set('background', this.background)
        await tag.save()
        this.msg_success('操作成功', '添加 tag 成功')
        this.tags.unshift(tag.toJSON())
      }
      else if (this.isCategory) {
        const category = new this.$model['Category']
        category.set('color', this.color)
        category.set('name', this.text)
        await category.save()
        this.msg_success('操作成功', '添加 Category 成功')
        this.categorys.unshift(category.toJSON())
      }
      this.close()
    },
    changeRoute(){
      this.bindingPage = {id: this.page, name: '第 ' + this.page + ' 页'}
      this.$router.push({name: 'index', query: {
        ...this.$route.query,
        page: this.page,
      }})
    },
    prevPage(){
      if (this.page <= 1) {
        this.page = 1
        return this.msg_error('操作错误', '已是第一页了')
      }
      this.page = this.page - 1
      this.$nextTick(() => {
        this.changeRoute()
      })
    },
    nextPage(){
      if (this.page >= this.all_page) {
        this.page = this.all_page
        return this.msg_error('操作错误', '已是最后一页了')
      }
      this.page = this.page + 1
      this.$nextTick(() => {
        this.changeRoute()
      })
    },
    changePage({id}){
      this.page = id
      this.changeRoute()
    },
    async fetch(){
      let { page = 1, tag , category , limit = 10, search } = this.$route.query

      const skipCount = (page - 1) * limit
      const Parse = this.$parse

      if (tag || category) {
        this.page = 1
        this.bindingPage = {id: this.page, name: '第 ' + this.page + ' 页'}
        this.tag = tag
        this.category = category
      }

      const PostQuery = new Parse.Query(Parse.Object.extend('Post'))
      if(search) {
        PostQuery.fullText('title', search);
      }
      PostQuery.include('tags')
      PostQuery.include('category')
      PostQuery.include('author')
      PostQuery.include('comments')
      PostQuery.descending(['top', 'lastupdate', 'createdAt'])

      PostQuery.limit(limit)
      PostQuery.skip(skipCount)

      if (tag) {
        const innerTagQuery = new Parse.Query(Parse.Object.extend('Tag'))
        innerTagQuery.equalTo('name', tag)
        PostQuery.matchesQuery('tags', innerTagQuery)
      }

      if (category) {
        const innerCategoryQuery = new Parse.Query(Parse.Object.extend('Category'))
        innerCategoryQuery.equalTo('name', category)
        PostQuery.matchesQuery('category', innerCategoryQuery)
      }

      PostQuery.select('tags', 'category', 'title', 'comments','author','view','createdAt', 'lastupdate', 'top')
      let posts = (await PostQuery.find()).map(toJSON);
      let post_count = await PostQuery.count();
      this.posts = posts
      this.all_page = Math.ceil(post_count / limit)
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
<style lang="stylus">
.page-operator{
  .select-page{
    min-width 80px
    .field-control {
      margin 0 !important 
    }
    .select > span {
      color #fff
      border-radius 3px
      height 30px
      line-height 30px
    }
    .select > span::after {
      border-color: #fff !important
    }
    .select span {
      background #49aafa !important 
    }
  }
}
</style>
<style lang="stylus" scoped>

.click {
  cursor pointer
}

.category-tag-wrap{
  background rgba(0,0,0, .7)
  position fixed
  top 0
  right 0
  bottom 0
  left 0
  z-index 88

  .box {
    width 400px
    height 400px
    background #eee
    margin-left -200px
    margin-top -200px
    left 50%
    top 50%
    position absolute
    padding 1rem

    .button {
      margin-top 10px
      cursor pointer
      margin-right 20px
    }
  }
}

.none-list{
  color #d8d8d8
  height 200px
  display flex 
  justify-content center
  align-items center
  font-size 2rem
}

.page-operator{
  display flex
  justify-content flex-end
  .select-page{
    min-width 100px
    margin 0 10px
  }
  .button{
    margin-left 10px
    padding 2px
    display block
    height 30px
    width 30px
    line-height 30px
    text-align center
    cursor pointer
    i {
      font-size 18px
    }
  }
  .all-page-box {
    height: 30px;
    line-height: 30px;
    font-size: 14px;
  }
}

.exit-btn {
  margin-left 1rem;
  cursor pointer;
}

.wrap {
  background: #fff;
  padding: 2rem 0 30px;
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
