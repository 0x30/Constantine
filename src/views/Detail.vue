<template>
  <div class="markdown-body" v-if="post">
    <div class="post-header">
      <h1>{{ post.data.title }}</h1>
      <p class="art-date-font-style">{{ new Date(post.data.date).toLocaleString() }}</p>
    </div>
    <article v-if="post" v-html="post.contentHtml"></article>
    <tag-view class="post-footer" :tags="post.data.tags || []" />
  </div>
</template>

<script>
import { posts } from "@/models/Posts";
import TagsVue from "../components/Tags.vue";
export default {
  data() {
    return {
      posts: posts,
      post: undefined
    };
  },
  components: {
    "tag-view": TagsVue
  },
  mounted: function() {
    this.posts[this.$attrs.title]().then(res => (this.post = res.default));
  }
};
</script>

<style lang="scss" scoped>
.post-header {
  line-height: 2rem;

  display: flex;
  flex-direction: column;

  p {
    align-self: flex-end;
    font-size: 0.9rem;
    color: var(--meta-content-color);
  }
}

.post-footer {
  display: flex;
  justify-content: flex-end;

  font-size: 0.9rem;
}
</style>
