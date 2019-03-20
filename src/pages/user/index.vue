<template>
  <div class="ld-user">
    <div class="ld-user-header"></div>
    <div class="ld-user-footer"></div>
    <div class="ld-user-wrap">
      <div class="-img"></div>
      <div class="-name">heaven小林哥</div>
      <div class="-text">
        <div>
          <div class="-text-num">52</div>
          <div class="-text-tip">赞</div>
        </div>
        <div class="-text-wrap">
          <span class="-text-wrap-line"></span>
          <div>
            <div class="-text-num">236</div>
            <div class="-text-tip">成就卡</div>
          </div>
          <span class="-text-wrap-line"></span>
        </div>
        <div>
          <div class="-text-num">7</div>
          <div class="-text-tip">朗读(天)</div>
        </div>

      </div>
    </div>
  </div>
</template>

<script>

  export default {

    data() {
      return {};
    },

    components: {},

    methods: {},

    created() {

    }
  };
</script>

<style lang="scss" scoped>
  .ld-user {
    position: relative;
    background: #ffffff;

    &-header {
      width: 375px;
      height: 131px;
      background: rgba(74, 74, 74, 1);
    }

    &-wrap {
      position: absolute;
      top: 60px;
      left: 24px;
      width: 327px;
      height: 142px;
      text-align: center;
      background: rgba(255, 255, 255, 1);
      box-shadow: 0px 0px 8px 0px rgba(0, 0, 0, 0.1);
      border-radius: 16px;

      .-img {
        position: absolute;
        top: -28px;
        left: 136px;
        width: 56px;
        height: 56px;
        border-radius: 50%;
        background: rgba(216, 216, 216, 1);
        border: 2px solid rgba(255, 255, 255, 1);
      }

      .-name {
        margin-top: 36px;
        font-size: 16px;
        font-weight: 500;
        color: rgba(74, 74, 74, 1);
      }

      .-text {
        display: flex;
        justify-content: space-between;
        align-content: center;
        padding: 24px 24px 17px 24px;

        &-wrap {

        }

        &-num {
          font-size: 22px;
          font-weight: bold;
          color: #4A4A4A;
        }

        &-tip {
          font-size: 12px;
        }
      }
    }
  }
</style>
