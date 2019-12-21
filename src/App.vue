<template>
  <div id="app">
    <HeaderVue />
    <PostVue />
  </div>
</template>

<script>
import { posts } from "@/models/Posts";
import Vue from "vue";

import PostVue from "./components/Post.vue";
import HeaderVue from "./components/Header.vue";

export default Vue.extend({
  name: "app",
  data() {
    return {
      posts: posts,
      current: posts[0]
    };
  },
  components: {
    PostVue,
    HeaderVue
  },
  mounted() {
    // new Date().toLocaleString()
    this.posts = this.posts.sort(
      (p1, p2) => new Date(p2.data.date) - new Date(p1.data.date)
    );
  }
});
</script>
