<template>
  <post-list-view :posts="posts" :next-page="nextPage" />
</template>

<script>
import { pages } from "@/models/Posts";
import PostsVue from "../components/Posts.vue";

export default {
  data() {
    return {
      pages: pages,
      posts: []
    };
  },
  components: {
    "post-list-view": PostsVue
  },
  computed: {
    nextPage() {
      if (this.$attrs.page < this.pages.length - 1) return `/${this.$attrs.page + 1}`;
      return undefined;
    }
  },
  mounted() {
    Promise.all(this.pages[this.$attrs.page].map(f => f()))
      .then(res => res.map(re => re.default))
      .then(res => (this.posts = res));
  }
};
</script>
