<template>
    <section class="editor-image-component" :class="align">
        <a class="link" :href="link" v-if="link" target="_blank" rel="noopenner">
            <img :src="src" :width="width" :height="height"/>
            <p class="caption" v-if="title" v-text="title"></p>
        </a>
        <figure v-else>
            <img :src="src" :width="width" :height="height"/>
            <p class="caption" v-if="title" v-text="title"></p>
        </figure>
    </section>
</template>

<script>
    const props =  {
        src: {
            default: 'https://via.placeholder.com/1920x1080',
            inputType: 'text',
            label: '图片地址' 
        }, 
        title: {
            default: '',
            inputType: 'text' ,
            label: '标题' 
        },
        align: {
            default: 'center',
            inputType: 'radio',
            select: [{key:'left',value:'左对齐'}, {key:'center',value:'居中'}, {key:'right',value:'右对齐'}],
            label: '对齐方式' 
            
        },
        width: { default: 200, inputType: 'text',label: '宽度'  },
        height: { default: 200, inputType: 'text', label: '高度'  },
        link: { default: '', inputType: 'text', label: '链接地址'  }
    }
    
    export { props }
    export default {
        name: 'editor-image',
        props,
        mounted() {
            const imgs = document.querySelectorAll('.editor-image-component img')
            Array.from(imgs).map(img => {
                img.onerror = () => {
                    img.src = '/404.png'
                }
            })
        },
    };
</script>

<style lang="stylus" scoped>
.editor-image-component
    margin-bottom 20px
.caption 
    font-size .8rem
    padding .2rem 0
    color #5b5e67
    letter-spacing 0.5px
    display block
img
    max-width 100%
    display inline
    margin 0 auto
.left
    text-align left
.right
    text-align right
.center
    text-align center
a
    text-decoration none
    &:hover
        background none
    .caption 
        color #52c1ed
</style>
