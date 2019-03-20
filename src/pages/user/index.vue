<template>
  <div class="ld-user">
    <div class="ld-user-header"></div>
    <div class="ld-user-footer">
      <div class="-footer-title">作品集</div>
      <div class="-footer-item" v-for="(item, index) of 2" :key="index">
        <div class="-item-left">
          <div class="-item-title">《天气人》</div>
          <div class="-item-title-two">二年级 上册 | 日期: 2019-03-22</div>
          <div class="-item-num">2933</div>
        </div>
        <div class="-item-center"></div>
        <div class="-item-right"></div>
      </div>
    </div>
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
          <div class="-text-wrap-item">
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

    &-footer {
      margin: 0 24px;

      .-footer-title {
        margin-top: 103px;
        font-size: 17px;
        font-weight: 500;
        color: rgba(74, 74, 74, 1);
      }

      .-footer-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 16px 24px;
        margin: 16px 0;
        border-radius: 6px;
        border: 1px solid rgba(236, 236, 236, 1);

        .-item-left {

          .-item-title {
            font-size: 16px;
            font-weight: 500;
            color: rgba(74, 74, 74, 1);
            line-height:22px;
          }

          .-item-title-two {
            margin-top: 4px;
            font-size: 12px;
            font-weight: 300;
            color: rgba(236, 236, 236, 1);
            line-height:14px;
          }

          .-item-num {
            margin-top: 12px;
            font-size:12px;
            font-weight:400;
            color:rgba(74,74,74,1);
            line-height:17px;
          }
        }

        .-item-center {
          border-radius: 50%;
          width: 32px;
          height: 32px;
          background: rgba(74, 74, 74, 1);
        }

        .-item-right {
          border-radius: 50%;
          width: 28px;
          height: 28px;
          background: rgba(74, 74, 74, 1);
        }
      }
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
          display: flex;

          &-line {
            border: 1px;
            height: 16px;
            color: #0000001A;
          }

          &-item {
            margin: 0 43px;
          }
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
