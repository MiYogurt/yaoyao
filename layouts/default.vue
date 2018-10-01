<template>
  <div>
    <tip/>
    <check-tip/>
    <o-header />
    <div class="box">
      <nuxt />
    </div>
    <editor/>
    <o-footer />
    <o-copy-right />
  </div>
</template>

<script>
import OHeader from './OHeader.vue'
import OFooter from './OFooter.vue'
import OCopyRight from './OCopyRight.vue'
import Editor from '~/components/Editor.vue'
import Tip from '~/components/Tip.vue'
import CheckTip from '~/components/CheckTip.vue'
import shortid from 'shortid';


export default {
  components: {
    OHeader,
    OFooter,
    OCopyRight,
    Editor,
    Tip,
    CheckTip
  },
  data(){
    return {
      copyValue: ''
    }
  },
  computed: {
    isAdmin(){
      return this.$store.state.isAdmin
    }
  },
  mounted() {
    this.checkAdmin()
    this.hanlde404()
    this.handleImageUpload()
  },
  methods: {
    checkAdmin(){
      window.parse = this.$parse
      let user = this.$parse.User.current()
      if(!user) return
      this.$parse.Cloud.run('check_admin').then((roles) => {
        if (roles.some((role) => role.get('name') === 'Administrator')) {
          this.$store.commit('set_admin', true)
        }
      })
    },
    hanlde404(){
        const imgs = document.body.querySelectorAll('img')
        Array.from(imgs).forEach(img => {
          img.onerror = () => {
            img.src = '/404.png'
          }
        })
    },
    handleImageUpload(){
        const doc = document.body
        doc.addEventListener('dragover', (e) => {
          e.preventDefault()
        })
        doc.addEventListener('drop', async (e) => {
          e.preventDefault()
          const file = e.dataTransfer.files[0]
          console.log(file);
          if (typeof file == 'undefined') {
            return
          }
          if (!this.$parse.User.current()) {
            return this.msg_error('操作错误', '登陆之后才可以上传文件')
          }

          if(file.type.includes('image') && file.size / 1000000 > 2 && !this.isAdmin) {
           return this.msg_error('操作错误', '没有权限上传大于 2mb 图片文件')
          }

          if(file.type.includes('audio') && file.size / 1000000 > 5 && !this.isAdmin) {
           return this.msg_error('操作错误', '没有权限上传大于 5mb 音频文件')
          }

          if(file.type.includes('video') && file.size / 1000000 > 10 && !this.isAdmin) {
           return this.msg_error('操作错误', '没有权限上传大于 5mb 视频文件')
          }

          if(file.size / 1000000 > 10 && !this.isAdmin) {
           return this.msg_error('操作错误', '没有权限上传大于 10mb 文件')
          }

          const id = this.$parse.User.current().id
          if (file) {
              const nameArr = file.name.split('.')
              const endType = nameArr[nameArr.length - 1];
              const remotePath = '/' + id + '/' + shortid.generate() +'.' + endType
              const copyValue = process.env.cdnUrl + remotePath
              window.checkTip && window.checkTip('error', '上传文件', '是否要上传该文件', (bool, e) => {
                if (!bool) {
                  return 
                }
                this.$clip(copyValue, e)

                this.$upyun.putFile(remotePath, file).then(() => {
                  console.log("上传成功：" + copyValue);
                  this.msg_success('操作成功', '地址已在您的剪贴板内，Ctrl + V 直接使用')
                }).catch(e => {
                  this.msg_error('操作错误', e.toString())
                })
                
              })
          }
        });
      }
  }
}
</script>

<style lang="stylus">
@import 'pell/dist/pell.css';
@import '../assets/reading.styl';

.reading {
    padding 1rem

    for i in 1..6 {
        h{i} {
            margin 2rem 0
        }

        & > h{i}:first-of-type {
            margin-top 0
        }
    }
}

.clip {
  position: absolute;
  top: -1000px;
  z-index: -1;
}

#editor .reading {
  white-space: pre-wrap;
}

#editor .reading p {
  min-height: 1.2rem;
  margin-bottom: 1rem;
}

#editor .reading pre p {
  margin-bottom: 0;
}

.pell-button-selected {
  background: #4c648b;
}

.pell-button.pell-button-selected {
  color: #fff;
}

.pell-actionbar {
  border-bottom: none;
  background: transparent;
  display: flex;
  justify-content: space-around;
  margin-bottom: 2rem;
  font-family: cursive;
  flex-wrap: wrap;
}

.pell-button {
  user-select: none;
  min-width: 50px;
  font-family: sans-serif;
}

.pell-button {
  color: #4d648b;
  transition: all 0.2s;
}

.pell-button:hover {
  color: #49a8fc;
}

.pell-content {
  height: 100%;
  min-height: 300px;
  background: #fff;
}

p {
  color: #3c3c3c;
}

a {
  text-decoration: none;
}

body {
  background: #f8faff;
  font-family: 'Roboto', -apple-system, 'Helvetica Neue', Helvetica, Arial, 'PingFang SC', 'Hiragino Sans GB', 'WenQuanYi Micro Hei', 'Microsoft Yahei', sans-serif;
}

body.unselect {
  user-select: none;
}

hr {
  margin: 25px 0px;
  border: transparent;
  border-bottom: 1px solid #eef5f7;
}

.fr {
  float: right;
}

.cls {
  clear: both;
}

.linear {
  background: linear-gradient(to right, #49A8FC 0%, #52C1ED 100%);

  &:hover {
    box-shadow: 0px 4px 20px 0 #cae1ea;
  }

  &&-1 {
    background: linear-gradient(to right, #FAD7A1 0%, #E96D71 100%);
  }

  &&-2 {
    background: linear-gradient(to right, #ACFED1 0%, #50D0B1 100%);
  }

  &&-3 {
    background: linear-gradient(to right, #65FDF0 0%, #1D6FA3 100%);
  }

  &&-4 {
    background: linear-gradient(to right, #AFC3FC 0%, #50D0B1 100%);
  }

  &&-5 {
    background: linear-gradient(to right, #0093E9 0%, #80D0C7 100%);
  }
}

.container {
  max-width: 1440px;
  margin: 0 auto;
}

.button {
  display: inline-block;
  padding: 0.89rem;
  border-radius: 3px;
  font-size: 0.8rem;
  background: #fff;
  color: #3a3a3a;

  &.primary {
    background: #49aafa;
    color: #fff;
  }

  &.light {
    background: rgba(21, 39, 73, 0.412);
    color: #fff;
  }
}

.columns {
  display: flex;

  for i in (1...12) {
    .column.is-{i} {
      width: (i / 12) * 100%;
    }
  }
}

.tag {
  font-size: 11.2px;
  font-size: 0.7rem;
  background: #eee;
  color: #fff;
  padding: 3px 6px;
  margin-right: 5px;
  border-radius: 2px;
  margin-bottom: 2px;
}
</style>
