<template>
  <div class="ld-my-card">
    <scroll-view class="ld-my-card-wrap"
                 @scrolltolower="bindLoadItem"
                 scroll-y
                 @scroll="scrollTopFn"
                 scroll-with-animation>
      <div class="ld-my-card-header" v-if="dataList.length">
        <div class="-header-text">
          <span class="-header-text-num">{{page.total}}</span> 张成就卡
        </div>
      </div>

      <div class="ld-my-card-content">
        <div class="-content-item" v-for="(item, index) of dataList" :key="index">
          <div class="-content-item-img" :style="{background: 'url('+item.impAchievement+') no-repeat;background-size: cover;'}">
            <div class="-content-item-img-header" v-if="item.rank!=-1">
              <div class="-header-bg">
                <span>{{item.rank}} 名</span>
              </div>
            </div>
            <div class="-content-item-img-footer">
              <img class="-image" src="https://pub.file.k12.vip/read/lesson/kczy-icon-good.png"/>
              <div>{{item.likes}}</div>
            </div>
          </div>
          <div class="-content-item-text">
            <div class="-text-name">《{{item.coursename}}》</div>
            <div class="-text-time">日期: {{item.gmtCreate}}</div>
          </div>
        </div>
      </div>

      <div v-if="!dataList.length && !isFetching" class="ld-my-card-noData">
        <div class="-one">读课文，集卡片</div>
        <div class="-two">300多张成就卡</div>
        <div class="-three">等你来解锁哟～</div>
        <img class="-img" src="https://pub.file.k12.vip/ldcard/icon-null-card.png"/>
        <div class="-btn" @click="toJump">我要朗读</div>
      </div>
    </scroll-view>
  </div>
</template>

<script>
  import api from "../../request/api";

  export default {

    data() {
      return {
        page: {
          current: 1,
          size: 10,
          total: 0
        },
        isFetching: false,
        totalItem: "",
        dataList: []
      };
    },

    computed:{},

    mounted() {
      this.getList()
    },

    methods: {
      toJump () {
        wx.switchTab({ url: '/pages/index/main' });
      },
      bindLoadItem() {
        if (this.page.current < Math.ceil(this.page.total / this.page.size)) {
          this.page.current++;
          this.getList();
        }
      },
      getList() {
        this.isFetching = true;
        api.work.getMyCardList({
          current: this.page.current,
          size: this.page.size
        }).then(({ data }) => {
          if (this.page.current > 1) {
            this.dataList = this.dataList.concat(data.resultData.records);
          } else {
            this.dataList = data.resultData.records;
          }
          this.page.total = data.resultData.total;
          // this.dataList = [
          //   {
          //     coursename: "这是 一个测试",
          //     likes: "1212",
          //     rank: '11236',
          //     gmtCreate: "2013-21-12"
          //   }
          // ];
          this.dataList.forEach(item => {
            if (item.rank >= 1000 && item.rank <= 9999) {
              item.rank = `${(item.rank / 1000).toFixed(1)}k`;
            } else if (item.rank > 9999) {
              item.rank = `${(item.rank / 10000).toFixed(1)}w`;
            }
          });

          this.isFetching = false;
        }, () => {
          this.isFetching = false;
        });
      }
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

    &-wrap {
      height: 100vh;
    }

    &-header {
      background: rgba(255, 255, 255, 1);
      box-shadow: 0px 0px 1px 0px rgba(0, 0, 0, 0.12);
      padding: 16px 24px;

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
      padding: 24px 24px;

      .-content-item {
        margin-bottom: 24px;

        &-img {
          position: relative;
          width: 155px;
          height: 207px;
          box-shadow: 2px 2px 12px -2px rgba(201, 214, 219, 1);
          border-radius: 6px;

          &-header {
            display: flex;
            justify-content: center;
            text-align: center;
            font-size: 10px;
            font-weight: 400;
            color: rgba(255, 255, 255, 1);
            line-height: 24px;
            height: 24px;

            .-header-bg {
              background: url("https://pub.file.k12.vip/read/cjk-icon-label.png") no-repeat;
              background-size: 100%;
              height: 24px;
              width: 72px;

              span {
                margin-left: 20px;
                font-size: 12px;
                font-weight: 500;
                color: rgba(253, 244, 197, 1);
              }
            }
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
            background: rgba(0, 0, 0, 0.16);
            border-radius: 100px 0 20px 0;

            .-image {
              margin-right: 4px;
              width: 11px;
              height: 11px;
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
            font-weight: bold;
            color: rgba(29, 27, 27, 1);
            line-height: 22px;
          }

          .-text-time {
            height: 14px;
            font-size: 10px;
            font-weight: 300;
            color: rgba(112, 115, 116, 1);
            line-height: 14px;
          }
        }
      }
    }

    &-noData {
      margin-top: 123px;
      text-align: center;

      .-one{
        height:28px;
        font-size:20px;
        font-weight:600;
        color:rgba(29,27,27,1);
        line-height:28px;
      }

      .-two {
        margin-top: 8px;
        font-size:28px;
        font-weight:600;
        color:rgba(48,192,255,1);
        line-height:34px;
      }

      .-three {
        height:57px;
        font-size:14px;
        font-weight:600;
        color:rgba(48,192,255,1);
        line-height:34px;
      }

      .-img{
        width: 132px;
        height: 176px;
      }

      .-btn {
        margin: 0 auto;
        margin-top: 40px;
        width:263px;
        height:40px;
        background:linear-gradient(90deg,rgba(102,255,248,1) 0%,rgba(48,192,255,1) 100%);
        box-shadow:0px 8px 12px -6px rgba(68,196,199,0.6);
        border-radius:26px;
        font-size:15px;
        font-weight:500;
        color:rgba(255,255,255,1);
        line-height:40px;
        text-align: center;
      }
    }

  }
</style>
