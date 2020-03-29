<template>
  <container title="FOOTER RIGHT">
    <span class="value">
      3 Footer Right widget areas are displayed on the right side of the footer, and the width is auto-adjusted based on how many you use. If you do
      not use the area, nothing will be displayed.
    </span>
  </container>
</template>

<script>
import container from "./container";
export default {
  components: { container }
};
</script>

<style lang="scss" scoped>
.value {
  color: #666;
  font-size: 1.2rem;
}
</style>