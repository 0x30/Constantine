<template>
  <div class="observe-view" id="observe-header-view" ref="obview"></div>
</template>

<script>
import { mapMutations } from "vuex";

export default {
  async mounted() {
    await this.$nextTick();
    const observer = new IntersectionObserver(enries => this.setIsNavgationBarSticky(`${enries[0].isIntersecting}`));
    observer.observe(this.$refs.obview);
  },
  methods: {
    ...mapMutations(["setIsNavgationBarSticky"])
  }
};
</script>

<style scoped>
.observe-view {
  position: absolute;
  height: 100px;
  left: 0;
  right: 0;
  top: 0;
}
</style>