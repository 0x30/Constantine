<template>
  <div v-html="post.contentHtml" class="markdown-body"></div>
</template>

<script>
import "highlight.js";
import "@/assets/styles/github-markdown.scss";

export default {
  props: {
    post: Object
  }
};
</script>
