<template>
  <div class="container">
    <label for="avatar" class="btn avatar-btn">修改头像</label>
    <input id="avatar" type="file" name="avatar" ref="avatar" @change="hasFile">

    <div class="username">
      <label>名称</label>
      <input type="text" v-model="username" @focus="focusUsername=true" @blur="focusUsername=false">
    </div>

    <!-- <div class="designation">
      <label>称号</label>
      <input type="text" v-model="username">
    </div> -->

    <div class="tags">
      <label>标签</label>
      <span class="tag" v-for="(tag,index) in tags" :key="index" v-text="tag.text" :style="{
        color: objectToColor(tag.color.rgba),
        backgroundColor: objectToColor(tag.bgColor.rgba)
      }" @click="openColor(index)"></span><span class="add" @click="addTag" v-if="tags.length < 3"></span>
    </div>


    <div class="username">
      <label>简介</label>
       <textarea v-model="description"></textarea>
    </div>

    <a class="btn save" @click="saveProfile">保存</a>

    <hr>


    <!-- <div class="phone">
      <label>修改手机号</label>
      <input type="text" v-model="phone">
      <a class="btn" @click="checkPhone">发送验证码</a>
    </div> -->

    <div class="email">
      <label>修改邮箱</label>
      <input type="text" v-model="email">
      <a class="btn" @click="checkEmail">发送验证码</a>
    </div>

    <div class="email">
      <label>修改密码</label>
      <input class="password" type="password" v-model="password" placeholder="新密码">
      <input class="password" type="password" v-model="password2" placeholder="确认新密码">
      <a class="btn" @click="savePassword">确认修改</a>
    </div>


    <div class="model" :class="{'show':showDialog}">
      <div class="panel" v-if="editPhone">
        <a class="close" @click="showDialog=false;editPhone=false"></a>
        <h2>验证你的手机号</h2>
        <input type="text" v-model="phoneCheckNo">
        <a class="btn">验证验证码</a>
      </div>
      <div class="panel" v-if="editEmail">
        <a class="close" @click="showDialog=false;editEmail=false"></a>
        <h2>验证你的邮箱</h2>
        <input type="text" v-model="emailCheckNo">
        <a class="btn" @click="changeEmail">验证验证码</a>
      </div>

      <div class="panel color" v-if="editTagIndex != -1">
        <div class="edit-type-wrap" :class="{'right': editTagTypeIndex != 0}">
          <span class="edit-type" @click="editTagTypeIndex = 0">背景</span>
          <span class="edit-type" @click="editTagTypeIndex = 1">文字</span>
        </div>
        <div class="preview">
          <input class="tag" :style="{
            color: objectToColor(tags[editTagIndex].color.rgba),
            backgroundColor: objectToColor(tags[editTagIndex].bgColor.rgba)
          }" v-model="tags[editTagIndex].text"/>
          <a class="close" @click="deleteTag(editTagIndex)"></a>
          <p class="tip right">这将会删除该标签</p>
          <p class="tip left">点击直接编辑文字</p>
        </div>
         <no-ssr>
          <photoshop v-model="tags[editTagIndex][type[editTagTypeIndex]]" @ok="closeColor" @cancel="closeColor"/>
         </no-ssr>
      </div>
    </div>

  </div>
</template>

<script>
import Vue from 'vue'
import debounce from 'lodash.debounce';
import isEmail from 'validator/lib/isEmail';
import isMobilePhone from 'validator/lib/isMobilePhone';

