<template>
  <div>
    <router-link v-for="(tag, i) in tags" :to="'/tags/' + tag" class="no-primary-color-link" v-bind:key="i">{{ tag }}</router-link>
  </div>
</template>
<script>
export default {
  props: {
    tags: Array
  }
};
</script>
<style lang="scss" scoped>
a:not(:last-child)::after {
  content: "，";
}
</style>
