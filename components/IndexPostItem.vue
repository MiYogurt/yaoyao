<template>
  <div class="post-item columns" v-if="post">
    <div class="column">
      <img v-if="avatar" :src="avatar" :alt="post.author.username" class="avatar">
    </div>
    <div class="column is-8">
      <nuxt-link :to="{ name: 'post-id', params: {id: post.objectId}}" class="title" v-text="post.title"></nuxt-link> 
      <div class="info">
        <div class="post-tag-list">
          <span class="tag" v-if="post.top"><i class="fas fa-thumbtack"></i></span>
          <nuxt-link :to="{name:'index', query: {category: post.category.name}}" class="tag">{{ post.category.name }}</nuxt-link>
          <nuxt-link :to="{name:'index', query: {tag: tag.name}}" class="tag" v-for="tag in post.tags" :key="tag.objectId">{{ tag.name }}</nuxt-link>
        </div>
        <span class="time-ago">在{{ post.createdAt | ago }}</span>
        <span class="author">由
          <nuxt-link :to="{name:'user-id', params: {id: post.author.objectId}}">{{post.author.username}}</nuxt-link> 发布</span>
      </div>
    </div>
    <div class="column is-3 count-group">
      <div class="replay-count">
        <span class="count">{{ post.comments ? post.comments.length : 0  }}</span>
        <span>回复</span>
      </div>
      <div class="view-count">
        <span class="count">{{ post.view | k }}</span>
        <span>查看</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ['post'],
  name: 'index-post-item',
  computed: {
    avatar(){
      return process.env.cdnUrl + this.post.author.avatar
    }
  }
}
</script>

<style lang="stylus" scoped>
.tag {
  background: #fdfdfd;
  padding: 0.5rem;
  color: #51678f;
  font-size: 0.7rem;
  white-space: nowrap;
  margin: 0.2rem;
  border-radius: 2px;
  border: 1px solid #eee;
  cursor: pointer;
  text-decoration: none;

  &:hover {
    background: linear-gradient(to right, #49a8fc 0%, #52c1ed 100%);
    color: #fff;
    border-color: #52c1ed;
  }

  .info & {
    font-size: 0.5rem;
    padding: 0.2rem 0.4rem;
    background: #eee;
    color: #15274969;
    border: none;
  }
}

@media (max-width: 768px) {
  .right-list-group {
    display: none;
  }

  .post-list-group.is-9 {
    width: 100%;
  }
}

.post-item {
  margin: 2rem 0;

  .title {
    margin: 0 0 8px 1rem;
    font-weight: normal;
    font-size: 18px;
    line-height: 1.2;
    display: block;
    color: #51678f;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;

    &:hover {
      color: #2a5094;
    }
  }
}

.info {
  margin-left: 12px;
  line-height: 1.5;
}

.post-tag-list {
  display: inline-block;
}

.time-ago, .author {
  font-size: 0.6rem;
  color: #15274969;

  a {
    color: #15274969;

    &:hover {
      color: #333;
    }
  }
}

.replay-count, .view-count {
  display: inline-flex;
  flex-direction: column;
  text-align: center;
  padding: 0 1rem;

  .count {
    padding-bottom: 0.5rem;

    & ~ span {
      font-size: 0.5rem;
    }
  }
}

.count-group {
  text-align: center;
  color: #15274969;
  margin-left: auto;
  display: flex;
  justify-content: flex-end;
}

.avatar {
  width: 48px;
  height: 48px;
  border-radius: 5px;
  object-fit: cover;
}

.post-list-group {
  padding-right: 2rem;
  box-sizing: border-box;
}
</style>
