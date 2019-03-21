<template>
  <div class="ld-popularityRank">
    <div class="ld-popularityRank-header">
      <span :class="{'-active': tabType == '1'}" class="-header-span" @click="changeTab(1)">本周排行</span>
      <span :class="{'-active': tabType == '2'}" @click="changeTab(2)">上周排行</span>
    </div>
    <scroll-view class="ld-popularityRank-content"
                 @scrolltolower="bindLoadItem"
                 scroll-y
                 scroll-with-animation>
      <div class="ld-popularityRank-content-wrap">
        <div class="-content-item-one">
          <div class="-img"></div>
          <div class="-item-one-wrap">
            <div class="-item-one-wrap-text">
              <div class="-name">VikentiyChaykovsky</div>
              <div class="-zan">29</div>
            </div>
            <div class="-item-one-wrap-img"></div>
          </div>
        </div>
        <div class="item-wrap -content-wrap" v-for="(item,index) of 20" :key="index">
          <div class="-item-left">{{index}}</div>
          <div class="-item-center">
            <div class="-item-center-img"></div>
            <div class="-item-center-text">
              <div class="-name">VikentiyChaykovsky</div>
              <div class="-zan">29</div>
            </div>
          </div>
          <div class="-item-right">
            <div class="-item-right-img"></div>
          </div>
        </div>
      </div>
    </scroll-view>

    <div class="ld-popularityRank-footer">
      <div class="-footer-wrap">
        <div class="item-wrap">
          <div class="-item-left">200</div>
          <div class="-item-center">
            <div class="-item-center-img"></div>
            <div class="-item-center-text">
              <div class="-name">VikentiyChaykovsky</div>
              <div class="-zan">29</div>
            </div>
          </div>
          <div class="-item-right">集赞冲榜 ></div>
        </div>
      </div>
    </div>
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
        dataList: [],
        tabType: "1"
      };
    },

    components: {},

    methods: {
      changeTab(num) {
        this.tabType = num;
      },
      bindLoadItem() {
        console.log(111);
        if (this.page.current < Math.ceil(this.page.total / this.page.size)) {
          this.page.current++;
          // this.getList()
        }
      },
      getList() {
        this.isFetching = true;
        api.userAccount.getUserAccountIncomeList({
          current: this.page.current,
          size: this.page.size
        }).then(({ data }) => {
          let array = [];
          let arrayStorage = [];

          data.resultData.records.forEach(item => {
            if (item.income) {
              array.push(item);
            }
          });

          if (this.page.current > 1) {
            arrayStorage = arrayStorage.concat(array);
          } else {
            arrayStorage = array;
          }

          this.page.total = data.resultData.total;
          this.isFetching = false;
        }, () => {
          this.isFetching = false;
        });
      }
    },

    created() {
      // let app = getApp()
    }
  };
</script>

<style lang="scss" scoped>
  .ld-popularityRank {
    height: 100vh;
    background: rgba(74, 74, 74, 1);

    .-active {
      font-size: 20px;
      font-weight: 500;
      color: rgba(255, 255, 255, 1);
      line-height: 28px;
    }

    &-header {
      padding: 16px 24px;
      font-size: 16px;
      font-weight: 400;
      color: rgba(155, 155, 155, 1);
      line-height: 22px;

      .-header-span {
        margin-right: 24px;
      }
    }

    &-content {
      height: calc(100vh - 100px - 60px);

      &-wrap {
        position: relative;
        padding: 60px 24px 0;

        .-content-item-one {
          padding: 0 16px 0 24px;
          height: 101px;
          background: rgba(255, 255, 255, 1);
          border-radius: 6px;
          border: 2px solid rgba(0, 0, 0, 1);

          .-img {
            position: absolute;
            top: 36px;
            left: 48px;
            width: 48px;
            height: 48px;
            border-radius: 50%;
            background: rgba(216, 216, 216, 1);
            border: 2px solid rgba(0, 0, 0, 1);
            z-index: 999;
          }

          .-item-one-wrap {
            display: flex;
            justify-content: space-between;
            align-items: center;
            height: 100%;

            &-img {
              border-radius: 50%;
              width: 32px;
              height: 32px;
              background: rgba(74, 74, 74, 1);
            }

            &-text {
              color: rgba(74, 74, 74, 1);

              .-name {
                font-size: 16px;
                font-weight: 500;
                line-height: 22px;
              }
              .-zan {
                font-size: 12px;
                font-weight: 400;
                line-height: 17px;
              }
            }
          }
        }

        .-content-wrap {
          padding: 0 16px;
        }
      }
    }

    &-footer {
      position: fixed;
      bottom: 0;
      width: 100%;
      height: 100px;
      background: rgba(255, 255, 255, 1);
      box-shadow: 0 1px 1px 0 rgba(0, 0, 0, 0.12);

      .-footer-wrap {
        padding: 0 24px;
        height: 100%;
      }
    }

    .item-wrap {
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: 76px;
      background: rgba(255, 255, 255, 1);
      border-radius: 6px;
      margin: 16px 0;

      .-item-left {
        font-size: 17px;
        font-weight: 600;
        color: rgba(0, 0, 0, 1);
        line-height: 24px;
      }

      .-item-center {
        display: flex;
        justify-content: space-between;
        align-items: center;

        &-img {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: rgba(216, 216, 216, 1);
          margin-right: 12px;
        }

        &-text {
          color: rgba(74, 74, 74, 1);

          .-name {
            font-size: 16px;
            font-weight: 500;
            line-height: 22px;
          }
          .-zan {
            font-size: 12px;
            font-weight: 400;
            line-height: 17px;
          }
        }
      }

      .-item-right {
        font-size: 12px;
        font-weight: 400;
        color: rgba(0, 0, 0, 1);
        line-height: 17px;

        &-img {
          border-radius: 50%;
          width: 32px;
          height: 32px;
          background: rgba(74, 74, 74, 1);
        }
      }
    }
  }
</style>
