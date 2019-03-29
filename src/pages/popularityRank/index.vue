<template>
  <div class="ld-popularityRank">
    <div class="ld-popularityRank-header">
      <span :class="{'-active': tabType == '1'}" class="-header-span" @click="changeTab(1)">
        {{queryInfo.type == 1 ? "本周排行" : queryInfo.name}}
      </span>
      <span :class="{'-active': tabType == '2'}" @click="changeTab(2)" v-if="queryInfo.type == 1">上周排行</span>
    </div>

    <scroll-view class="ld-popularityRank-content" :class="{'-content-wrap-height':!isShowMyWork}"
                 @scrolltolower="bindLoadItem"
                 scroll-y
                 scroll-with-animation>
      <div class="ld-popularityRank-content-wrap">
        <div class="-content-item-one"  @click="lookOtherWorks(dataItem.userId)">
          <div class="-img">
            <img class="-img-crown" src="https://pub.file.k12.vip/read/rank/icon-head champion.png"/>
            <img class="-img-header" :src="dataItem.headimage || dataItem.headimgurl">
          </div>
          <div class="-item-one-wrap">
            <div class="-item-one-wrap-text">
              <img class="-left" src="https://pub.file.k12.vip/read/rank/icon-1st.png"/>
              <div>
                <div class="-name">{{dataItem.nickname}}</div>
                <div class="-zan">
                  <img class="-zan-img" src="https://pub.file.k12.vip/read/rank/icon-good1.png"/>
                  <span>{{dataItem.likes}}</span>
                </div>
              </div>
            </div>
            <img class="-item-one-wrap-img" src="https://pub.file.k12.vip/read/rank/kczy-icon-sel1.png"/>
          </div>
        </div>
        <div class="item-wrap -content-wrap" v-for="(item,index) of dataList" :key="index"
             :class="{'-two':index==0,'-three':index==1}" @click="lookOtherWorks(item.userId)">
          <img v-if="index==0" class="-item-img" src="https://pub.file.k12.vip/read/rank/icon-2ed.png"/>
          <img v-else-if="index==1" class="-item-img" src="https://pub.file.k12.vip/read/rank/icon-3rd.png"/>
          <div class="-item-left" v-else>{{index+2}}</div>
          <div class="-item-center">
            <img class="-item-center-img"
                 :src="item.headimage || item.headimgurl"/>
            <div class="-item-center-text">
              <div class="-name">{{item.nickname}}</div>
              <div class="-zan">
                <img class="-zan-img" src="https://pub.file.k12.vip/read/rank/icon-good2.png"/>
                <span>{{item.likes}}</span>
              </div>
            </div>
          </div>
          <div class="-item-right">
            <img class="-item-right-img" src="https://pub.file.k12.vip/read/rank/kczy-icon-sel2.png"/>
          </div>
        </div>
      </div>
    </scroll-view>

    <div class="ld-popularityRank-footer" v-if="isShowMyWork">
      <div class="-footer-wrap">
        <div class="item-wrap -footer-item">
          <div class="-item-left -footer-num">{{myInfo.rank}}</div>
          <div class="-item-center -footer-center">
            <img class="-item-center-img"
                 :src="myInfo.headimage"/>
            <div class="-item-center-text">
              <div class="-name">{{myInfo.nickname}}</div>
              <div class="-zan">
                <img class="-zan-img" src="https://pub.file.k12.vip/read/rank/icon-good2.png"/>
                <span>{{myInfo.likes}}</span>
              </div>
            </div>
          </div>
          <div class="-item-right -footer-right">集赞冲榜</div>
          <img @click="openPopup" class="-footer-img" src="https://pub.file.k12.vip/read/rank/zp-button-share.png"/>
        </div>
      </div>
    </div>

    <wux-popup :visible="isOpenPopup" position="bottom" @close="closePopup">
      <div class="ld-popularityRank-popup-content" :class="{'-more': isOpenMore}">
        <div class="-popup-title">叫大家来给你的作品点赞吧</div>

        <div class="-popup-item" v-if="!isOpenMore">
          <div class="-item-tip">赞最多</div>
          <div class="-item-left">
            <div class="-item-title">
              <span>《{{queryInfo.name}}》</span>
              <img class="-img" src="https://pub.file.k12.vip/read/my/msfd-button-play.png"/>
            </div>
          </div>
          <div class="-item-down">
            <div class="-item-time">日期: {{myInfo.gmtCreate}}</div>
            <div class="-item-num">
              <img class="-img" src="https://pub.file.k12.vip/read/icon-good.png"/>
              <span>{{myInfo.likes}}</span>
            </div>
          </div>
        </div>

        <scroll-view class="-popup-item-wrap"
                     v-if="isOpenMore"
                     @scrolltolower="bindLoadItemShareWork"
                     scroll-y
                     @scroll="scrollTopFn"
                     scroll-with-animation>
          <div class="-popup-item -popup-item-more" v-for="(item, index) of dataShareList" :key="index"
               :class="{'-active-item': item.id == popupItem.id}" @click="changeItem(item)">
            <div class="-item-tip" v-if="index==0">赞最多</div>
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
        </scroll-view>

        <div class="-popup-more" @click="openMore" v-if="!isOpenMore">选择其他作品 ></div>
      </div>

      <button open-type="share" class="ld-popularityRank-popup-btn">分享到班级群</button>
    </wux-popup>
  </div>
