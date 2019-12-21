<template>
  <div id="app">
    <PostVue :post="post" />
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
      post: posts
    };
  },
  components: {
    PostVue
  },
  mounted() {
  }
});
</script>
