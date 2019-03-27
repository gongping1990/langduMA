<script>
import api from './request/api'
import store from './store'
export default {
  created () {
    this.login()
  },
  methods: {
    login () {
      wx.login({
        success: res => {
          api.user.loginWithWxMa({
            code: res.code
          }).then(({ data }) => {
            store.commit('updateUserInfo', data.resultData)
            if (!data.resultData.id) {
              wx.getSetting({
                success (res) {
                  console.log(res)
                  if (!res.authSetting['scope.userInfo']) {
                    wx.navigateTo({ url: '/pages/authorize/main'})
                  }
                }
              })
            }

          })
        }
      });
    },
  },
  log () {
    console.log(`log at:${Date.now()}`)
  }
}
</script>

<style lang="scss">
.container {
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  padding: 200rpx 0;
  box-sizing: border-box;
}
/* this rule will be remove */
* {
  transition: width 2s;
  -moz-transition: width 2s;
  -webkit-transition: width 2s;
  -o-transition: width 2s;
}
.van-ellipsis {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.van-multi-ellipsis--l2 {
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}
.van-multi-ellipsis--l3 {
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
}
.van-clearfix::after {
  content: '';
  display: table;
  clear: both;
}
.van-hairline,
.van-hairline--bottom,
.van-hairline--left,
.van-hairline--right,
.van-hairline--surround,
.van-hairline--top,
.van-hairline--top-bottom {
  position: relative;
}
.van-hairline--bottom::after,
.van-hairline--left::after,
.van-hairline--right::after,
.van-hairline--surround::after,
.van-hairline--top-bottom::after,
.van-hairline--top::after,
.van-hairline::after {
  content: ' ';
  position: absolute;
  pointer-events: none;
  box-sizing: border-box;
  -webkit-transform-origin: center;
  transform-origin: center;
  top: -50%;
  left: -50%;
  right: -50%;
  bottom: -50%;
  -webkit-transform: scale(0.5);
  transform: scale(0.5);
  border: 0 solid #eee;
}
.van-hairline--top::after {
  border-top-width: 1px;
}
.van-hairline--left::after {
  border-left-width: 1px;
}
.van-hairline--right::after {
  border-right-width: 1px;
}
.van-hairline--bottom::after {
  border-bottom-width: 1px;
}
.van-hairline--top-bottom::after {
  border-width: 1px 0;
}
.van-hairline--surround::after {
  border-width: 1px;
}

::-webkit-scrollbar {
  width: 0;
  height: 0;
  color: transparent;
}
button::after {
  border: none;
}
</style>