</template>

<script>
  import api from "../../request/api";
  import dayjs from 'dayjs'

  export default {
    data() {
      return {
        page: {
          current: 1,
          size: 10,
          total: ""
        },
        pageShareWork: {
          current: 1,
          size: 10,
          total: ""
        },
        isFetching: false,
        isOpenPopup: false,
        isOpenMore: false,
        isShowMyWork: true,
        dataList: [],
        dataShareList: [],
        dataItem: "",
        popupItem: "",
        queryInfo: "",
        tabType: "1",
        myInfo: {}
      };
    },

    onShareAppMessage () {
      return {
        title: `我的孩子刚朗读了《${this.isOpenMore ? this.popupItem.coursename : this.queryInfo.name}》，非常棒，请给TA点个赞吧！`,
        path: `/pages/share/main?id=${this.isOpenMore ? this.popupItem.id : this.myInfo.workId}`,
        success: res => {
          wx.showToast({
            title: '分享成功',
            icon: "none",
            duration: 2000
          })
        }
      };
    },

    onLoad() {
      this.queryInfo = this.$root.$mp.query;
    },

    mounted() {
      //type: 1为周次，2为单课排行
      if (this.queryInfo.type == 1) {
        this.getWeekList();
        this.getMyWeekInfo();
      } else {
        this.getMyRankInfo();
        this.getItemList();
      }
    },

    methods: {
      changeItem (data) {
        this.popupItem = data
      },
      lookOtherWorks(id) {
        wx.navigateTo({
          url: `/pages/otherUser/main?userId=${id}`
        });
      },
      openMore() {
        this.isOpenMore = !this.isOpenMore;
        this.getItemWorksList();
      },
      openPopup() {
        this.isOpenPopup = true;
        if (this.queryInfo.type == 1) {
          this.getShareWorksList();
          this.isOpenMore = true
        }
      },
      closePopup () {
        this.isOpenMore = false
        this.isOpenPopup = false
      },
      changeTab(num) {
        this.tabType = num;
        if (this.queryInfo.type == 1) {
          this.getWeekList();
          this.getMyWeekInfo();
        } else {
          this.getItemList();
        }
      },
      bindLoadItem() {
        if (this.page.current < Math.ceil(this.page.total / this.page.size)) {
          this.page.current++;
          if (this.queryInfo.type == 1) {
            this.getWeekList();
          } else {
            this.getItemList();
          }
        }
      },
      bindLoadItemShareWork() {
        if (this.pageShareWork.current < Math.ceil(this.pageShareWork.total / this.pageShareWork.size)) {
          this.pageShareWork.current++;
          if (this.queryInfo.type == 1) {
            this.getShareWorksList();
          } else {
            this.getItemWorksList();
          }
        }
      },
      getWeekList() {
        this.isFetching = true;
        api.user.getUserLikeRank({
          current: this.page.current,
          size: this.page.size,
          nowWeek: this.tabType == 1
        }).then(({ data }) => {
          if (this.page.current > 1) {
            this.dataList = this.dataList.concat(data.resultData.records);
          } else {
            this.dataList = data.resultData.records;
          }
          this.page.total = data.resultData.total;
          if (this.dataList.length) {
            this.dataItem = this.dataList[0];
            this.dataList.splice(0, 1);
          }
          this.isFetching = false;
        }, () => {
          this.isFetching = false;
        });
      },
      getItemList() {
        api.work.getItemRankinglist({
          courseid: this.queryInfo.id,
          current: this.page.current,
          size: this.page.size
        }).then(({ data }) => {
          if (this.page.current > 1) {
            this.dataList = this.dataList.concat(data.resultData.records);
          } else {
            this.dataList = data.resultData.records;
          }
          this.page.total = data.resultData.total;
          if (this.dataList.length) {
            this.dataItem = this.dataList[0];
            this.dataList.splice(0, 1);
          }
          this.isFetching = false;
        }, () => {
          this.isFetching = false;
        });
      },
      //周榜排名分享列表
      getShareWorksList() {
        api.work.myShareWorksList({
          current: this.pageShareWork.current,
          size: this.pageShareWork.size
        }).then(({ data }) => {
          if (this.pageShareWork.current > 1) {
            this.dataShareList = this.dataShareList.concat(data.resultData.records);
          } else {
            this.dataShareList = data.resultData.records;
          }
          this.pageShareWork.total = data.resultData.total;

          this.isFetching = false;
        }, () => {
          this.isFetching = false;
        });
      },
      // 单课排行分享列表
      getItemWorksList() {
        api.work.getSingleList({
          current: this.pageShareWork.current,
          size: this.pageShareWork.size,
          courseid: this.queryInfo.id
        }).then(({ data }) => {
          if (this.pageShareWork.current > 1) {
            this.dataShareList = this.dataShareList.concat(data.resultData.records);
          } else {
            this.dataShareList = data.resultData.records;
          }
          this.pageShareWork.total = data.resultData.total;

          this.isFetching = false;
        }, () => {
          this.isFetching = false;
        });
      },
      getMyRankInfo() {
        this.isShowMyWork = true
        api.work.userLikeRankForMe({
          courseId: this.queryInfo.id
        })
          .then(({ data }) => {
            if (data.resultData != null && data.resultData.rank != '-1') {
              this.myInfo = data.resultData
            } else {
              this.isShowMyWork = false
            }
          });
      },
      getMyWeekInfo() {
        this.isShowMyWork = true
        api.user.weekLikeRankForMe({
          nowWeek: this.tabType == 1
        })
          .then(({ data }) => {
            if (data.resultData != null && data.resultData.rank != '-1') {
              this.myInfo = data.resultData
            } else {
              this.isShowMyWork = false
            }
          });
      }
    }
  };
