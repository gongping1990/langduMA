<template>
  <div class="ld-my-card">
    <scroll-view class="ld-my-card-wrap"
                 @scrolltolower="bindLoadItem"
                 scroll-y
                 @scroll="scrollTopFn"
                 scroll-with-animation>
      <div class="ld-my-card-header">
        <div class="-header-text">
          <span class="-header-text-num">4</span> 张成就卡
        </div>
      </div>

      <div class="ld-my-card-content">
        <div class="-content-item" v-for="(item, index) of 5" :key="index">
          <div class="-content-item-img"
               style="background: url('https://pub.file.k12.vip/2019/03/25/1110002707316191234.png') no-repeat;background-size: cover;">
            <div class="-content-item-img-header">12名</div>
            <div class="-content-item-img-footer">
              <img class="-image" src="https://pub.file.k12.vip/read/lesson/kczy-icon-good.png"/>
              <div>1991</div>
            </div>
          </div>
          <div class="-content-item-text">
            <div class="-text-name">《春天来了来了来了来了》</div>
            <div class="-text-time">日期: 2019-03-20</div>
          </div>
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
      }
    },

    created() {

    }
  };
</script>

<style>
  .wux-grid__inner {
    padding: 0 0 20px 0 !important;
  }
</style>
<style lang="scss" scoped>
  .ld-my-card {
    background: #ffffff;
    padding: 0 24px;

    &-wrap {
      height: 100vh;
    }

    &-header {
      padding: 16px 0;

      .-header-text {
        font-size: 14px;
        font-weight: bold;
        color: rgba(74, 74, 74, 1);
        line-height: 26px;

        &-num {
          font-size: 28px;
          font-weight: bold;
          color: #30C0FFFF;
        }
      }
    }

    &-content {
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;

      .-content-item {
        margin-bottom: 24px;

        &-img {
          position: relative;
          width:155px;
          height:207px;
          box-shadow:2px 2px 12px -2px rgba(201,214,219,1);
          border-radius:6px;


          &-header {
            text-align: center;
            font-size: 10px;
            font-weight: 400;
            color: rgba(255, 255, 255, 1);
            line-height: 24px;
            width: 101px;
            height: 24px;
            background: rgba(155, 155, 155, 1);
            border-radius: 6px 6px 0px 0px;
          }

          &-footer {
            position: absolute;
            bottom: 0;
            right: 0;
            display: flex;
            justify-content: center;
            align-items: center;
            text-align: center;
            font-size: 12px;
            font-weight: 400;
            color: rgba(255, 255, 255, 1);
            line-height: 20px;
            width: 60px;
            height: 20px;
            background: rgba(0,0,0,0.16);
            border-radius: 100px 0 20px 0;

            .-image{
              margin-right: 4px;
              width:11px;
              height:11px;
            }
          }
        }

        &-text {

          .-text-name {
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            margin: 16px 0 4px 0;
            width: 144px;
            font-size: 16px;
            font-weight: 500;
            color: rgba(29,27,27,1);
            line-height: 22px;
          }

          .-text-time {
            height: 14px;
            font-size: 10px;
            font-weight: 300;
            color: rgba(74, 74, 74, 1);
            line-height: 14px;
          }
        }
      }
    }

  }
</style>
