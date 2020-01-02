<template>
  <header id="header" class="header ">
    <logo-view class="logo" />
    <span class="title">Gavin site.</span>
    <router-link to="#" class="no-primary-color-link">Home</router-link>
    <router-link to="#" class="no-primary-color-link">Tags</router-link>
    <router-link to="#" class="no-primary-color-link">Cateroys</router-link>
    <router-link to="#" class="no-primary-color-link">About</router-link>
    <router-link to="#" class="no-primary-color-link">Cateroys</router-link>
  </header>
</template>

<script>
import LogoVue from "./Logo.vue";

export default {
  components: {
    "logo-view": LogoVue
  },
  async mounted() {
    await this.$nextTick();
    const observer = new IntersectionObserver(enries => document.querySelector("#header").setAttribute("sticky", enries[0].isIntersecting));
    observer.observe(document.querySelector("#header-observe-div"));
  }
};
</script>

<style>
#header-observe-div {
  position: absolute;
  height: 50px;
  left: 0;
  right: 0;
  top: 0;
}
</style>

<style lang="scss" scoped>
.header {
  color: var(--text-color);
  background-color: var(--bg-color);

  position: sticky;
  top: 0;

  z-index: 1;

  display: flex;
  flex-direction: row;
  align-items: center;

  padding: 0 20px;

  .logo {
    width: 50px;
    height: 50px;
  }

  a {
    padding: 0 8px;
    &:first-of-type {
      margin-left: auto;
    }
  }
}
</style>

<style lang="scss" scoped>
.to-top {
  position: absolute;
  bottom: 30px;
  right: 30px;
}
</style>

<style lang="scss" scoped>
.header {
  transition: 0.5s;

  will-change: font-size, box-shadow;

  .logo {
    transition: 0.5s;
    will-change: width, height, stroke-width;
  }

  .title {
    transition: 0.5s;
    will-change: font-size, font-weight;
  }
}

.header[sticky="true"] {
  height: 80px;

  .logo {
    width: 50px;
    height: 50px;
    stroke-width: 80;
  }

  .title {
    font-size: 18px;
    font-weight: bold;
  }
}

.header[sticky="false"] {
  height: 60px;
  .logo {
    width: 30px;
    height: 30px;

    stroke-width: 20;
  }

  .title {
    font-size: 14px;
  }

  font-size: 14px;
  box-shadow: 0 1px 10px var(--md-char-color);
}
</style>