<template>
  <div class="ld-popularityRank">
    <scroll-view class="ld-popularityRank-content"
                 @scrolltolower="bindLoadItem"
                 scroll-y
                 scroll-with-animation>
      <div class="ld-popularityRank-header" :class="{'ld-popularityRank-week': queryInfo.type == 1 }">
        <span class="-header-span">
          {{queryInfo.type == 1 ? "排行榜" : queryInfo.name}}
        </span>
      </div>

      <div class="ld-popularityRank-user" :class="{'ld-popularityRank-week-user':queryInfo.type == 1}">
        <div v-if="queryInfo.type == 1" class="-user-title-wrap">
          <span class="-user-title" :class="{'-active1': tabType == '1'}" @click="changeTab(1)">本周排行</span>
          <span class="-user-title" :class="{'-active2': tabType == '2'}" @click="changeTab(2)">上周排行</span>
        </div>
        <div class="item-wrap -user-item">
          <div class="-item-left" :class="{'-user-no': myInfo.rank=='-1'}">
            {{myInfo.rank=="-1" ? "未上榜" : myInfo.rank }}
          </div>
          <div class="-item-center">
            <img class="-item-center-img" :src="myInfo.headimage"/>
            <div class="-item-center-text">
              <div class="-name">{{myInfo.nickname}}</div>
              <div class="-zan">
                <img class="-zan-img" src="https://pub.file.k12.vip/read/paihangbang/dianzan.png"/>
                <span>{{myInfo.likes}}</span>
              </div>
            </div>
          </div>
          <div class="-item-right">
            <img class="-item-right-img" src="https://pub.file.k12.vip/read/rank/kczy-icon-sel2.png"/>
          </div>
        </div>
      </div>

      <div class="ld-popularityRank-content-wrap" :class="{'ld-popularityRank-content-wrap-week': queryInfo.type == 1}"
           v-if="dataList.length">
        <div class="item-wrap" v-for="(item,index) of dataList" :key="index" @click="lookOtherWorks(item.userId)">
          <div v-if="index==0" class="-item-img-wrap">
            <img class="-item-img" src="https://pub.file.k12.vip/read/paihangbang/dkph-icon-first.png"/>
          </div>
          <div v-else-if="index==1" class="-item-img-wrap">
            <img class="-item-img"
                 src="https://pub.file.k12.vip/read/paihangbang/dkph-icon-second.png"/>
          </div>
          <div v-else-if="index==2" class="-item-img-wrap">
            <img class="-item-img"
                 src="https://pub.file.k12.vip/read/paihangbang/dkph-icon-third.png"/>
          </div>
          <div class="-item-left" v-else>{{index+1}}</div>
          <div class="-item-center">
            <img class="-item-center-img"
                 :src="item.headimage || item.headimgurl"/>
            <div class="-item-center-text">
              <div class="-name">{{item.nickname}}</div>
              <div class="-zan">
                <img class="-zan-img" src="https://pub.file.k12.vip/read/paihangbang/dianzan.png"/>
                <span>{{item.likes}}</span>
              </div>
            </div>
          </div>
          <div class="-item-right">
            <img class="-item-right-img" src="https://pub.file.k12.vip/read/rank/kczy-icon-sel2.png"/>
          </div>
        </div>
      </div>

      <div v-if="!dataList.length" class="ld-popularityRank-noDate"
           :class="{'ld-popularityRank-noDate-week': queryInfo.type == 1}">
        <img class="-img" src="https://pub.file.k12.vip/read/paihangbang/bg-none-3.png"/>
        <div class="-text">暂无作品上榜，赶快分享作品集赞冲榜吧！</div>
      </div>
    </scroll-view>

    <div class="ld-popularityRank-footer">
      <div class="-footer-wrap">
        <div class="item-wrap -footer-item">
          <img @click="openPopup" class="-footer-img"
               src="https://pub.file.k12.vip/read/paihangbang/zp-button-share.png"/>
        </div>
      </div>
    </div>

    <wux-popup :visible="isOpenPopup" :position="!myInfo.workId ? 'center' : 'bottom'" @close="closePopup">
      <div class="ld-popularityRank-popup-content" :class="{'-more': isOpenMore}" v-if="myInfo.workId">
        <div class="-popup-title">叫大家来给你的作品点赞吧</div>

        <div class="-popup-item" v-if="!isOpenMore">
          <img class="-item-tip" src="https://pub.file.k12.vip/read/zpfx/zhan.png"/>
          <div class="-item-left">
            <div class="-item-title">
              <span>{{queryInfo.name}}</span>
              <img class="-img" src="https://pub.file.k12.vip/read/gerenzhuye/msfd-button-play copy.png"/>
            </div>
          </div>
          <div class="-item-down">
            <div class="-item-num">
              <img class="-img" src="https://pub.file.k12.vip/read/icon-good.png"/>
              <span>{{myInfo.likes}}</span>
            </div>
            <div class="-item-time">日期: {{myInfo.gmtCreate}}</div>
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
            <img class="-item-tip" v-if="index==0 && queryInfo.type == 2"
                 src="https://pub.file.k12.vip/read/zpfx/zhan.png"/>
            <div class="-item-left">
              <div class="-item-title">
                <span>{{item.coursename}}</span>
                <img class="-img" src="https://pub.file.k12.vip/read/gerenzhuye/msfd-button-play copy.png"/>
              </div>
            </div>
            <div class="-item-down">
              <div class="-item-num">
                <img class="-img" src="https://pub.file.k12.vip/read/icon-good.png"/>
                <span>{{item.likes || 0}}</span>
              </div>
              <div class="-item-time">日期: {{item.gmtCreate}}</div>
            </div>
          </div>
        </scroll-view>

        <div class="-popup-more" @click="openMore" v-if="!isOpenMore">选择其他作品 ></div>
      </div>

      <div class="ld-popularityRank-popup-no" v-if="!myInfo.workId">
        <div class="popup-wrap">
          <div class="popup-text-one">你还没有朗读作品</div>
          <div class="popup-text-two">快去朗读吧！</div>
          <div class="popup-btn" @tap="closePopup">我知道了</div>
        </div>
      </div>

      <button open-type="share" class="ld-popularityRank-popup-btn" v-if="myInfo.workId">分享到班级群</button>

    </wux-popup>
  </div>
