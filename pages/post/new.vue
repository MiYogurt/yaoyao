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
      text: ''
    };
  },
  async mounted() {
      this.tags = (await this.fetchTags()).map(t => t.toJSON())
      this.categorys = (await this.fetchCategorys()).map(t => t.toJSON())
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
          if (!this.selectCategory || this.selectTag.length == 0) {
            return this.msg_error('操作错误', '请把数据都补充完整')
          }
          const Post = this.$model['Post']
          let post = new Post()
          let acl = new this.$parse.ACL()
          acl.setPublicReadAccess(true)
          acl.setWriteAccess(this.$parse.User.current(), true)
          acl.setRoleWriteAccess('Administrator', true)
          post.setACL(acl)
          post.set('title', this.title)
          post.set('category', this.restoreParseObject(this.selectCategory, 'Category'))
          post.set('tags', this.restoreParseObject(this.selectTag.slice(0, 3), 'Tag'))
          post.set('author', this.$parse.User.current())
          post.set('view', 1)
          post.set('top', 0)
          post.set('comments', [])
          post.set('lastupdate', new Date())
          post.set('text', JSON.stringify(text.map(c => {
              delete c.status
              delete c.showOperator
              console.log(c)
              return c;
          })))
          
          try{
              await post.save()
              this.msg_success('操作成功', `《${this.title}》 已成功发布！`)
              this.$router.push('/')
          }catch(e){
             console.error(e)
          }
      }
  }
};
</script>

<style scoped>
.form {
  padding: 0 1rem;
}
</style>
