<template>
  <div>
    <article class="post-line" v-for="(post, index) in posts" v-bind:key="index">
      <router-link class="no-primary-color-link" :to="post.data.url">
        <h2>{{ post.data.title }}</h2>
      </router-link>
      <p v-html="post.excerptHtml" class="excerpt"></p>
      <div class="footer">
        <span class="date-time">{{ new Date(post.data.date).toLocaleString() }}</span>
        <tag-view class="tags" :tags="post.data.tags || []" />
      </div>
    </article>
  </div>
</template>

<script>
import TagsVue from "./Tags.vue";

export default {
  props: {
    posts: Array
  },
  components: {
    "tag-view": TagsVue
  }
};
</script>

<style lang="scss" scoped>
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

    .date-time {
      letter-spacing: 0.12rem;
    }

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
