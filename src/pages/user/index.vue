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

        <div class="-footer-wrap" v-for="(item, index) of dataList" :key="index" >
          <van-swipe-cell :right-width="65">
            <button open-type='share' :data-item="item" class="-share-btn">
              <img class="-share-img" src="https://pub.file.k12.vip/read/my/zp-button-share.png"/>
            </button>
            <div class="-footer-item" @click="lookOtherRead(item.id)">
              <div class="-item-tip" v-if="index==0 && item.likes!=0">赞最多</div>
              <div class="-item-left">
                <div class="-item-title">
                  <span>《{{item.coursename}}》</span>
                  <img class="-img" src="https://pub.file.k12.vip/read/my/msfd-button-play.png"/>
                </div>
              </div>
              <div class="-item-down">
                <div class="-item-time">日期: {{item.gmtCreate}}</div>
                <div class="-item-num">
                  <img class="-img" src="https://pub.file.k12.vip/read/icon-good.png"/>
                  <span>{{item.likes || 0}}</span>
                </div>
              </div>
            </div>

            <div slot="right" @click="openDel(item)" class="-footer-action">
              <img class="-right-img" src="https://pub.file.k12.vip/read/my/zp-icon-delete.png"/>
            </div>
          </van-swipe-cell>
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

    <wux-popup :visible="isShowDel" @close="openDel">
      <div class="ld-user-del">
        <div class="-del-title">提示</div>
        <div class="-del-content">确认删除该作品吗？</div>
        <div class="-del-footer">
          <div class="-btn" @click="openDel()">取消</div>
          <div class="-btn -two" @click="delItem()">确认</div>
        </div>
      </div>
    </wux-popup>
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
        isShowDel: false,
        dataList: [],
        userInfo: "",
        dataItem: ""
      };
    },

    mounted() {
      this.getWorkList();
      this.getMessageInfo();
    },

    components: {},

    onShareAppMessage (options) {
      const item = options.target.dataset.item

      return {
        title: `我的孩子刚朗读了《${item.coursename}》，非常棒，请给TA点个赞吧！`,
        path: '/pages/share/main?id=' + item.id,
        success: res => {
          wx.showToast({
            title: '分享成功',
            icon: "none",
            duration: 2000
          })
        }
      };
    },

    methods: {
      openDel(data) {
        this.dataItem = data;
        this.isShowDel = !this.isShowDel;
      },
      delItem() {
        api.work.delItemWork({
          id: this.dataItem.id
        }).then(res => {
          if (res.data.code == "200") {
            wx.showToast({
              title: "删除成功",
              icon: "none",
              duration: 2000
            });
            this.isShowDel = false;
            this.getWorkList();
          }
        });
      },
      lookOtherRead(id) {
        wx.navigateTo({
          url: `/pages/listenWork/main?id=${id}`
        });
      },
      bindLoadItem() {
        console.log("aaaa");
        if (this.page.current < Math.ceil(this.page.total / this.page.size)) {
          this.page.current++;
          this.getWorkList();
        }
      },
      getWorkList() {
        this.isFetching = true;
        api.work.myWorksList({
          current: this.page.current,
          size: this.page.size
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
        api.work.myMessage()
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

      .-footer-wrap {
        position: relative;

        .-share-btn {
          position: absolute;
          top: -18px;
          right: 24px;
          background: none;
          padding: 0;
          line-height: 0;
          z-index: 999;

          .-share-img {
            width: 36px;
            height: 36px;
          }
        }
      }

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
            height: 22px;
            font-size: 16px;
            font-weight: 600;
            color: rgba(29, 27, 27, 1);
            line-height: 22px;
            margin-bottom: 8px;
          }

          .-other-time {
            height: 14px;
            font-size: 10px;
            font-weight: 300;
            color: rgba(112, 115, 116, 1);
            line-height: 14px;
            margin-bottom: 12px;
          }

          .-other-num {
            height: 17px;
            font-size: 12px;
            font-weight: 500;
            color: rgba(112, 115, 116, 1);
            line-height: 17px;

            .-img {
              margin-right: 4px;
              width: 11px;
              height: 11px;
            }
          }
        }

        .-other-img {
          width: 32px;
          height: 32px;
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
          color: #FF668E;
        }
        &-num-two {
          font-size: 22px;
          font-weight: bold;
          color: #30C0FF;
        }
        &-num-three {
          font-size: 22px;
          font-weight: bold;
          color: #38E292;
        }

        &-tip {
          width: 44px;
          color: #707374;
          font-size: 12px;
        }
      }
    }

    &-del {
      padding: 32px 36px 24px;
      background: rgba(3, 26, 36, 1);
      box-shadow: 0px 2px 10px 0px rgba(1, 21, 31, 1);
      border-radius: 16px;

      .-del-title {
        font-size: 20px;
        font-weight: 500;
        color: rgba(255, 255, 255, 0.75);
        line-height: 28px;
      }

      .-del-content {
        line-height: 28px;
        font-size: 16px;
      }

      .-del-footer {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-top: 32px;

        .-btn {
          width: 100px;
          height: 40px;
          border-radius: 26px;
          border: 1px solid rgba(255, 255, 255, 0.16);
          font-size: 15px;
          font-weight: 500;
          color: rgba(255, 255, 255, 0.4);
          line-height: 40px;
        }

        .-two {
          color: #30C0FFFF;
        }
      }
    }
  }
</style>
