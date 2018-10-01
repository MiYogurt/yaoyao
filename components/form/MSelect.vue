<template>
    <div class="field-control" v-if="value.length">
        <label v-if="label" v-text="label"></label>
        <div class="select" :class="{show: showOptions}">
            <div class="active-select" ref="openBtn" @click="toggle">
                <span class="active-select-item" v-for="(item, index) in current" v-if="item" :key="item.id" @click="(e) => delItem(index, e)" :style="{background: item.background, color: item.color}">
                    {{ item.name }} <i class="fas fa-times"></i>
                </span>
            </div>
            <div class="options" v-show="showOptions">
                <div class="option" v-for="item in value" :key="item.id" v-text="item.name" @click="select(item, $event)"></div>
            </div>
        </div>
    </div>
</template>


<script>
    import debounce from 'lodash.debounce';
    export default {
        name: 'form-multi-select',
        model: {
            prop: 'innerVal',
            event: 'change'
        },
        props:['innerVal', 'label', 'value', 'limit'],
        data(){
            return {
                current: this.innerVal || [],
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
                if(this.current.some(({name}) => name == item.name)) return;
                if (this.current.length >= this.limit) {
                    return this.msg_error('操作错误', `不能超过${this.limit}个`)
                }
                this.current.push(item)
                this.current = Array.from(new Set(this.current))
                this.$emit('change', this.current)
                this.showOptions = false
            },
            toggle(e){
                this.showOptions= !this.showOptions
                e.stopPropagation()
            },
            delItem(index, e){
                this.current.splice(index, 1)
                this.$emit('change', this.current)
                e.stopPropagation();
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
    &.select .active-select {
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
    .active-select {
        padding 0 5px
        font-size .9rem
        display block
        background #ffffff
        display: flex
        padding: .5rem
        border: 1px solid transparent
        min-height 36px
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
            transform: rotate(45deg);
            transition: transform ease-in .1s;
            position: absolute
            top: 13px
            right 10px
        }
    
    }
}

.active-select-item {
    background: #eee
    font-size .6rem
    padding: 3px 6px
    border-radius 3px
    margin-right .5rem
}

.options {
    position absolute
    border: 1px solid transparent
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
