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
        <div class="-footer-title"><span></span>作品集</div>

        <div class="-footer-item"
             v-for="(item, index) of dataList"
             :key="index"
             @click="lookOtherRead(item.id)">
          <div class="-item-left">
            <div class="-item-title">{{item.coursename}}</div>
            <img class="-item-img" src="https://pub.file.k12.vip/read/gerenzhuye/msfd-button-play.png"/>
          </div>
          <div class="-item-down">
            <div class="-item-num">
              <img class="-img"
                   src="https://pub.file.k12.vip/read/rank/icon-good2.png" />
              <span>{{item.likes || 0}}</span>
            </div>
            <div class="-item-time">{{item.grade}} · {{item.semester}} 日期: {{item.gmtCreate}}</div>
          </div>
        </div>
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

  </div>
</template>

<script>
import api from "../../request/api";

export default {

  data () {
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

  mounted () {
    this.queryInfo = this.$root.$mp.query
    this.getWorkList();
    this.getMessageInfo();
  },

  components: {},

  methods: {
    lookOtherRead (id) {
      wx.navigateTo({
        url: `/pages/share/main?id=${id}`
      });
    },
    bindLoadItem () {
      if (this.page.current < Math.ceil(this.page.total / this.page.size)) {
        this.page.current++;
        this.getWorkList()
      }
    },
    getWorkList () {
      this.isFetching = true;

      api.work.otherWorksList({
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
    getMessageInfo () {
      this.isFetching = true;

      api.work.otherMessage({
        userId: this.queryInfo.userId
      })
        .then(({ data }) => {
          this.userInfo = data.resultData;
          this.isFetching = false;
        }, () => {
          this.isFetching = false;
        });
    }
  },
  onShareAppMessage () {
    return {
      title: '[获课朗读]一线名师和你一起朗读',
      path: '/pages/index/main',
      imageUrl: 'https://pub.file.k12.vip/read/ldshared.jpeg'
    };
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
      margin: 24px 24px;
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
        }

        .-item-img {
          display: inline-block;
          width: 34px;
          height: 35px;
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
          color: #5E677B;
          line-height: 17px;

          .-img {
            margin-right: 6px;
            width: 11px;
            height: 13px;
          }
        }
      }
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
}
</style>
