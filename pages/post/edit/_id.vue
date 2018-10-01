<template>
    <div>
        <div class="form">
            <a-input label="文章标题" v-model="title" />
            <a-select label="文章分类" v-model="selectCategory" :value="categorys" />
            <a-m-select label="文章标签" :limit="3" v-model="selectTag" :value="tags" />
        </div>
        <text-editor v-model="text" @submit="submit"></text-editor>
    </div>
</template>

<script>
import TextEditor from "@/components/TextEditor.vue";
import AInput from "@/components/form/Input.vue";
import ASelect from "@/components/form/Select.vue";
import AMSelect from "@/components/form/MSelect.vue";
export default {
  name: "post-new",
  components: {
    TextEditor,
    AInput,
    ASelect,
    AMSelect
  },
  data() {
    return {
      title: "",
      selectCategory: null,
      selectTag: [],
      categorys: [],
      tags: [],
      text: '',
      post: {}
    };
  },
  async mounted() {
      const Post = this.$parse.Object.extend('Post')
      this.tags = (await this.fetchTags()).map(t => t.toJSON())
      this.categorys = (await this.fetchCategorys()).map(t => t.toJSON())
      let post_id = this.$route.params.id  
      this._s_post = new Post()
      this._s_post.id = post_id
      await this._s_post.fetch({include: ['category', 'tags']})
      this.post = this._s_post.toJSON()
      this.selectCategory = this.post.category
      this.selectTag = this.post.tags
      this.title = this.post.title
      this.text = JSON.parse(this.post.text).map(c => {
              c.status = 'none'
              c.showOperator = false
              return c;
      })
      this.$forceUpdate()
  },
  methods: {
      fetchTags(){
          return this.$fetchBase('Tag')
      },
      fetchCategorys(){
          return this.$fetchBase('Category')
      },
      restoreParseObject(json, name) {
          if (json.length) {
              return json = json.map(i => {
                  i.className = name
                  return this.$parse.Object.fromJSON(i)
              })
          }
          json.className = name
        return this.$parse.Object.fromJSON(json)
      },
      async submit(text){
        let post = this._s_post
        let acl = new this.$parse.ACL()
        post.set('title', this.title)
        post.set('category', this.restoreParseObject(this.selectCategory, 'Category'))
        post.set('tags', this.restoreParseObject(this.selectTag.slice(0, 3), 'Tag'))
        post.set('lastupdate', new Date())
        post.set('text', JSON.stringify(text.map(c => {
            delete c.status
            delete c.showOperator
            return c;
        })))
        await post.save()
        this.$router.push({name:'post-id', params: {id: post.id}})
        this.msg_success('操作成功', `《${this.title}》 已修改成功！`)
      }
  }
};
</script>

<style scoped>
.form {
  padding: 0 1rem;
}
</style>
