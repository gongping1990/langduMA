<template>
  <div class="ld-user">
    <scroll-view class="ld-user-scroll"
                 @scrolltolower="bindLoadItem"
                 scroll-y
                 @scroll="scrollTopFn"
                 scroll-with-animation>
      <div class="ld-user-header">
        <div class="ld-user-header-avthor">
          <img class="-img" :src="userInfo.headimage"/>
          <div class="-name">{{userInfo.nikename}}</div>
        </div>
      </div>
      <div class="ld-user-footer">
        <div class="-footer-title">
          <span></span>作品集
        </div>

        <div class="-footer-wrap" v-for="(item, index) of dataList" :key="index" >
          <van-swipe-cell :right-width="65">
            <div class="-footer-item" @click="audioPlay(item)">
              <div class="-item-left">
                <div class="-item-title">
                  <img v-if="!item.isPlay" class="-img" src="https://pub.file.k12.vip/read/gerenzhuye/msfd-button-play copy.png"/>
                  <img v-else class="-img" src="https://pub.file.k12.vip/2019/04/30/1123037383097708545.png"/>
                  <span>{{item.coursename}}</span>
                </div>
                <button open-type='share' :data-item="item" class="-share-btn" @click.stop="stopPropagation">
                  <img class="-share-img" src="https://pub.file.k12.vip/read/gerenzhuye/zp-button-share.png"/>
                </button>
              </div>
              <div class="-item-down">
                <div class="-item-num">
                  <img class="-img" src="https://pub.file.k12.vip/read/gerenzhuye/icon-good.png"/>
                  <span>{{item.likes || 0}}</span>
                </div>
                <div class="-item-time">{{item.grade}} · {{item.semester}} 日期: {{item.gmtCreate}}</div>
              </div>
            </div>

            <div slot="right" @click="openDel(item)" class="-footer-action">
              <img class="-right-img" src="https://pub.file.k12.vip/read/gerenzhuye/zp-icon-delete.png"/>
            </div>
          </van-swipe-cell>
        </div>

        <img class="-footer-bg" v-if="!dataList.length" src="https://pub.file.k12.vip/read/gerenzhuye/2.png"/>
        <div class="-footer-bg-text" v-if="!dataList.length">你还没有朗读作品，快去朗读吧～</div>

      </div>
      <div class="ld-user-wrap">
        <div class="-text">
          <div>
            <div class="-text-num">{{userInfo.likes}}</div>
            <div class="-text-tip">赞</div>
          </div>
          <div>
            <div class="-text-num">{{userInfo.achCards}}</div>
            <div class="-text-tip">成就卡</div>
          </div>
          <div>
            <div class="-text-num">{{userInfo.readdays}}</div>
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
          <div class="-btn -one" @click="openDel()">取消</div>
          <div class="-btn -two" @click="delItem()">确认</div>
        </div>
      </div>
    </wux-popup>
    <div class="card-mask" @click="clickCard"></div>
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
        dataItem: "",
        innerAudioContext: '',
      };
    },

    onShow() {
      wx.hideShareMenu();
      this.getWorkList();
      this.getMessageInfo();
      this.init()
    },

    components: {},

    onShareAppMessage(options) {
      const item = options.target.dataset.item;

      return {
        title: `我的孩子刚朗读了《${item.coursename}》，非常棒，请给TA点个赞吧！`,
        path: "/pages/share/main?id=" + item.id,
        imageUrl: "https://pub.file.k12.vip/read/zpshare.jpeg",
        success: res => {
          wx.showToast({
            title: "分享成功",
            icon: "none",
            duration: 2000
          });
        }
      };
    },
    methods: {
      init () {
        this.innerAudioContext = wx.createInnerAudioContext();
      },
      audioPlay (data) {
        this.innerAudioContext.src = data.voiceUrl;
        if (!data.isPlay) {
          this.innerAudioContext.play();
        } else {
          this.innerAudioContext.pause();
        }

        this.innerAudioContext.onPlay(() => {
          this.changeStatus(true,data);
        });
        this.innerAudioContext.onPause(() => {
          this.changeStatus(false,data);
        });
        this.innerAudioContext.onEnded(() => {
          this.changeStatus(false,data);
        });
        this.innerAudioContext.onStop(() => {
          this.changeStatus(false,data);
        });
      },
      changeStatus(bool,data) {
        this.dataList.forEach(item => {
          if(data.id == item.id) {
            item.isPlay = bool
          } else {
            item.isPlay = false
          }
        })
        this.$forceUpdate()
      },
      stopPropagation () {
      },
      clickCard() {
        wx.navigateTo({ url: "/pages/myCard/main" });
      },
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
            this.getMessageInfo();
          }
        });
      },
      bindLoadItem() {
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
            this.dataList.forEach(item => {
              item.isPlay = false
            })
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
    },

    onHide () {
      this.innerAudioContext.destroy()
    },

    onUnload () {
      this.innerAudioContext.destroy()
    },
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
      height: 149px;
      background: rgba(54, 219, 164, 1);

      &-avthor {
        margin-left: 24px;
        padding-top: 25px;
        display: flex;
        align-items: center;

        .-img {
          width: 56px;
          height: 56px;
          border-radius: 50%;
          border: 3px solid rgba(255, 255, 255, 1);
        }

        .-name {
          margin-left: 17px;
          font-size: 18px;
          font-weight: 500;
          color: rgba(255, 255, 255, 1)
        }
      }

    }

    &-footer {

      .-footer-wrap {
        position: relative;
      }

      .-footer-action {
        display: flex;
        align-items: center;
        justify-content: center;
        width:58px;
        height:60px;
        background:rgba(255,96,36,1);

        .-right-img {
          width: 20px;
          height: 25px;
        }
      }

      .-footer-title {
        display: flex;
        align-items: center;
        margin: 70px 24px 0;
        height: 28px;
        font-size: 20px;
        font-weight: 500;
        color: rgba(74, 74, 74, 1);

        span {
          display: inline-block;
          width: 6px;
          height: 21px;
          background: rgba(56, 220, 164, 1);
          border-radius: 3px;
          margin-right: 8px;
        }
      }

      .-footer-item {
        position: relative;
        align-items: center;
        margin: 26px 24px;
        background: rgba(255, 255, 255, 1);

        .-item-left {
          display: flex;
          justify-content: space-between;
          align-items: center;

          .-item-title {
            display: flex;
            align-items: center;
            font-size: 16px;
            font-weight: 500;
            color: #324062;
            line-height: 22px;

            .-img {
              display: inline-block;
              margin-right: 5px;
              width: 18px;
              height: 19px;
            }
          }

          .-share-btn {
            margin: 0;
            width: 28px;
            height: 30px;
            background: none;
            padding: 0;
            line-height: 0;

            .-share-img {
              width: 28px;
              height: 28px;
            }
          }
        }

        .-item-down {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 9px;

          .-item-time {
            font-size: 10px;
            font-weight: 300;
            color: #CDCDCD;
            line-height: 14px;
          }

          .-item-num {
            font-size: 12px;
            font-weight: 400;
            color: #FF5F0A;
            line-height: 17px;

            .-img {
              margin-right: 6px;
              width: 11px;
              height: 13px;
            }
          }
        }
      }

      .-footer-bg {
        margin-left: 56px;
        margin-top: 57px;
        width: 262px;
        height: 135px;
      }

      .-footer-bg-text {
        width:180px;
        height:17px;
        font-size:12px;
        font-weight:500;
        color:rgba(153,163,182,1);
        line-height:17px;
        margin: 10px auto 0;
        text-align: center;
      }
    }

    &-wrap {
      position: absolute;
      top: 113px;
      left: 24px;
      width: 327px;
      height: 79px;
      background: rgba(255, 255, 255, 1);
      border-radius: 8px;
      box-shadow: 0px 0px 8px 0px rgba(0, 0, 0, 0.1);
      text-align: center;

      .-text {
        display: flex;
        justify-content: space-between;
        align-content: center;
        padding: 18px 32px;

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
          color: #FF9F24;
        }

        &-tip {
          width: 44px;
          color: #707374;
          font-size: 12px;
        }
      }
    }

    &-del {
      position: relative;
      width:327px;
      height:178px;
      background:rgba(255,255,255,1);
      box-shadow:0px 2px 10px 0px rgba(0,0,0,0.2);
      border-radius:16px;

      .-del-title {
        padding-top: 29px;
        height:25px;
        font-size:18px;
        font-weight:500;
        color:rgba(0,0,0,0.75);
        line-height:25px;
      }

      .-del-content {
        margin-top: 11px;
        height:25px;
        font-size:18px;
        font-weight:500;
        color:rgba(0,0,0,0.75);
        line-height:25px;
      }

      .-del-footer {
        position: absolute;
        bottom: 0;
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-top: 32px;

        .-btn {
          display: inline-block;
          font-size:18px;
          width: calc( 327px / 2);
          height:53px;
          line-height: 53px;
          background:#ffffff;
          color:rgba(0,0,0,0.4);
        }

        .-two {
          border-radius: 0 0 16px 0;
          background:rgba(39,220,163,1);
          color:rgba(255,255,255,1);
        }

        .-one {
          border-radius: 0 0 0 16px;
        }
      }
    }
  }
</style>
