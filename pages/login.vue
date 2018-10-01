<template>
  <div class="wrap">
    <div class="panel">
      <nuxt-link class="title" to="/">
        <img src="~assets/logo.png">
      </nuxt-link>
      <div class="oprator">
        <div class="item" :class="{'active': isLogin}" @click="page='login'">登录</div>
        <div class="item" :class="{'active': !isLogin}" @click="page='reigister'">注册</div>
      </div>
      <div class="box">
        <transition name="fade">
          <div class="login" v-if="isLogin">
            <div class="group">
              <label :class="{'focus': equal(1) || login.email.length > 0 , 'error': loginEmailCheck}">邮箱</label>
              <input type="email" v-model="login.email" @focus="focus(1)" @blur="blur" />
            </div>
            <div class="group">
              <label :class="{'focus': equal(2) || login.password.length > 0, 'error': password}">密码</label>
              <input type="password" v-model="login.password" @focus="focus(2)" @blur="blur" />
            </div>
            <button @click="loginPush">登录</button>
          </div>
        </transition>
        <transition name="fade">
          <div class="register" v-if="!isLogin">
            <div class="group">
              <label :class="{'focus': equal(3) || register.email.length > 0, 'error': registerEmailCheck }">邮箱</label>
              <input type="email" v-model="register.email" @focus="focus(3)" @blur="blur" />
            </div>
            <div class="group">
              <label :class="{'focus': equal(4) || register.username.length > 0, 'error': usernameUsed }">用户名</label>
              <input type="text" v-model="register.username" @focus="focus(4)" @blur="blur" />
            </div>
            <div class="group">
              <label :class="{'focus': equal(8) || register.password.length > 0, 'error': equalPassword }">密码</label>
              <input type="password" v-model="register.password" @focus="focus(8)" @blur="blur" />
            </div>
            <div class="group">
              <label :class="{'focus': equal(9) || register.comfirm_password.length > 0, 'error': equalPassword }">确认密码</label>
              <input type="password" v-model="register.comfirm_password" @focus="focus(9)" @blur="blur" />
            </div>
            <button @click="registerPush">注册</button>
          </div>
        </transition>
      </div>
    </div>
  </div>
</template>


<script>

const debounce = require('lodash.debounce')
import axios from 'axios'

const tip_async = fn => debounce(fn, 500)()

const emailReg = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

