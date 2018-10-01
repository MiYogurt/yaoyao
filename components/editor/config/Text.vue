<template>
    <div>
        <h3 v-text="label"></h3>
        <input v-model="binding"/>
    </div>
</template>


<script>
    export default {
        name: 'edit-config-text',
        data(){
            return { binding: this.value }
        },
        props: ['name', 'value', 'fire', 'label'],
        watch: {
            binding(newVal){
                this.fire(this.name, newVal)
            }
        }
    }
</script>

<style lang="stylus" scoped>
h3 {
    margin .5rem 0
    font-size .9rem
    color #49a8fc
}
input{
    outline none
    border none
    border-radius 2px
    line-height 34px
    height 34px
    font-size 14px
    width 100%
    padding 0 5px
    background: #131923;
    color: #fff;
    &:focus {
        background: #3d4861
    }
}
</style>
