<template>
  <div class="ld-my-work">
    <scroll-view class="ld-my-work-wrap"
                 @scrolltolower="bindLoadItem"
                 scroll-y
                 @scroll="scrollTopFn"
                 scroll-with-animation>
      <div class="ld-my-work-header">
        <div class="-header-down">《{{queryInfo.name}}》 作品集</div>
        <div class="-header-top">
          <img class="-img" :src="userInfo.headimgurl"/>
        </div>
      </div>
      <div class="ld-my-work-footer">
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
    </scroll-view>

    <wux-popup :visible="isShowDel" @close="openDel">
      <div class="ld-my-work-del">
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
  import store from "../../store";

  export default {

    data() {
      return {
        page: {
          current: 1,
          size: 20,
          total: ""
        },
        isFetching: false,
        isShowDel: false,
        dataList: [],
        queryInfo: "",
        dataItem: ""
      };
    },

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

    components: {},

    computed: {
      userInfo() {
        return store.state.userInfo;
      }
    },

    mounted() {
      this.queryInfo = this.$root.$mp.query;
      this.getList();
    },

    methods: {
      lookOtherRead(id) {
        wx.navigateTo({
          url: `/pages/listenWork/main?id=${id}`
        });
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
            this.getList();
          }
        });
      },
      bindLoadItem() {
        if (this.page.current < Math.ceil(this.page.total / this.page.size)) {
          this.page.current++;
          this.getList();
        }
      },
      getList() {
        this.isFetching = true;
        api.work.getSingleList({
          current: this.page.current,
          size: this.page.size,
          courseid: this.queryInfo.id
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
      }
    }
  };
</script>

<style lang="scss" scoped>
  .ld-my-work {

    background: #ffffff;

    &-wrap {
      height: 100vh;
    }

    &-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 18px 24px;
      background: rgba(255, 255, 255, 1);
      box-shadow: 0 0 1px 0 rgba(0, 0, 0, 0.12);
      margin-bottom: 21px;

      .-header-top {
        .-img {
          border-radius: 50%;
          width: 32px;
          height: 32px;
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

      .-footer-item {
        position: relative;
        padding: 26px 16px 19px;
        margin: 21px 24px;
        border-radius: 16px;
        background: rgba(255, 255, 255, 1);
        box-shadow: 0px 2px 10px 0px rgba(222, 232, 237, 1);

        .-item-tip {
          position: absolute;
          top: 0;
          left: 0;
          font-size: 10px;
          font-weight: 400;
          width: 56px;
          height: 18px;
          background: linear-gradient(45deg, rgba(255, 82, 128, 1) 0%, rgba(255, 102, 142, 1) 100%);
          border-radius: 100px 0 100px 0;
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
