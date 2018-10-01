<template>
    <div>
        <h3 v-text="label"></h3>
        <select v-model="binding">
            <option v-for="v in select" :value="v.key" v-text="v.value" :key="v.key"></option>
        </select>
    </div>
</template>


<script>
    export default {
        name: 'edit-config-select',
        data(){
            return { binding: this.value }
        },
        props: ['name', 'value', 'fire', 'select', 'label'],
        mounted() {
        },
        watch: {
            binding(newVal){
                console.log(newVal);
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

div
  position: relative
  max-width: 100%
  select
    -webkit-appearance: none
    -moz-appearance: none
    border: none
    height 34px
    line-height 34px
    font-size 14px
    padding-left 3px
    display: block
    outline: none
    // margin: .5rem 0
    border-radius 2px
    background #131923
    width 100%
    position relative
    color #ffffff

  &::after
    border: 2px solid gray
    border-left: 0
    border-top: 0
    content: ' '
    width: 8px;
    height: 8px;
    display: inline-block;
    transform: rotate(45deg);
    position: absolute
    top: 36px
    right 10px
</style>
