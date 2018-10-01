<script>
    export default {
        name: 'index',
        created(){
            this.$router.push({name:'user-id-comment'})
        },
        render(h){ return h()}
    }
</script>