export default {
  data() {
    return {
      id: '',
      avatar: '/avatar/init.jpg',
      username: '',
      focusUsername: false,
      phoneComfirm: null,
      phone: '',
      email: '',
      password: '',
      password2: '',
      editTagIndex: -1,
      editTagTypeIndex: 0,
      type: ['bgColor', 'color'],
      editPhone: false,
      editEmail: false,
      description: '',
      emailCheckNo: '',
      tags: [
        {
          text: '快乐',
          bgColor: {
            rgba: {
              r: 23,
              g: 255,
              b: 255,
              a: 1
            }
          },
          color: {
            rgba: {
              r: 255,
              g: 255,
              b: 255,
              a: 1
            }
          }
        },
        {
          text: '土豪金',
          bgColor: {
            rgba: {
              r: 3,
              g: 255,
              b: 223,
              a: 1
            }
          },
          color: {
            rgba: {
              r: 15,
              g: 45,
              b: 255,
              a: 1
            }
          }
        },
        {
          text: '有颜',
          color: {
            rgba: {
              r: 45,
              g: 255,
              b: 255,
              a: 1
            }
          },
          bgColor: {
            rgba: {
              r: 255,
              g: 54,
              b: 255,
              a: 1
            }
          }
        }
      ],
      showDialog: false,
      usernameUsed: false
    }
  },
  watch: {
    username: function(username) {
      if (!this.focusUsername) {
        return
      }
      this.checkUsernameDebounce()
    }
  },
  methods: {
    checkEmail(){
      if(!isEmail(this.email)) {
        return this.msg_error('验证错误','邮件格式不正确')
      }
      this.$parse.Cloud.run('send_change', {
        email: this.email
      }).then(() => {
        this.msg_success('操作成功', '已成功发送验证码')
        this.editEmail = true
        this.showDialog = true
      }).catch((e) => {
        console.log(e)
        this.msg_error('操作错误', '发送失败')
      })

    },
    async changeEmail(){
      let user = await this._user.fetch()
      let token = user.get('verifyToken');
      if (token == this.emailCheckNo) {
        user.setEmail(this.email)
        await user.save()
        this.msg_success('操作成功', '已成功修改')
        this.editEmail = false
        this.showDialog = false
      }
    },
    checkPhone(){
      if(!isMobilePhone(this.phone, 'zh-CN')) {
        return this.msg_error('验证错误','手机号格式不正确')
      }
      this.editPhone = true
      this.showDialog = true
    },
    async savePassword(){
      if (this.password < 6) {
        return this.msg_error('验证错误','密码至少 6 位')
      }
      if(this.password != this.password2) {
        return this.msg_error('验证错误','两次密码不一致')
      }
      this._user.setPassword(this.password)
      await this._user.save()
      this.msg_success('操作成功', '已成功修改密码')
    },
    async checkUsername(){
      const {canUse} = await this.$parse.Cloud.run('check_username', {username: this.username})
      this.usernameUsed = !canUse
      if (!canUse) {
        this.msg_error('无法使用的用户名', '该用户名已被使用，请更换')
        return 
      }
      this.msg_success(
        '可以使用该用户名',
        '恭喜你，该用户名未被任何人使用'
      )
    },
    initUser(){
      const user = this.$parse.User.current()
      if(!user) {
        return this.$router.push({path:'/login'})
      }
      const userJSON = user.toJSON()
      this.$nextTick(() => {
        this.username = userJSON.username
        this.avatar = userJSON.avatar
        this.description = userJSON.description
        this.id = userJSON.objectId
        const tags = JSON.parse(userJSON.tags)
        if (tags) {
          this.tags = tags
        }
      })
      this._user = user
    },
    async saveProfile(){
      if(this.description.length > 35){
        return this.msg_error('操作错误','简介太长了，不能超过 35 个字符')
      }

      if (this.usernameUsed) {
        return this.msg_error('操作失败', '已被使用的用户名')
      }
      this._user.set('username', this.username)
      this._user.set('description', this.description)
      this._user.set('tags', JSON.stringify(this.tags))
      await this._user.save()
      this.msg_success('操作成功', '成功修改个人资料')
      this.$store.commit('login', {
        username: this.username,
        description: this.description,
        tags: this.tags,
      })
    },
    async hasFile(e) {
      const file = this.$refs.avatar.files[0]
      if (!file) {
        return
      }
      const nameArr = file.name.split('.')
      const endType = nameArr[nameArr.length - 1];
      const remotePath = '/avatar/' + this.id + '.' + endType
      const addQueryPath = remotePath + '?updated=' + Date.now()
      const upload = await this.$upyun.putFile(remotePath, file)
      this._user.set('avatar', addQueryPath)
      this.avatar = addQueryPath
      await this._user.save()
      this.$store.commit('login', {
        avatar: addQueryPath
      })
      this.msg_success('操作成功','已成功修改头像')

    },
    objectToColor(rgb) {
      return `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`
    },
    closeColor() {
      this.editTagIndex = -1
      this.showDialog = false
    },
    openColor(index) {
      this.editTagIndex = index
      this.showDialog = true
    },
    deleteTag(index) {
      this.tags.splice(index, 1)
      this.closeColor()
    },
    addTag() {
      let newTag = {
        text: '高颜值',
        bgColor: {
          rgba: {
            r: 86,
            g: 85,
            b: 246,
            a: 1
          }
        },
        color: {
          rgba: {
            r: 255,
            g: 255,
            b: 255,
            a: 1
          }
        }
      }
      if (this.tags.length < 3) {
        this.tags.push(newTag)
      }
      this.openColor(this.tags.length - 1)
    }
  },
  mounted() {
    this.checkUsernameDebounce = debounce(this.checkUsername, 500)
    this.initUser()
  }
}
</script>

<style lang="stylus" scoped>

