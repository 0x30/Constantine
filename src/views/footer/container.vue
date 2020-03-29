<template>
  <div class="container">
    <h2 class="container-title">{{ title }}</h2>
    <slot></slot>
  </div>
</template>

<script>
export default {
  props: {
    title: String
  }
};
</script>

<style lang="scss" scoped>
.container {
  display: flex;
  flex-direction: column;

  .container-title {
    font-size: 1.5rem;
    margin-bottom: 30px;
    text-transform: capitalize;
  }

  @media screen and (max-width: 1100px) {
    .container-title {
      font-size: 1.2rem;
      margin-bottom: 40px;
    }
  }
}

@media screen and (max-width: 1100px) {
  .container {
    margin-bottom: 40px;
  }
}
</style>