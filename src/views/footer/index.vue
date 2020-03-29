<template>
  <footer class="footer">
    <div class="bottom-footer">
      <biography class="relatively"></biography>
      <div class="slightly">
        <footright class="item footright"></footright>
        <recent class="item recent"></recent>
        <categories class="item categories"></categories>
      </div>
    </div>
    <copyright></copyright>
  </footer>
</template>

<script>
import copyright from "./copyright";
import recent from "./recent";
import biography from "./biography";
import footright from "./footright";
import categories from "./categories";

export default {
  components: {
    biography,
    recent,
    copyright,
    footright,
    categories
  }
};
</script>
<style lang="scss" scoped>
@media screen and (min-width: 1100px) {
  .footer {
    max-width: 1035px;
    margin-left: auto;
    margin-right: auto;
    display: flex;
    flex-direction: column;

    .bottom-footer {
      display: flex;
      flex-direction: row;
      margin-bottom: 70px;
      justify-content: space-between;

      .relatively {
        flex-basis: 33%;
        padding-right: 40px;
      }

      .slightly {
        flex-basis: 77%;
        display: flex;

        .item {
          flex-basis: 33.333%;
        }

        .footright {
          padding-right: 20px;
        }

        .recent {
          padding: 0 20px;
        }
      }
    }
  }
}

@media screen and (max-width: 1100px) {
  .footer {
    box-sizing: border-box;
    display: block;
    flex-direction: column;

    .bottom-footer {
      display: flex;
      flex-direction: column;

      .slightly {
        display: flex;
        flex-direction: column;
      }
    }
  }
}

.footer {
  padding-top: 70px;
  border-top: solid 1px #e6e6e6;
}
</style>