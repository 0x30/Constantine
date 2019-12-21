<template>
  <div id="app">
    <div
      v-for="(post, index) in posts"
      v-bind:key="index"
      @click="current = post"
    >
      <span>{{ new Date(post.data.date).toLocaleString() }} --- {{ post.data.title }}</span>
    </div>
    <PostVue :post="current" />
    <router-view></router-view>
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
      posts: posts,
      current: posts[0]
    };
  },
  components: {
    PostVue
  },
  mounted() {
    // new Date().toLocaleString()
    this.posts = this.posts.sort(
      (p1, p2) => new Date(p2.data.date) - new Date(p1.data.date)
    );
  }
});
</script>