input.tag {
  text-align: center
  border: none
  min-width: 60px
  width: auto
  cursor: text
}

.preview {
  margin-bottom: 1rem
  position: relative

  .tip {
    font-size: .6rem
    color: #fff
    background-color: rgba(0,0,0, .8)
    position: absolute
    top: 17px
    padding: .5rem 1rem
    bgColor = rgba(0,0,0, .8)
    &:before {
      content: ' '
      background-color: bgColor
      position: absolute
      display: inline-block
      top: 10px
      background: transparent;
      border-left: 5px solid transparent;
      border-right: 5px solid transparent;
      border-top: 5px solid transparent;
      border-bottom: 5px solid transparent;
    }

    &.right {
      right: -85%
      &:before {
        left: -10px
        border-right-color: bgColor;
      }
    }

    &.left {
      left: -85%
      &:before {
        right: -10px
        border-left-color: bgColor;
      }
    }
  }
}
.edit-type-wrap {
  margin-bottom: 1rem
  position: relative
  &:before {
    content: ''
    height: 2px
    background: #49a8fc
    position: absolute
    bottom: -2px
    width: 50%
    transition: all ease .2s
    transform: translateX(0)
  }
  &.right:before {
    transform: translateX(100%)
  }
}
.edit-type{
  display: inline-block
  padding: .5rem 1rem
  font-size: .9rem
  cursor: pointer
}
center(){
  left: 50%
  top: 50%
  transform: translate(-50%, -50%)
}

.tags label {
  margin-bottom: 1rem
}

.tag {
  cursor: pointer
}

.save.btn {
  margin: 1rem 0
  display: inline-block
}

.password {
  display: block
  margin-bottom 1rem
}

.password ~ .btn {
  margin: 0
  display: inline-block
}

.close{
  width: 20px
  height: 20px
  border-radius: 50%
  background rgba(0,0,0, .2)
  position: absolute
  right: 10px
  top: 10px
  transition: background-color ease .5s
  cursor: pointer
  &:hover {
    background #49a8fc
  }
  &:after,
  &:before{
    content: ''
    position: absolute
    background: #fff
    width: 50%
    height: 2px
    left: 50%
    top: 50%
  }

  &:after {
    transform: translate(-50%, -50%) rotate(-45deg)
  }
  &:before {
    transform: translate(-50%, -50%) rotate(45deg)
  }
}

.add{
  width: 20px
  height: 20px
  border-radius: 50%
  background rgba(0,0,0, .5)
  display: inline-block
  vertical-align: -6px
  position: relative
  transition: background-color ease .5s
  cursor: pointer
  margin-left .2rem
  &:hover {
    background #49a8fc
  }
  &:after,
  &:before{
    content: ''
    position: absolute
    background: #fff
    width: 50%
    height: 2px
    left: 50%
    top: 50%
  }

  &:after {
    transform: translate(-50%, -50%) rotate(0)
  }
  &:before {
    transform: translate(-50%, -50%) rotate(90deg)
  }
}

.color .close {
  right: 4px
  top: 22px
}

.model .panel.color {
  width: 700px
  display: flex
  justify-content: center
  flex-direction: column
  align-items: center
}

.model{
  position: fixed
  left: 0
  right: 0
  top: 0
  bottom: 0
  background: rgba(0,0,0, .8)
  display: none
  &.show {
    display: block
  }
  .panel {
    position: absolute
    padding: 2rem
    border-radius: 1px
    center()
    background: #fff
    width: 400px
    height: auto

    input {
      display: block
      margin: 1rem 0
    }

    .btn {
      margin: 0
    }
  }
}

#avatar{
  display: none;
  margin-bottom: 1rem
}

.btn {
  background: #49a8fc
  color: #fff
  font-size: .78rem
  padding: .5rem 1rem
  border-radius: 3px
  cursor: pointer
  margin-bottom: 1rem
  &:hover {
    background: darken(#49a8fc, 10%)
  }
}

input,textarea {
  outline: none
  padding: .5rem
  font-size: 0.9rem
  color: #a3aec3
  border: 1px solid lighten(#a3aec3, 70%)
  margin-top: 1rem
  min-width: 200px
  border-radius: 2px
  &:hover,
  &focus{
    border-color: lighten(#a3aec3, 30%)
  }
}


textarea {
  min-height: 70px
  min-width: 100%
  resize: vertical
}


.username,
.phone,
.designation,
.tags,
.email {
  margin-top: 2rem;
  label {
    display: block
    color: #1d1d1f
  }
}

.avatar-btn.btn {
  margin: 0
}

input ~ .btn {
  margin: 0 1rem
}

.comfirm {
  width: 80px
  min-width: auto
}
</style>
