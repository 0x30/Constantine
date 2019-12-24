<template>
  <div class="header">
    <div class="info">
      <h4>Gavin,IOS Dever,Vue Dever</h4>
      <div class="contact-info">
        <a href="#"><i class="fab fa-instagram" aria-hidden="true"></i></a>
        <a href="#"><i class="fab fa-weibo" aria-hidden="true"></i></a>
        <a href="#"><i class="fab fa-twitter" aria-hidden="true"></i></a>
        <a href="#"><i class="fab fa-weixin" aria-hidden="true"></i></a>
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
  justify-content: flex-end;

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
      margin-top: 10px;

      i {
        padding: 4px;
      }

      i:hover {
        opacity: 0.8;
      }
    }
  }
}
</style>
