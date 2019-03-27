<template>
  <div class="ld-user">
    <scroll-view class="ld-user-scroll"
                 @scrolltolower="bindLoadItem"
                 scroll-y
                 @scroll="scrollTopFn"
                 scroll-with-animation>
      <div class="ld-user-header"></div>
      <div class="ld-user-footer">
        <div class="-footer-title">作品集</div>

        <div class="-footer-item -other-item" v-for="(item, index) of dataList" :key="index">
          <div class="-other-left">
            <div class="-other-title">《{{item.coursename|| "这是一本测试"}}》</div>
            <div class="-other-time">{{grade || '一年级'}} · {{semester || '上学期'}} | 日期: {{item.gmtCreate || "2019-04-21"}}</div>
            <div class="-other-num">
              <img class="-img" src="https://pub.file.k12.vip/read/rank/icon-good2.png"/>
              <span>{{item.likes || 0}}</span>
            </div>
          </div>
          <img class="-other-img" src="https://pub.file.k12.vip/read/course/kczy-button-play.png"/>
        </div>
      </div>
      <div class="ld-user-wrap">
        <img class="-img" :src="userInfo.headimage"/>
        <div class="-name">{{userInfo.nikename}}</div>
        <div class="-text">
          <div>
            <div class="-text-num-one">{{userInfo.likes}}</div>
            <div class="-text-tip">赞</div>
          </div>
          <div>
            <div class="-text-num-two">{{userInfo.achCards}}</div>
            <div class="-text-tip">成就卡</div>
          </div>
          <div>
            <div class="-text-num-three">{{userInfo.readdays}}</div>
            <div class="-text-tip">朗读(天)</div>
          </div>

        </div>
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
          total: ""
        },
        isFetching: false,
        dataList: [],
        userInfo: "",
        queryInfo: ""
      };
    },

    mounted() {
      this.queryInfo = this.$root.$mp.query
      this.getWorkList();
      this.getMessageInfo();
    },

    components: {},

    methods: {
      bindLoadItem() {
        console.log('aaaa')
        if (this.page.current < Math.ceil(this.page.total / this.page.size)) {
          this.page.current++;
          this.getWorkList()
        }
      },
      getWorkList() {
        this.isFetching = true;

        api.work.otherWorksList ({
          current: this.page.current,
          size: this.page.size,
          userId: this.queryInfo.userId
        })
          .then(({ data }) => {
            if (this.page.current > 1) {
              this.dataList = this.dataList.concat(data.resultData.records);
            } else {
              this.dataList = data.resultData.records;
            }
            this.page.total = data.resultData.total;
            this.isFetching = false;
          }, () => {
            this.isFetching = false;
          });
      },
      getMessageInfo() {
        this.isFetching = true;

        api.work.otherMessage ({
          userId: this.queryInfo.userId
        })
          .then(({ data }) => {
            this.userInfo = data.resultData;
            this.isFetching = false;
          }, () => {
            this.isFetching = false;
          });
      }
    }
  };
</script>

<style lang="scss" scoped>
  .ld-user {
    position: relative;
    background: #ffffff;

    &-scroll {
      height: 100vh;
    }

    &-header {
      width: 375px;
      height: 131px;
      background: url("https://pub.file.k12.vip/read/backgroud-my.png") no-repeat;
      background-size: 100%;
    }

    &-footer {

      .-footer-action {
        position: relative;
        width: 40px;
        height: 40px;
        top: 40%;

        .-right-img {
          width: 20px;
          height: 25px;
        }
      }

      .-footer-title {
        margin: 130px 24px 0;
        background: url("https://pub.file.k12.vip/read/rank/icon-tittle.png") 0% no-repeat;
        background-size: contain;
        height: 46px;
        line-height: 46px;
        font-size: 17px;
        font-weight: 500;
        color: rgba(74, 74, 74, 1);
      }

      .-footer-item {
        position: relative;
        align-items: center;
        padding: 26px 16px 19px;
        margin: 21px 24px;

        background: rgba(255, 255, 255, 1);
        box-shadow: 0px 2px 10px 0px rgba(222, 232, 237, 1);
        border-radius: 6px;

        .-item-img {
          position: absolute;
          top: -18px;
          right: 0;
          width: 36px;
          height: 36px;
        }

        .-item-left {

          .-item-title {
            display: flex;
            align-items: center;
            font-size: 16px;
            font-weight: 500;
            color: #1D1B1B;
            line-height: 22px;

            .-img {
              display: inline-block;
              margin-left: 4px;
              color: #30C0FF;
              width: 16px;
              height: 16px;
            }
          }
        }

        .-item-down {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 11px;

          .-item-time {
            font-size: 10px;
            font-weight: 300;
            color: #707374;
            line-height: 14px;
          }

          .-item-num {
            font-size: 14px;
            font-weight: 400;
            color: #FF668E;
            line-height: 20px;

            .-img {
              margin-right: 8px;
              width: 15px;
              height: 15px;
            }
          }
        }
      }

      .-other-item {
        display: flex;
        justify-content: space-between;
        align-items: center;

        .-other-left {
          .-other-title {
            max-width: 240px;
            text-overflow: ellipsis;
            overflow: hidden;
            white-space: nowrap;
            height:22px;
            font-size:16px;
            font-weight:600;
            color:rgba(29,27,27,1);
            line-height:22px;
            margin-bottom: 8px;
          }

          .-other-time {
            height:14px;
            font-size:10px;
            font-weight:300;
            color:rgba(112,115,116,1);
            line-height:14px;
            margin-bottom: 12px;
          }

          .-other-num {
            height:17px;
            font-size:12px;
            font-weight:500;
            color:rgba(112,115,116,1);
            line-height:17px;

            .-img {
              margin-right: 4px;
              width: 11px;
              height: 11px;
            }
          }
        }


        .-other-img {
          width:32px;
          height:32px;
        }
      }
    }

    &-wrap {
      position: absolute;
      top: 80px;
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
        border: 3px solid rgba(255, 255, 255, 1);
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
        padding: 24px 24px 17px;

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

        &-num-one {
          font-size: 22px;
          font-weight: bold;
          color: #FF668EFF;
        }
        &-num-two {
          font-size: 22px;
          font-weight: bold;
          color: #30C0FFFF;
        }
        &-num-three {
          font-size: 22px;
          font-weight: bold;
          color: #38E292FF;
        }

        &-tip {
          width: 44px;
          color: #707374FF;
          font-size: 12px;
        }
      }
    }
  }
</style>
