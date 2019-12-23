<template>
  <div class="markdown-body">
    <article v-if="post" v-html="post.contentHtml"></article>
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
  mounted() {
    Promise.all(this.pages[this.$attrs.page].map(f => f())).then(res => (this.post = res[this.$attrs.index].default));
  }
};
</script>

<style lang="scss" scoped></style>
