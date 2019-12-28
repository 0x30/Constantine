<template>
  <post-list-view :posts="posts" :next-page="nextPage" />
</template>

<script>
import { tags } from "@/models/Posts";
import PostsVue from "../components/Posts.vue";

export default {
  data() {
    return {
      tags: tags,
      posts: [],
      pages: []
    };
  },
  components: {
    "post-list-view": PostsVue
  },
  computed: {
    nextPage() {
      if (this.$attrs.page < this.pages.length - 1) return `/tags/${this.$attrs.tag}/${this.$attrs.page + 1}`;
      return undefined;
    }
  },
  mounted() {
    this.pages = this.tags[this.$attrs.tag];
    Promise.all(this.pages[this.$attrs.page].map(f => f())).then(res => (this.posts = res.map(re => re.default)));
  }
};
</script>
