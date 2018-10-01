<script>
    export default {
        name: 'index',
        created(){
            this.$router.push({name:'user-index-comment'})
        },
        render(h){ return h()}
    }
</script>