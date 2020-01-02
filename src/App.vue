<template>
  <div id="app">
    <div class="main">
      <HeaderVue />
      <router-view :key="$route.path"></router-view>
    </div>
    <FooterVue />
  </div>
</template>

<script>
import Vue from "vue";

import HeaderVue from "./components/Header.vue";
import FooterVue from "./components/Footer.vue";

export default Vue.extend({
  components: {
    HeaderVue,
    FooterVue
  }
});
</script>

<style lang="scss" scoped>
.main {
  width: 820px;
  margin: 0 auto;
  margin-top: calc(var(--safe-area-inset-top) + 40px);

  letter-spacing: 0.15px;

  padding: 0 30px;

  box-sizing: border-box;
}

@media (max-width: 820px) {
  .main {
    width: 100%;
  }
}
</style>
