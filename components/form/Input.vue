<template>
    <div class="field-control">
        <label v-if="label" v-text="label"></label>
        <input type="text" :value="innerVal" @input="handleInput">
    </div>
</template>


<script>
    import debounce from 'lodash.debounce';
    export default {
        name: 'form-input',
        model: {
            prop: 'innerVal',
            event: 'change'
        },
        props:['innerVal', 'label'],
        methods: {
            handleInput: debounce(function(e) {
                this.$emit('change', e.target.value)
            }, 200)
        }
    }
</script>

<style lang="stylus" scoped>
.field-control {
    margin 1rem 0
}
input{
    outline none
    border 1px solid transparent
    border-radius 2px
    line-height 34px
    height 34px
    font-size 14px
    width 100%
    padding 0 5px
    background: #fff
    color: #333
    &:focus {
        border-color: #49a8fc
    }
}

label {
    color #49a8fc
    font-size .9rem
    display block
    margin-bottom 1rem
}
</style>
