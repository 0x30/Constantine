<template>
  <div class="markdown-body">
    <article class="post-line" v-for="(post, index) in posts" v-bind:key="index">
      <router-link class="no-primary-color-link" :to="`/post/${post.data.title}`">
        <h2>{{ post.data.title }}</h2>
      </router-link>
      <p v-html="post.excerptHtml" class="excerpt"></p>
      <div class="footer">
        <span class="art-date-font-style">{{ new Date(post.data.date).toLocaleString() }}</span>
        <tag-view class="tags" :tags="post.data.tags || []" />
      </div>
    </article>
    <router-link v-if="nextPage" :to="nextPage" class="next-page no-primary-color-link">查看更多</router-link>
  </div>
</template>

<script>
import TagsVue from "./Tags.vue";

export default {
  props: {
    nextPage: String,
    posts: Array
  },
  components: {
    "tag-view": TagsVue
  }
};
</script>

<style lang="scss" scoped>
div.markdown-body {
  display: flex;
  flex-direction: column;
}

.next-page {
  font-size: 14px;
  padding: 23px 5px;

  align-self: flex-end;
}

.post-line {
  padding: 40px 0;
  border-bottom: 1px solid var(--code-border-color);

  .excerpt {
    line-height: 2rem;
  }

  .footer {
    padding: 10px 0;
    opacity: 0.6;

    font-size: 0.7rem;
    color: var(--meta-content-color);

    display: flex;

    .tags {
      margin-left: 8px;
      text-transform: capitalize;

      span:not(:last-child)::after {
        content: " ";
      }
    }
  }
}
</style>
