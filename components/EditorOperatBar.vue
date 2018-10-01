<script>
    import EDropButton from './EditorDropButton.vue';
    export default {
        name: 'editor-operat-bar',
        components: {
            EDropButton,
        },
        props: ['save'],
        render(h){
            return <div class="components-box">
                <EDropButton 
                    icon="fas fa-save" 
                    text="提交内容" 
                    color="#4e3ab6" 
                    save={this.save}
                />
                <EDropButton 
                icon="fas fa-image" 
                text="图片组件" 
                color="#FF6699" 
                dataTransfer={{
                    name:'EImage',
                    status: "none",
                    showOperator: false,
                    props: {
                        title: '',
                        align: 'center',
                    }
                }}/>
                <EDropButton 
                icon="fas fa-align-left" 
                text="文字组件" 
                color="#e43d0b" 
                dataTransfer={{
                    name:'EP',
                    status: "none",
                    showOperator: false,
                    props: {
                        title: '',
                        text: '请输入内容',
                    }
                }}/>
                <EDropButton 
                icon="fas fa-file-alt" 
                text="MD组件" 
                color="#FF33FF" 
                dataTransfer={{
                    name:'EMarkdown',
                    status: "none",
                    showOperator: false,
                    props: {
                        text: '请输入内容',
                    }
                }}/>
                <EDropButton 
                icon="fab fa-youtube" 
                text="视频组件" 
                color="#FFCC33" 
                dataTransfer={{
                    name:'EVideo',
                    status: "none",
                    showOperator: false,
                    props: {
                        src: '',
                    }
                }}/>
                <EDropButton 
                icon="fas fa-headphones-alt" 
                text="音频组件" 
                color="#000000" 
                dataTransfer={{
                    name:'EAudio',
                    status: "none",
                    showOperator: false,
                    props: {
                        src: '',
                    }
                }}/>
            </div>
        }
    }
</script>

<style lang="stylus" scoped>
.components-box{
    position fixed
    top 90px
    right  0
}
</style>
