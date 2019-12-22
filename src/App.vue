<template>
  <div id="app">
    <HeaderVue />
    <PostVue />
  </div>
</template>

<script>
import Vue from "vue";

import PostVue from "./components/Post.vue";
import HeaderVue from "./components/Header.vue";

export default Vue.extend({
  name: "app",
  data() {
    return {};
  },
  components: {
    PostVue,
    HeaderVue
  },
  mounted() {}
});
</script>
