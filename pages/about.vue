<template>
    <div class="wrap">
        <div class="operator" v-if="canEdit">
            <a class="block-btn" @click="save"><i class="fas fa-save"></i> 保存</a>
            <a class="block-btn" @click="edit"><i class="fas fa-pencil-alt"></i> 编辑</a>
        </div>
        <div class="reading" v-html="html"></div>
        <textarea v-if="show" class="editor-text" v-model="text"></textarea>
    </div>
</template>
<script>
import { mapState } from 'vuex';
export default {
    name: "about",
    async asyncData(){
        const Parse = require('create-api').default()
        const Config = Parse.Object.extend('Config')
        const ConfigQuery = new Parse.Query(Config)
        ConfigQuery.equalTo('name', 'aboutPage')
        const Data = await ConfigQuery.first()
        const config = Data.get('config')
        return {
            config: Data.toJSON(),
            text: config.text || '',
            show: false,
            id: Data.id
        }
    },
    computed: {
        html(){
            return this.$markdown.render(this.text)
        },
        canEdit(){
            return this.$store.state.isAdmin
        },
        ...mapState(['edit_text','sessionToken'])
    },
    methods: {
        edit(){
            this.show = !this.show
        },
        async save(){
            const config = this.$parse.Object.fromJSON({className: 'Config', ...this.config})
            config.set('config', {text: this.text})
            await config.save({sessionToken: this.sessionToken})
            this.msg_success('操作成功','已保存')
            this.show = false
        }
    },
    async mounted(){
        if (this.canEdit) {
            console.log(this.config);
        }
    }
}
</script>

<style lang="stylus" scoped>
.wrap {
    background #fff
    margin 2rem
}
.operator{

    a {
        float right
        display inline-block
        font-size .7rem
        color #49a8fc
        text-align center
        cursor pointer
        padding 10px
    }
}

.editor-text {
    width 100%
    padding 1rem
    border 1px solid #49a8fc
    outline none
    min-height 300px
}
</style>