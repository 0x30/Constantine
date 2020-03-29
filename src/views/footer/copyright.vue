<template>
  <div class="copyright">
    <span class="text"> Powered by WordPress | Theme: Write by Themegraphy</span>
  </div>
</template>

<style lang="scss">
@media screen and (max-width: 1100px) {
  .text {
    font-size: 1rem;
  }
}

@media screen and (min-width: 1100px) {
  .text {
    font-size: 1.2rem;
  }
}

.copyright {
  display: flex;
  justify-content: center;
  padding-top: 60px;
  border-top: solid 1px #e6e6e6;

  .text {
    display: block;
    color: #666;
  }
}
</style>