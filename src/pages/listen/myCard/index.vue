<template>
  <div class="ld-my-work">
    <div class="ld-my-work-header">
      <div class="-header-top">
        <div class="-header-top-img"></div>
        <div class="-header-top-name">heaven小林哥的宝宝</div>
      </div>
      <div class="-header-down">《天地人》作品集</div>
    </div>

    <scroll-view class="ld-my-work-wrap"
                 @scrolltolower="bindLoadItem"
                 scroll-y
                 @scroll="scrollTopFn"
                 scroll-with-animation>
      <div class="ld-my-work-footer">
        <div class="-footer-item" v-for="(item, index) of 2" :key="index">
          <div class="-item-tip" v-if="index==0">赞最多</div>
          <div class="-item-left">
            <div class="-item-title">《天气人》</div>
            <div class="-item-title-two">日期: 2019-03-22</div>
            <div class="-item-num">2933</div>
          </div>
          <div class="-item-center"></div>
          <div class="-item-right"></div>
        </div>
      </div>
    </scroll-view>

  </div>
</template>

<script>

  export default {

    data() {
      return {
        page: {
          current: 1,
          size: 20,
          total: ""
        },
        isFetching: false,
        dataList: []
      };
    },

    components: {},

    methods: {
      bindLoadItem() {
        console.log(111);
        if (this.page.current < Math.ceil(this.page.total / this.page.size)) {
          this.page.current++;
          // this.getList()
        }
      },
    },

    created() {

    }
  };
</script>

<style lang="scss" scoped>
  .ld-my-work {
    overflow: hidden;
    background: #ffffff;

    &-header {
      padding: 16px 24px;
      width: 100%;
      /*height: 104px;*/
      background: rgba(255, 255, 255, 1);
      box-shadow: 0px 4px 4px 0px rgba(0, 0, 0, 0.03);

      .-header-top {
        display: flex;
        align-items: center;
        margin-bottom: 19px;

        &-img {
          border-radius: 50%;
          width:28px;
          height:28px;
          background:rgba(216,216,216,1);
          margin-right: 12px;
        }

        &-name {
          height:21px;
          font-size:15px;
          font-weight:400;
          color:rgba(74,74,74,1);
          line-height:21px;
        }
      }

      .-header-down {
        height: 28px;
        font-size: 20px;
        font-weight: 500;
        color: rgba(74, 74, 74, 1);
        line-height: 28px;
      }
    }

    &-wrap {
      height: calc(100vh - 114px);
    }

    &-footer {
      margin: 0 24px;

      .-footer-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        position: relative;
        padding: 16px 24px;
        margin: 24px 0;
        border-radius: 6px;
        border: 1px solid rgba(236, 236, 236, 1);

        .-item-tip {
          position: absolute;
          top: 0;
          right: 0;
          width:44px;
          height:18px;
          background:rgba(155,155,155,1);
          border-radius:0px 6px 0px 100px;
          font-size:10px;
          font-weight:400;
          color:rgba(255,255,255,1);
          line-height:18px;
          text-align: center;
        }

        .-item-left {
          width: 60%;

          .-item-title {
            font-size: 16px;
            font-weight: 500;
            color: rgba(74, 74, 74, 1);
            line-height: 22px;
          }

          .-item-title-two {
            margin-top: 4px;
            font-size: 12px;
            font-weight: 300;
            color: rgba(236, 236, 236, 1);
            line-height: 14px;
          }

          .-item-num {
            margin-top: 12px;
            font-size: 12px;
            font-weight: 400;
            color: rgba(74, 74, 74, 1);
            line-height: 17px;
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
  }
</style>
