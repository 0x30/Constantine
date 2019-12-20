<template>
  <div v-html="post.contentHtml"></div>
</template>

<script>
import "highlight.js";
import "highlight.js/styles/atom-one-dark.css";

export default {
  props: {
    post: Object
  }
};
</script>
