<template>
  <div class="markdown-body main">
    <article class="post-line" v-for="(post, index) in posts" v-bind:key="index">
      <h1>{{ post.data.title }}</h1>
      <p v-html="post.excerptHtml" class="excerpt"></p>
      <div class="footer">
        <span class="date-time">{{ new Date(post.data.date).toLocaleString() }}</span>
        <div class="tags">
          <span v-for="(tag, index) in post.data.tags" v-bind:key="index">{{ tag }}</span>
        </div>
      </div>
    </article>
  </div>
</template>

<script>
import { pages } from "@/models/Posts";

export default {
  data() {
    return {
      page: 0,
      pages: pages,
      posts: []
    };
  },
  mounted() {
    Promise.all(this.pages[this.page].map(f => f()))
      .then(res => res.map(re => re.default))
      .then(res => (this.posts = res));
  }
};
</script>

<style lang="scss" scoped>
.main {
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
