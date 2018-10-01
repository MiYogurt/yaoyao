<template>
  <div class="wrapper">
    <div class="container">
      <div class="nav cls">
        <nuxt-link to="/" class="nav-item"><img src="~assets/logo.png" alt="logo" class="logo"></nuxt-link>
        <nuxt-link to="/" class="nav-item">讨论</nuxt-link>
        <!-- <nuxt-link to="/" class="nav-item">广告</nuxt-link> -->
        <nuxt-link to="/about" class="nav-item">关于</nuxt-link>
        <div class="fr" :class="{ 'show': toggle }">
          <search></search>
          <div class="oprator">
            <drop-down v-if="username" width="120px">
              <router-link to="/user" class="nav-item">
                <img :src="innerAvatar" v-if="avatar" class="avatar">
              </router-link>
              <template slot="content">
                <ul class="user-menu">
                  <li>
                    <router-link to="/user">个人中心</router-link>
                  </li>
                  <li>
                    <a class="user-menu-item" @click="exit">退出登录</a>
                  </li>
                </ul>
              </template>
            </drop-down>
            <div class="btn linear" v-else>
              <nuxt-link to="/login">登录</nuxt-link> ·
              <nuxt-link :to="{ path: '/login', query: {page: 'register'}}">注册</nuxt-link>
            </div>
          </div>
        </div>
        <i class="open fas fa-bars" @click="toggleMenu"></i>
        <i class="close far fa-times-circle" @click="toggleMenu"></i>
      </div>

    </div>
  </div>
</template>

<script>
import Search from '~/components/Search.vue'
import DropDown from '~/components/DropDown.vue'
import { mapState } from 'vuex'

export default {
  name: 'o-header',
  components: {
    Search,
    DropDown
  },

  data() {
    return {
      toggle: false
    }
  },
  computed: {
    innerAvatar(){
      return process.env.cdnUrl + this.avatar
    },
    ...mapState(['username', 'avatar'])
  },
  async mounted() {

    let user = this.$parse.User.current()
    if (user) {
      let metaData = {
          username: user.get('username'),
          token: user.getSessionToken(),
          email: user.getEmail(),
          avatar: user.get('avatar'),
          description: user.get('description'),
          tags: JSON.parse(user.get('tags')),
          message_count: user.get('message_count') || 0
      }
      console.log(metaData)
      this.$store.commit('login', metaData)
    }

    
  },
  methods: {
    exit() {
      this.$store.commit('logout')
      this.$parse.User.logOut()
      this.$router.push('/')
      this.msg_success('操作成功', '你已成功退出账户！')
    },
    toggleMenu() {
      this.toggle = !this.toggle
    }
  }
}
</script>

<style lang="stylus" scoped>
.user-menu {
  list-style: none;
  .user-menu-item {
    cursor pointer
  }
  li {
    height: 48px;
    line-height: 48px;
    font-size: 0.8rem;

    a {
      color: #51678f;
      display: block;

      &:hover {
        color: #2a5094;
        background: #eeeeee3b;
      }
    }
  }
}

.avatar {
  width: 42px;
  height: 42px;
  object-fit: cover;
  border-radius: 50%;
  margin-top: 19px;
  transition: all cubic-bezier(0.68, 2.24, 0.46, 1.54) 0.3s;
}

.open, .close {
  display: none;
}

.wrapper {
  height: 80px;
  background: #fff;
  // box-shadow 0px 11px 16px 0px rgba(94, 195, 241, 0.08)
}

.nav-item {
  display: inline-block;
  height: 80px;
  line-height: 80px;
  padding: 0 20px;
  color: #1D1D1F;
  transition: all 0.2s;

  &:hover {
    background: rgba(224, 235, 241, 0.3);
    color: #6190E8;

    .avatar {
      transform: scale(1.01);
    }
  }

  &:first-of-type:hover {
    background: transparent;
    color: #fff;
  }
}

.logo {
  object-fit: contain;
  max-width: 48px;
  position: relative;
  top: 16px;
}

.fr {
  line-height: 80px;
  height: 80px;
  display: flex;
}

.oprator {
  margin: 0 20px;

  .btn {
    display: inline;
    padding: 10px 20px;
    color: #fff;
    border-radius: 3px;
    font-size: 14px;

    a {
      color: #fff;
    }
  }
}

@media screen and (max-width: 768px) {
  .open {
    position: absolute;
    right: 20px;
    top: 20px;
    font-size: 20px;
    width: 30px;
    padding: 10px 20px;
    cursor: pointer;
    text-align: center;
    display: inline-block;
  }

  .close {
    width: 32px;
    height: 32px;
    position: absolute;
    top: 15px;
    line-height: 32px;
    right: 15px;
    font-size: 36px;
    cursor: pointer;
    text-align: center;
    color: rgba(226, 78, 78, 0.86);
  }

  .oprator {
    line-height: 1;
    margin: 0 10px;

    .btn {
      display: flex;

      a {
        display: inline-block;
        width: 49%;
      }
    }
  }

  .fr {
    padding-top: 50px;

    &.show {
      display: flex;
      flex-direction: column;
      z-index: 10;

      &:hover {
        color: #6190E8;
      }

      & ~ .open {
        display: none;
        z-index: 20;
      }

      & ~ .close {
        display: inline-block;
        z-index: 20;
      }
    }

    display: none;
    position: fixed;
    top: 0;
    background: #fff;
    bottom: 0;
    left: 0;
    right: 0;
    min-height: 100vh;
    text-align: center;
  }
}
</style>