</template>

<script>
  import api from "../../request/api";
  import store from "../../store";
  import dayjs from "dayjs";

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

    onShareAppMessage() {
      return {
        title: `我的孩子刚朗读了《${this.isOpenMore ? this.popupItem.coursename : this.queryInfo.name}》，非常棒，请给TA点个赞吧！`,
        path: `/pages/share/main?id=${this.isOpenMore ? this.popupItem.id : this.myInfo.workId}`,
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

    computed: {
      userInfo() {
        return store.state.userInfo;
      }
    },

    onLoad() {
      this.queryInfo = this.$root.$mp.query;
    },

    mounted() {
      this.closePopup();
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
      toRead() {
        wx.navigateTo({
          url: `/pages/read/main?id=${this.queryInfo.id}`
        });
        this.isOpenPopup = false;
      },
      changeItem(data) {
        this.popupItem = data;
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
          this.isOpenMore = true;
        }
      },
      closePopup() {
        this.isOpenMore = false;
        this.isOpenPopup = false;
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
        console.log(1);
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
          this.popupItem = this.dataShareList[0];
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
          this.popupItem = this.dataShareList[0];
          this.isFetching = false;
        }, () => {
          this.isFetching = false;
        });
      },
      getMyRankInfo() {
        this.isShowMyWork = true;
        api.work.userLikeRankForMe({
          courseId: this.queryInfo.id
        })
          .then(({ data }) => {
            if (data.resultData != null) {
              this.myInfo = data.resultData;
              // this.myInfo.gmtCreate = dayjs(+this.myInfo.gmtCreate).format('YYYY-MM-DD HH:mm:ss')
            } else {
              this.isShowMyWork = false;
            }
          });
      },
      getMyWeekInfo() {
        this.isShowMyWork = true;
        api.user.weekLikeRankForMe({
          nowWeek: this.tabType == 1
        })
          .then(({ data }) => {
            if (data.resultData != null) {
              this.myInfo = data.resultData;
              // this.myInfo.gmtCreate = dayjs(+this.myInfo.gmtCreate).format('YYYY-MM-DD HH:mm:ss')
              this.myInfo.workId = "11";
            } else {
              this.dataItem = "";
              this.myInfo = {
                workId: "",
                likes: "0",
                headimage: this.userInfo.headimgurl,
                nickname: this.userInfo.nickname,
                rank: "-1"
              };
            }
          });
      }
    }
  };
</script>

