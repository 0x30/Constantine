<template>
  <container title="CATEGORIES">
    <span class="categories-item" v-for="cate in categories" :key="cate">{{ cate }}</span>
    <input class="categories-search" type="text" placeholder="Search..." />
  </container>
</template>

<script>
import container from "./container";
export default {
  components: { container },
  data() {
    return {
      categories: ["Post Formats", "Sample Post", "Standard Post"]
    };
  }
};
</script>

<style lang="scss" scoped>
.categories-item {
  color: #666;
  font-size: 1.2rem;
}

.categories-search {
  margin-top: auto;
  max-width: 320px;
  width: 100%;
  border: solid 1px #e6e6e6;
  padding: 0.6rem;
  box-sizing: border-box;
  margin-top: 30px;
}
</style>