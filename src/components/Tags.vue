<template>
  <div>
    <a v-for="(tag, i) in tags" :href="'/tag/' + tag" class="no-primary-color-link" v-bind:key="i">{{ tag }}</a>
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