export default {
  layout: 'blank',
  data() {
    return {
      page: this.$route.query.page || 'login',
      focusIndex: 0,
      usernameUsed: false, // 用户名已被使用过了
      login: {
        email: '',
        password: ''
      },
      register: {
        username: '',
        email: '',
        password: '',
        comfirm_password: ''
      }
    }
  },
  computed: {
    isLogin() {
      return this.page == 'login'
    },
    loginEmailCheck() {
      if (this.page == 'register' || this.login.email == '') {
        return false
      }

      if (!emailReg.test(this.login.email)) {
        tip_async(() => this.msg_error('校验错误', '邮件格式不对'))
        return true
      }

      return false
    },
    registerEmailCheck() {
      if (this.page == 'login' || this.register.email == '') {
        return false
      }

      if (!emailReg.test(this.register.email)) {
        tip_async(() => this.msg_error('校验错误', '邮件格式不对'))
        return true
      }


      return false
    },
    password() {
      if (this.page == 'register' || this.login.password == '') {
        return false
      }

      if (this.login.password.length < 6) {
        tip_async(() => this.msg_error('校验错误', '密码至少6位'))
        return true
      }
      return false
    },
    equalPassword() {
      if (this.page == 'login' || this.register.password == '') {
        return false
      }

      if (this.register.password.length < 6) {
        tip_async(() => this.msg_error('校验错误', '密码至少6位'))
        return true
      }

      if (this.register.password !== this.register.comfirm_password) {
        tip_async(() => this.msg_error('校验错误', '两次密码不一致'))
        return true
      }

      return false
    }
  },
  watch: {
    'register.username': debounce(function(username) {
      this.$parse.Cloud.run('check_username', {username}).then(({ canUse }) => {
          this.usernameUsed = !canUse
          console.log(canUse)
          if (!canUse) {
            this.msg_error('无法使用的用户名', '该用户名已被使用，请更换', 5000)
            return
          }
          this.msg_success(
            '可以使用该用户名',
            '恭喜你，该用户名未被任何人使用',
            9999
          )
        }).catch(() => {
          this.$parse.User.logOut()
        })
    }, 500)
  },
  methods: {
    focus(index) {
      this.focusIndex = index
    },
    blur() {
      this.focusIndex = 0
    },
    equal(index) {
      return this.focusIndex == index
    },
    labelClick(index) {
      this.focus(index)
    },
    reback_history(){
      let url = this.$store.state.reback_history_url
      if(!url) return this.$router.push('/')
      return this.$router.push(url)
    },
    loginPush() {
      this.$parse.User.logIn(this.login.email, this.login.password).then(userInfo => {
          this.storeUser(userInfo)
      })
    },
    storeUser(userInfo){
      if (!userInfo.get('emailVerified')) {
          this.msg_error('登录失败', '邮箱未激活')
          return this.$parse.User.logOut()
      }
      this.$store.commit('login', {
        username: userInfo.get('username'),
        token: userInfo.getSessionToken(),
        email: userInfo.getEmail(),
        avatar: userInfo.get('avatar'),
        description: userInfo.get('description'),
        tags: JSON.parse(userInfo.get('tags')),
        message_count: userInfo.get('message_count') || 0
      })
      this.msg_success('登录成功', '我的朋友，欢迎回来！')
      this.reback_history()
    },
    registerPush() {
      let user = new this.$parse.User()
      user.set('username', this.register.username)
      user.set('password', this.register.password)
      user.set('email', this.register.email)
      user.set('avatar', "/avatar/init.jpg")
      user.set('description', "简介是什么，我没有的。")
      user.set('tags', `[{"text":"快乐","bgColor":{"hsl":{"h":0,"s":0.7950820799240518,"l":0.609111785,"a":1},"hex":"#EB4C4C","rgba":{"r":235,"g":76,"b":76,"a":1},"hsv":{"h":0,"s":0.6757,"v":0.9198999999999999,"a":1},"oldHue":0,"source":"hsva","a":1},"color":{"rgba":{"r":255,"g":255,"b":255,"a":1}}},{"text":"土豪金","bgColor":{"rgba":{"r":3,"g":255,"b":223,"a":1}},"color":{"rgba":{"r":15,"g":45,"b":255,"a":1}}},{"text":"有颜","color":{"rgba":{"r":45,"g":255,"b":255,"a":1}},"bgColor":{"rgba":{"r":255,"g":54,"b":255,"a":1}}}]`)
      user.set('message_count', 0)

      user.signUp().then(userInfo => {
          this.$parse.Cloud.run('send_register', {
            id: userInfo.id,
          }).then((ret) => {
            if (ret.errno) {
              return this.msg_error('发送激活邮件失败', '请联系管理员')
            }
            this.$parse.User.logOut()
            this.msg_success('注册成功', '激活邮件已发送！')
          })
      }).catch((e) => {
        console.log(e);
        this.msg_error('注册失败', '请联系管理员')
      })
    }
  }
}
</script>

<style>
body {
  background: #f8faff;
}
</style>

<style lang="stylus" scoped>
mainColor = #17274b;
bgColor = #f8faff;

.focus ~ input {
  border-bottom-color: green;
}

.error ~ input {
  border-bottom-color: #ff3030;
}

.fade-enter-active {
  transition: all 1s ease;
}

.fade-leave-active {
  display: none;
}

.fade-enter, .fade-leave-to {
  transform: translateX(20px);
  opacity: 0;
}

center() {
  display: flex;
  justify-content: center;
  align-items: center;
}

resetForm() {
  border: none;
  outline: none;
}

.wrap {
  min-height: 100vh;
  center();
  color: darkgrey;
  font-size: 0.9rem;
}

.title {
  min-width: 480px;
  height: 80px;
  background: mainColor;
  display: block;
  center();
  color: #fff;
  font-size: 1.7rem;
  border-radius: 3px 3px 0 0;
}

img {
  width: 48px;
  height: 48px;
  margin-right: 1rem;
}

.panel {
  max-width: 480px;
  background: #fff;
  position: relative;
}

.oprator {
  margin-top: 1rem;

  .item {
    width: 50%;
    display: inline-block;
    text-align: center;
    cursor: pointer;
    padding: 1rem 0;

    &:hover, &.active {
      color: mainColor;
    }
  }
}

input {
  resetForm();
  display: block;
  border-bottom: 1px solid #f5f5f5;
  width: 100%;
  height: 35px;
  margin-bottom: 2rem;
  font-family: menlo cursive;
}

.group {
  text-align: left;
}

.box {
  padding: 1rem 2rem 2rem;
  overflow: hidden;
  text-align: center;
}

button {
  resetForm();
  background: mainColor;
  color: #fff;
  padding: 0.7rem 2.5rem;
  font-size: 0.8rem;
  margin-top: 1rem;
  cursor: pointer;

  &:hover {
    box-shadow: 3px 5px 15px 0 #17274b52;
  }
}

.group label {
  transform: translateY(25px);
  cursor: text;
  display: inline-block;
  transition: all 0.2s;
  pointer-events: none;

  &.focus {
    // font-size 1.1rem
    transform: translateY(0);
    color: mainColor;
  }
}
</style>
