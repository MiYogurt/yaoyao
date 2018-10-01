<template>
    <div>校验中...</div>
</template>
<script>
export default {
    name: "hooks-register",
    async mounted(){
        try{
            const ret = await this.$parse.Cloud.run('send_verify', {
                verify: true,
                id: this.$route.query.user,
                token: this.$route.query.token
            })
            console.log(ret)
            this.msg_success('操作成功', '已成功激活邮箱')
            this.$router.push({name:'login'})
        }catch(e){
            this.msg_error('出错了', e.toString())
        }
    }
}
</script>
<style lang="stylus" scoped>
div{
  color #d8d8d8
  height 200px
  display flex 
  justify-content center
  align-items center
  font-size 2rem
}
</style>