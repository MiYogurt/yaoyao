<template>
    <div class="e-drop-button" draggable @dragstart="dragstart" @select="(e) => e.preventDefault()" @click="saveFN"> 
        <i :class="icon" :style="{color}"/>
        <span v-html="text"></span>
    </div> 
</template>


<script>
    export default {
        name: 'editor-drop-button',
        props: ['icon', 'text', 'color', 'dataTransfer', 'save'],
        methods: {
            dragstart(e){
                if (this.save) {
                    e.preventDefault();
                    return
                }
                e.dataTransfer.setData("data", JSON.stringify(this.dataTransfer));
            },
            saveFN(){
                if(this.save) this.save()
            }
        },
    }
</script>

<style lang="stylus" scoped>
.e-drop-button{
    background #fff
    height 40px
    overflow hidden
    line-height 40px
    padding 0 15px
    font-size .9rem
    cursor pointer
    transform translateX(70px)
    transition all ease-in-out .2s;
    user-select none
}

.e-drop-button:hover {
    transform translateX(0)
}

i {
    padding-right 15px
}

span{
    color #1d1d1f
    font-size .8rem
}
</style>
