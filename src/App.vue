<template>
  <div id="app">
    <sticky-view />
    <header-view />
    <router-view :key="$route.path" class="main"></router-view>
    <footer-view />
    <bottom-ass-view />
  </div>
</template>

<script>
import Vue from "vue";

import HeaderVue from "./components/Header.vue";
import FooterVue from "./components/Footer.vue";
import StickyObserveVue from "./components/StickyObserve.vue";
import BottomAssemblyVue from "./components/BottomAssembly.vue";

export default Vue.extend({
  components: {
    "bottom-ass-view": BottomAssemblyVue,
    "header-view": HeaderVue,
    "footer-view": FooterVue,
    "sticky-view": StickyObserveVue
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