<style lang="scss" scoped>
  .ld-popularityRank {
    position: relative;
    background: rgba(255, 255, 255, 1);
    height: 160px;

    .-active1 {
      font-size: 20px;
      font-weight: 500;
      color: #FFFFFF !important;
      background: #30D098;
      border-radius: 10px 0 0 0;
    }

    .-active2 {
      font-size: 20px;
      font-weight: 500;
      color: #FFFFFF !important;
      background: #30D098;
      border-radius: 0 10px 0 0;
    }

    .-content-wrap-height {
      height: calc(100vh - 60px) !important;
    }

    &-noDate {
      margin-top: 206px;
      text-align: center;

      .-img {
        width: 278px;
        height: 97px;
      }

      .-text {
        margin-top: 10px;
        height: 17px;
        font-size: 12px;
        font-weight: 400;
        color: rgba(112, 115, 116, 1);
        line-height: 17px;
      }
    }

    &-noDate-week {
      margin-top: 50px;
    }

    &-header {
      box-sizing: border-box;
      z-index: 2;
      padding: 16px 24px;
      background: url("https://pub.file.k12.vip/read/paihangbang/bg-none-1.png") no-repeat;
      background-size: cover;
      height: 135px;

      .-header-span {
        height: 42px;
        font-size: 30px;
        font-weight: 500;
        color: rgba(255, 255, 255, 1);
        line-height: 42px;
        padding-top: 16px;
      }
    }

    &-week {
      background: url("https://pub.file.k12.vip/read/paihangbang/bg-none-2.png") no-repeat;
      background-size: 100%;
      height: 302px;
      padding: 0;

      .-header-span {
        display: inline-block;
        padding: 35px 0 0 30px !important;
      }
    }

    &-user {
      position: absolute;
      top: 100px;
      z-index: 3;
      background: rgba(255, 255, 255, 1);
      border-radius: 10px 10px 0 0;
      border-bottom: 5px solid #F6F6F6;
      margin: 0 !important;
      width: 100%;
      height: 100px;

      .-user-item {
        display: flex;
        box-sizing: border-box;
        align-items: center;
        justify-content: center;
        padding: 0 24px;
      }

      .-user-no {
        font-size: 14px !important;
      }
    }

    &-week-user {
      top: 182px;
      height: 145px;

      .-user-title-wrap {
        display: flex;
        justify-content: center;
        align-items: center;
        border-bottom: 1px solid #F3F3F3;

        .-user-title {
          width: calc(100vw / 2);
          height: 45px;
          line-height: 45px;
          text-align: center;
          color: #99A3B6;
        }
      }
    }

    &-content {
      /*margin-top: 100px;*/
      z-index: 2;
      height: calc(100vh - 50px);

      &-wrap {
        margin-top: 90px;
        position: relative;
        padding: 0 24px;
      }

      &-wrap-week {
        margin-top: 50px;
      }
    }

    &-footer {
      position: fixed;
      bottom: 0;
      width: 100%;
      height: 61px;
      background: rgba(255, 255, 255, 1);

      .-footer-wrap {
        padding: 0 24px;
        height: 100%;

        .-footer-img {
          position: absolute;
          right: 24px;
          top: -24px;
          width: 48px;
          height: 52px;
        }
      }
    }

    .-more {
      height: 440px !important;

      .-popup-item {
        margin: 0 16px 24px 16px !important;
      }
    }

    &-popup-content {
      margin: 0 24px;
      width: 327px;
      height: 250px;
      background: rgba(255, 255, 255, 1);
      border-radius: 26px;

      .-popup-title {
        font-size: 20px;
        font-weight: 500;
        color: #324062;
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
        border-radius: 16px;
        border: 1px solid rgba(0, 0, 0, 0.08);

        .-item-tip {
          position: absolute;
          top: 0;
          left: 0;
          width: 56px;
          height: 18px;
        }

        .-item-left {

          .-item-title {
            display: flex;
            align-items: center;
            justify-content: space-between;
            font-size: 16px;
            font-weight: 500;
            color: #1D1B1B;

            .-img {
              display: inline-block;
              margin-left: 4px;
              width: 18px;
              height: 18px;
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
            color: #99A3B6;
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
        color: #99A3B6;
      }
    }

    &-popup-no {
      position: relative;
      width: 315px;
      height: 379px;
      @include bg('/read/tc/1.png');

      .popup-wrap {
        padding-top: 208px;
        text-align: center;
      }

      .popup-text-one {
        height:28px;
        font-size:20px;
        font-weight:400;
        color:rgba(50,64,98,1);
        line-height:28px;
      }

      .popup-text-two {
        margin-top: 4px;
        height:33px;
        font-size:24px;
        font-weight:500;
        color:rgba(50,64,98,1);
        line-height:33px;
      }

      .popup-btn {
        margin: 24px auto 0;
        width:179px;
        height:40px;
        background:rgba(54,219,164,1);
        border-radius:26px;
        font-size:15px;
        font-weight:500;
        color:rgba(255,255,255,1);
        line-height:40px;
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
      background: #36DBA4 !important;
      border-radius: 26px;
    }

    .item-wrap {
      display: flex;
      align-items: center;
      justify-content: space-between;
      background: rgba(255, 255, 255, 1);
      margin: 28px 0;

      .-item-img-wrap {
        width: 70px;
        text-align: center;
      }

      .-item-img {
        width: 32px !important;
        height: 36px !important;
      }

      .-item-left {
        font-size: 26px;
        font-weight: 600;
        color: #FF9F00;
        width: 70px;
        text-align: center;
        /*line-height: 24px;*/
      }

      .-item-center {
        width: 75%;
        display: flex;
        text-align: left;
        align-items: center;

        &-img {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          margin-right: 24px;
        }

        &-text {

          .-name {
            font-weight: bold;
            font-size: 16px;
            line-height: 22px;
            color: #324062;
          }
          .-zan {
            color: #5E677B;
            margin-top: 5px;
            font-size: 12px;
            font-weight: 400;
            line-height: 17px;

            &-img {
              margin-right: 10px;
              width: 16px;
              height: 16px;
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
