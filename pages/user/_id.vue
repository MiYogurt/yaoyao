<template>
  <div>
    <div class="container">
        <div class="top columns" v-if="user">
          <div class="column is-2">
            <img :src="innerAvatar" class="avatar" v-if="user.avatar">
          </div>
          <div class="column is-10">
            <h2 class="username">{{ user.username }} 
              <!-- <span class="designation"><i class="fas fa-chess-queen"></i>论坛女皇</span> -->
            </h2>
            <div class="tag-list">
              <span class="tag" v-for="(tag, i) in user.tags" :key="i" :style="{
                background: `rgba(${tag.bgColor.rgba.r},${tag.bgColor.rgba.g},${tag.bgColor.rgba.b}, ${tag.color.rgba.a}`,
                color: `rgbaa(${tag.color.rgba.r},${tag.color.rgba.g},${tag.color.rgba.b}, ${tag.color.rgba.a}`,
              }">{{tag.text}}</span>
            </div>
            <p class="desc">{{user.description}}</p>
          </div>
        </div>
      </div>
      <div class="middle">
        <div class="container columns">
          <div class="column is-2">
            <ul class="menu-list">
              <!-- <nuxt-link :to="{name:'user-id-article'}" class="item"><i class="fas fa-feather"></i> 文章</nuxt-link> -->
              <nuxt-link :to="{name:'user-id-comment'}" class="item"><i class="fas fa-hashtag"></i> 回复</nuxt-link>
              <nuxt-link :to="{name:'user-id-post'}" class="item"><i class="fas fa-comment-alt"></i> 帖子</nuxt-link>
              <div class="sep"></div>
              <nuxt-link :to="{name:'user-id-collection'}" class="item"><i class="fas fa-heart"></i> 收藏</nuxt-link>
            </ul>
          </div>
          <div class="column is-10 user-detail">
            <nuxt-child />
          </div>
        </div>
      </div>
    </div>
</template>

<script>
import { mapState } from 'vuex';
export default {
  data() {
    return {
      user: {}
    }
  },
  head () {
    return {
      title: (this.user.username ? this.user.username +'的' : '')  + '个人中心',
      meta: [
        { hid: 'description', name: 'description', content: '用户个人中心' }
      ]
    }
  },
  computed: {
    innerAvatar(){
      return process.env.cdnUrl + this.user.avatar
    },
  },
  methods: {
    async User(){
      let user = this.$parse.User.createWithoutData(this.$route.params.id)
      await user.fetch()
      return user.toJSON()
    }
  },
  mounted() {
    this.User().then(user => {
      user.tags = JSON.parse(user.tags)
      this.user = user
      console.log(user);
    })
  },
}
</script>

<style lang="stylus" scoped>
center(){
  justify-content: center;
  display: flex;
  align-items: center;
}

.user-detail{
  padding 1rem

  @media (max-width: 800px) {
    margin-top: 2rem
  }
}

.avatar {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  object-fit: cover;
}

.top {
  color: #1d1d1f;
  margin: 2rem 0;
  .desc {
    font-size: .9rem;
  }
  .is-2 {
    center()

    @media (max-width 800px) {
      display: none;

      & ~ .is-10 {
        width: 100%;
        margin: 1rem;
      }
    }
  }
  .tag-list {
    margin-bottom: 1.5rem;
  }
  h2.username {
    font-size: 1.5rem;
    margin-bottom: .5rem;
    display: flex;
    align-items: center;
    span {
      font-size: .7rem
      margin-left: .5rem
      padding: 3px
      color: #7773f7
      i {
        margin-right: .2rem
      }
    }
  }
}
.middle {
  background #fff
  padding 1rem
  li {
    list-style: none;
  }

  @media (max-width 800px){
    .columns {
      flex-direction: column;
      .is-2, .is-10 {
        width 100%
      }
    }

  }
  .is-10 {
    min-height: 53vh;
  }
}

.menu-list {
  border-right: #f8faff;
  .sep {
    border-bottom:  1px solid #f8faff
    padding-top 1rem
    margin-bottom 1rem
  }
  .item {
    display: block
    padding .8rem
    margin .2rem 0
    color #516991
    transition all .1s
    border-left: 1px solid transparent

    &:hover,
    &.active,
    &.nuxt-link-exact-active {
      color: #52c1ed
      border-left: 1px solid
    }
    i {
      font-size .8rem
      display: inline-block
      width: 20px
    }
  }
}
</style>


<style lang="stylus">
.none{
  color #d8d8d8
  height 200px
  display flex 
  justify-content center
  align-items center
  font-size 2rem
}
</style>
