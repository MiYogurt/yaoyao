<template>
    <div class="field-control" v-if="value.length">
        <label v-if="label" v-text="label"></label>
        <div class="select" :class="{show: showOptions}">
            <span ref="openBtn" v-text="current ? current.name : ''" @click="toggle"></span>
            <div class="options" v-show="showOptions">
                <div class="option" v-for="item in value" :key="item.id" v-text="item.name" @click="select(item)"></div>
            </div>
        </div>
    </div>
</template>


<script>
    import debounce from 'lodash.debounce';
    export default {
        name: 'form-select',
        model: {
            prop: 'innerVal',
            event: 'change'
        },
        props:['innerVal', 'label', 'value'],
        data(){
            return {
                current: this.innerVal || this.value[0] ,
                showOptions: false
            };
        },
        watch:{
            innerVal(){
                this.current = this.innerVal
            }
        },
        mounted() {
            document.body.addEventListener('click', (e) => {
                if (e.target != this.$refs.openBtn) {
                    this.showOptions = false
                }
            }, true)
        },
        methods: {
            select(item) {
                this.current = item
                this.$emit('change', item)
                this.showOptions = false
            },
            toggle(e){
                this.showOptions= !this.showOptions
                e.preventDefault()
            }
        }
    }
</script>

<style lang="stylus" scoped>
.field-control {
    margin 1rem 0
}

label {
    color #49a8fc
    font-size .9rem
    display block
    margin-bottom 1rem
}

.show {
    &.select span {
        position = top left right
        for z in position {
            border-{z}: 1px solid #49a8fc
        }

        &::after {
            transform: rotate(225deg);
        }
    }
    .options {
        position = bottom left right
        for z in position {
            border-{z}: 1px solid #49a8fc
        }
    }
}

.select{
    position relative
    margin-bottom .5rem
    font-size 14px
    border-radius 2px
    user-select none
    span {
        padding 0 5px
        font-size .9rem
        display block
        background #ffffff
        height 34px
        line-height 34px
        border: 1px solid transparent
        border-bottom: none
        cursor pointer
        &::after {
            border: 2px solid #44a9fd
            border-left: 0
            border-top: 0
            content: ' '
            width: 8px;
            height: 8px;
            display: inline-block;
            transform-origin: center
            transform: rotate(45deg);
            transition: transform ease-in .1s;
            position: absolute
            top: 11px
            right 10px
        }
    
    }
}

.options {
    position absolute
    border 1px solid transparent
    border-top none
    overflow overlay
    overflow-x hidden
    left 0
    right 0
    background #ffffff
    z-index 90
    max-height 34px * 5
    overflow
    .option {
        padding 0 5px
        height 34px
        line-height 34px
        font-size .9rem
        cursor pointer
        &.active, 
        &:hover{
            background #49a8fc
            color #fff
        }
    }
}
</style>
