<template>
  <div id="app">
    <div v-html="post.contentHtml"></div>

    <PostVue :post="post" />
  </div>
</template>

<script>
import { posts } from "@/models/Posts";
import Vue from "vue";
import PostVue from "./components/Post.vue";

export default Vue.extend({
  name: "app",
  data() {
    return {
      post: posts[0]
    };
  },
  components: {
    PostVue
  },
  mounted() {
    console.log(posts);
  }
});
</script>

