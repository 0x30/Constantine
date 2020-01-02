<template>
  <div class="bottom-assemblys" :sticky="isSticky" @click="clickToTopPostion">
    <div class="item">
      <i class="fa fa-arrow-up" aria-hidden="true"></i>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  computed: {
    ...mapState({ isSticky: "isNavgationBarSticky" })
  },
  methods: {
    clickToTopPostion() {
      document.querySelector("#observe-header-view").scrollIntoView({ behavior: "smooth" });
    }
  }
};
</script>

<style lang="scss">
.bottom-assemblys {
  position: fixed;
  right: 0px;
  bottom: 40px;
  width: 40px;

  border: 1px solid var(--md-char-color);

  .item {
    height: 40px;
    width: 40px;
    display: flex;
    justify-content: center;
    align-items: center;

    color: var(--text-color);
    background-color: var(--bg-color);

    overflow: hidden;
  }

  .item:hover {
    color: var(--meta-content-color);
    background-color: var(--table-head-color);
  }
}

.bottom-assemblys {
  transition: 0.5s;
}

.bottom-assemblys[sticky="true"] {
  opacity: 0;
  transform: translateX(100%);
}

.bottom-assemblys[sticky="false"] {
  opacity: 1;
  transform: translateX(0);
}
</style>