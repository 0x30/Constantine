<template>
  <div class="header">
    <div class="icon"><i class="fa fa-terminal" aria-hidden="true"></i></div>
    <div class="info">
      <span>Gavin,IOS Dever,Vue Dever</span>
      <div class="contact-info">
        <i class="fab fa-instagram" aria-hidden="true"></i>
        <i class="fab fa-weibo" aria-hidden="true"></i>
        <i class="fab fa-twitter" aria-hidden="true"></i>
        <i class="fab fa-weixin" aria-hidden="true"></i>
      </div>
    </div>
  </div>
</template>

<script>
export default {};
</script>

<style lang="scss" scoped>
.header {
  padding: 100px 40px;
  display: flex;
  justify-content: space-between;

  color: var(--text-color);
  .icon {
    font-size: 5rem;
  }

  .info {
    display: flex;
    flex-direction: column;
    align-items: flex-end;

    .contact-info {
      display: flex;

      i {
        padding: 4px;
      }
    }
  }
}
</style>