</script>

<style lang="scss" scoped>
  .ld-popularityRank {
    background: rgba(255, 255, 255, 1);
    background: url("https://pub.file.k12.vip/read/hotRank/backgroud.png") no-repeat;
    background-size: cover;
    height: 160px;

    .-active {
      font-size: 20px;
      font-weight: 500;
      color: #1D1B1B;
      line-height: 28px;
    }

    .-content-wrap-height {
      height: calc(100vh - 60px)!important;
    }

    &-header {
      z-index: 2;
      padding: 16px 24px;
      font-size: 16px;
      font-weight: 400;
      color: #707374;
      line-height: 22px;
      background: url("https://pub.file.k12.vip/read/rank/icon-tittle.png") 10% no-repeat;
      background-size: contain;

      .-header-span {
        z-index: 22;
        margin-right: 24px;
      }
    }

    &-content {
      z-index: 2;
      height: calc(100vh - 100px - 60px);

      &-wrap {
        position: relative;
        padding: 60px 24px 0;

        .-content-item-one {
          height: 101px;
          background: rgba(48, 192, 255, 1);
          box-shadow: 0px 4px 12px 0px rgba(182, 211, 223, 1);
          border-radius: 16px;
          padding: 0 18px 0 18px;

          .-img {
            position: absolute;
            top: 36px;
            left: 48px;
            width: 48px;
            height: 48px;

            &-crown {
              position: absolute;
              top: -18px;
              left: 12px;
              width: 32px;
              height: 20px;
            }

            &-header {
              border: 3px solid rgba(226, 198, 92, 1);
              border-radius: 50%;
              width: 48px;
              height: 48px;
            }
          }

          .-item-one-wrap {
            display: flex;
            justify-content: space-between;
            align-items: center;
            height: 100%;

            &-left {
              width: 17px;
              height: 21px;
            }

            &-img {
              width: 10px;
              height: 17px;
            }

            &-text {
              display: flex;
              align-items: center;
              margin-top: 16px;
              color: #FDF4C5;

              .-left {
                margin-right: 30px;
                width: 17px;
                height: 19px;
              }

              .-name {
                font-size: 16px;
                font-weight: 500;
                line-height: 22px;
              }
              .-zan {
                margin-top: 4px;
                font-size: 12px;
                font-weight: 400;
                line-height: 17px;

                &-img {
                  margin-right: 4px;
                  width: 11px;
                  height: 11px;
                }
              }
            }
          }
        }

        .-content-wrap {
          border-radius: 16px;
          border: 3px solid rgba(245, 245, 245, 1);
          padding: 0 16px;
        }

        .-two {
          border: 3px solid rgba(254, 161, 186, 1);
        }

        .-three {
          border: 3px solid rgba(134, 236, 188, 1)
        }
      }
    }

    &-footer {
      position: fixed;
      bottom: 0;
      width: 100%;
      height: 91px;
      background: rgba(255, 255, 255, 1);
      box-shadow: 0 1px 1px 0 rgba(0, 0, 0, 1);

      .-footer-wrap {
        padding: 0 24px;
        height: 100%;

        .-footer-item {
          margin: 0 !important;
        }

        .-footer-right {
          font-weight: bold !important;
        }

        .-footer-num {
          margin-right: 20px;
          color: #30C0FFFF !important;
        }

        .-footer-center {
          width: 70% !important;
        }

        .-footer-img {
          position: absolute;
          right: 24px;
          top: -24px;
          width: 48px;
          height: 48px;
        }
      }
    }

    .-more {
      height: 440px !important;

      .-popup-item {
        margin: 16px !important;
      }
    }

    &-popup-content {
      margin: 0 24px;
      width: 327px;
      height: 250px;
      background: rgba(255, 255, 255, 1);
      border-radius: 16px;

      .-popup-title {
        font-size: 20px;
        font-weight: 500;
        color: rgba(74, 74, 74, 1);
        padding: 32px 0 24px 0;
      }

      .-popup-item-wrap {
        height: 360px;
      }

      .-popup-item {
        position: relative;
        padding: 26px 16px 18px;
        margin: 0 16px;
        background: rgba(255, 255, 255, 1);
        box-shadow: 0px 2px 10px 0px rgba(222, 232, 237, 1);
        border-radius: 16px;

        .-item-tip {
          position: absolute;
          top: 0;
          left: 0;
          font-size: 10px;
          font-weight: 400;
          width: 56px;
          height: 18px;
          background: linear-gradient(45deg, rgba(255, 82, 128, 1) 0%, rgba(255, 102, 142, 1) 100%);
          border-radius: 86px 0 100px 0;
          color: rgba(255, 255, 255, 1);
          line-height: 18px;
          text-align: center;
          padding-left: 4px;
        }

        .-item-left {

          .-item-title {
            display: flex;
            align-items: center;
            font-size: 16px;
            font-weight: 500;
            color: #1D1B1B;

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
          margin-top: 12px;

          .-item-time {
            font-size: 10px;
            font-weight: 300;
            color: #707374FF;
          }

          .-item-num {
            font-size: 14px;
            font-weight: 400;
            color: #FF668E;

            .-img {
              margin-right: 8px;
              width: 15px;
              height: 15px;
            }
          }
        }
      }

      .-active-item {
        background: rgba(245, 245, 245, 1);
      }

      .-popup-item-more {
        box-shadow: none;
        border: 1px solid rgba(0, 0, 0, 0.08);
      }

      .-popup-more {
        margin-top: 32px;
        font-size: 13px;
        font-weight: 400;
        color: #707374FF;
      }
    }

    &-popup-btn {
      margin: 12px 24px 34px;
      width: 327px;
      height: 52px;
      font-size: 15px;
      font-weight: 500;
      color: #ffffff;
      line-height: 52px;
      background: linear-gradient(90deg, rgba(102, 255, 248, 1) 0%, rgba(48, 192, 255, 1) 100%);
      border-radius: 26px;
    }

    .item-wrap {
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: 76px;
      background: rgba(255, 255, 255, 1);
      margin: 16px 0;

      .-item-img {
        width: 17px !important;
        height: 19px !important;
      }

      .-item-left {
        font-size: 17px;
        font-weight: 600;
        color: rgba(0, 0, 0, 1);
        /*line-height: 24px;*/
      }

      .-item-center {
        width: 75%;
        display: flex;
        text-align: left;
        align-items: center;

        &-img {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          margin-right: 12px;
        }

        &-text {

          .-name {
            font-weight: bold;
            font-size: 16px;
            line-height: 22px;
            color: #1D1B1BFF;
          }
          .-zan {
            color: rgba(112, 115, 116, 1);
            margin-top: 4px;
            font-size: 12px;
            font-weight: 400;
            line-height: 17px;

            &-img {
              margin-right: 4px;
              width: 11px;
              height: 11px;
            }
          }
        }
      }

      .-item-right {
        font-size: 12px;
        font-weight: 400;
        color: rgba(0, 0, 0, 1);
        line-height: 17px;

        &-img {
          width: 10px;
          height: 17px;
        }
      }
    }
  }
</style>
