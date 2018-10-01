<template>
    <div>
        <h3 v-text="label"></h3>
        <textarea v-model="binding"/>
    </div>
</template>


<script>
    export default {
        name: 'edit-config-text-area',
        data(){
            return { binding: this.value }
        },
        props: ['name', 'value', 'fire', 'label'],
        watch: {
            binding(newVal){
                this.fire(this.name, newVal.toString())
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
textarea{
    outline none
    border none
    border-radius 2px
    line-height 1.3
    font-size 14px
    width 100%
    padding 0 5px
    background: #131923;
    color: #fff;
    min-height 300px
    resize vertical
    &:focus {
        background: #3d4861
    }
}
</style>
