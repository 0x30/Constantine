<template>
  <div id="app">
    <div class="main">
      <HeaderVue />
      <router-view :key="$route.fullPath"></router-view>
    </div>
    <FooterVue />
  </div>
</template>

<script>
import Vue from "vue";

import HeaderVue from "./components/Header.vue";
import FooterVue from "./components/Footer.vue";

export default Vue.extend({
  name: "app",
  data() {
    return {};
  },
  components: {
    HeaderVue,
    FooterVue
  },
  mounted() {}
});
</script>

<style lang="scss" scoped>
.main {
  background: var(--bg-color);
  box-shadow: 3px 3px 10px 0px var(--md-char-color);
  width: 820px;
  margin: 0 auto;
  margin-top: 60px;

  line-height: 2rem;
  letter-spacing: 0.1px;

  border-radius: 1px;
}
</style>
