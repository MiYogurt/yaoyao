<template>
  <div class="wrap">
    <div class="panel">
      <nuxt-link class="title" to="/">
        <img src="~assets/logo.png">
      </nuxt-link>
      <div class="box">
            <h2>发送激活邮件</h2>
            <div class="group">
              <label :class="{'focus': equal(1) || email.length > 0}">邮箱</label>
              <input type="email" v-model="email" @focus="focus(1)" @blur="blur" />
            </div>

            <button @click="loginPush">发送邮件</button>
      </div>
    </div>
  </div>
</template>


<script>

export default {
  layout: 'blank',
  data() {
    return {
        focusIndex: 0,
        email: '',
    }
  },
  head(){
      return {
          title: '激活邮箱'
      }
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
    loginPush() {
      this.$parse.Cloud.run('send_register', {
          email: this.email
      }).then(() => {
        this.$router.push('/')
        this.msg_success('操作成功', '已成功发送邮件')
      }).catch(e => {
        console.log(e)
        this.msg_error('操作错误', e.toString())
      })
    },
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
