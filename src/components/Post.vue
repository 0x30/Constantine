<template>
  <div class="markdown-body" v-html="post.contentHtml"></div>
</template>

<script>
import post_67 from "../../articles/测试.md";

// import "@/assets/styles/ursine/ursine-umbra.scss"
import "@/assets/styles/ursine/ursine-polar.scss"

export default {
  props: {
    post: Object
  }
};
</script>
