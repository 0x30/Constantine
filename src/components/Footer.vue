<template>
  <footer class="footer">
    <div class="copyright">power by <a class="no-primary-color-link" href="https://github.com/0x30/Constantine">Constantine</a>,Created by 0x30</div>
  </footer>
</template>

<script>
export default {};
</script>

<style lang="scss" scoped>
footer.footer {
  padding: 20px;
  margin-top: 80px;

  display: flex;
  justify-content: center;
  align-items: flex-end;

  color: var(--md-char-color);

  .copyright {
    font-family: hack;
    font-size: 12px;
  }

  padding-bottom: calc(var(--safe-area-inset-bottom) + 20px);
}
</style>
