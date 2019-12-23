<template>
  <div class="markdown-body">
    <article class="post-line" v-for="(post, index) in posts" v-bind:key="index">
      <router-link v-if="nextPage" :to="nextPage" @click="toNextPage">
        <h2>{{ post.data.title }}</h2></router-link
      >
      <p v-html="post.excerptHtml" class="excerpt"></p>
      <div class="footer">
        <span class="date-time">{{ new Date(post.data.date).toLocaleString() }}</span>
        <div class="tags">
          <span v-for="(tag, index) in post.data.tags" v-bind:key="index">{{ tag }}</span>
        </div>
      </div>
    </article>
    <router-link v-if="nextPage" :to="nextPage" @click="toNextPage" class="next-page">查看更多</router-link>
  </div>
</template>

<script>
import { pages } from "@/models/Posts";

export default {
  data() {
    return {
      pages: pages,
      posts: []
    };
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
  },
  activated() {
    console.log(this.$attrs.page);
  },
  methods: {
    toNextPage() {
      this.$router.push(this.nextPage);
    }
  }
};
</script>

<style lang="scss" scoped>
.post-line {
  padding: 40px 0;
  border-bottom: 1px solid var(--code-border-color);

  .excerpt {
    line-height: 2rem;
  }

  .footer {
    padding: 10px 0;
    opacity: 0.6;

    font-size: 0.7rem;
    color: var(--meta-content-color);

    display: flex;

    .date-time {
      letter-spacing: 0.12rem;
    }

    .tags {
      margin-left: 8px;
      text-transform: capitalize;

      span:not(:last-child)::after {
        content: " ";
      }
    }
  }
}

div.markdown-body {
  display: flex;
  flex-direction: column;

  a {
    color: var(--text-color);
  }

  a:active,
  a:visited,
  a:link {
    text-decoration: none;
  }

  a:hover {
    text-decoration: underline;
  }
}

.next-page {
  font-size: 1.07rem;
  padding: 23px 5px;

  align-self: flex-end;
}
</style>
