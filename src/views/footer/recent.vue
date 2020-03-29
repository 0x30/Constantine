<template>
  <container title="RECENT POSTS">
    <div class="posts">
      <div class="post" v-for="(p, i) in posts" :key="i">
        <span class="title">{{ p.title }}</span>
        <span class="date">{{ p.date }}</span>
      </div>
    </div>
  </container>
</template>

<script>
import container from "./container";
export default {
  components: { container },
  data() {
    return {
      posts: [
        {
          title: "Theme for Writing",
          date: "MSeptember 1, 2018"
        },
        {
          title: "Standard Post with Images",
          date: "March 5, 2018"
        },
        {
          title: "Standard Post with Quotes",
          date: "March 5, 2018"
        }
      ]
    };
  }
};
</script>

<style lang="scss" scoped>
.posts {
  display: flex;
  flex-direction: column;

  .post {
    display: flex;
    flex-direction: column;
    margin-bottom: 10px;
    .title {
      color: #666;

      font-size: 1.2rem;
    }
    .date {
      margin-top: 4px;
      color: #999;
      font-size: 1rem;
    }
  }
}
</style>