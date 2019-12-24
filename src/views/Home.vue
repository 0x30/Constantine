<template>
  <div class="markdown-body">
    <post-list-view v-if="posts" :posts="posts" :pagePrefix="`post/${$attrs.page}/`" />
    <router-link v-if="nextPage" :to="nextPage" class="next-page no-primary-color-link">查看更多</router-link>
  </div>
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
      .then(res => {
        for (const [index, re] of res.entries()) {
          re.data["url"] = `post/${this.$attrs.page}/${index}`;
        }
        this.posts = res;
      });
  }
};
</script>

<style lang="scss" scoped>
div.markdown-body {
  display: flex;
  flex-direction: column;
}

.next-page {
  font-size: 1.07rem;
  padding: 23px 5px;

  align-self: flex-end;
}
</style>
