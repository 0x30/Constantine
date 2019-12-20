<template>
  <div v-html="post.contentHtml" class="markdown-body"></div>
</template>

<script>
import "highlight.js";
import "@/assets/styles/github-markdown.scss";
import "highlight.js/styles/atom-one-dark.css";

export default {
  props: {
    post: Object
  }
};
</script>
