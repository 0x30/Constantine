<template>
  <div class="markdown-body" v-if="post">
    <div class="post-header">
      <h1>{{ post.data.title }}</h1>
      <p>{{ new Date(post.data.date).toLocaleString() }}</p>
    </div>
    <article v-if="post" v-html="post.contentHtml"></article>
    <div class="post-footer">
      <a v-for="(tag, i) in tags" :href="'/tag/' + tag" v-bind:key="i">{{ tag }}</a>
    </div>
  </div>
</template>

<script>
import { pages } from "@/models/Posts";
export default {
  data() {
    return {
      pages: pages,
      post: undefined
    };
  },
  computed: {
    tags() {
      if (this.post === undefined) return undefined;
      // return (this.post.data.tags || []).map(tag => `<a class="special-a-link" href="/tag/${tag}">${tag}</a>`).join("，");
      return this.post.data.tags || [];
    }
  },
  mounted() {
    Promise.all(this.pages[this.$attrs.page].map(f => f())).then(res => (this.post = res[this.$attrs.index].default));
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

  a {
    margin-left: 3px;
    color: var(--meta-content-color);
  }
  a:active,
  a:visited,
  a:link {
    text-decoration: none;
  }
  a:hover {
    text-decoration: underline;
  }
}
</style>
