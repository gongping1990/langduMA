<script>
export default {
  created () {
    // 调用API从本地缓存中获取数据
    /*
     * 平台 api 差异的处理方式:  api 方法统一挂载到 mpvue 名称空间, 平台判断通过 mpvuePlatform 特征字符串
     * 微信：mpvue === wx, mpvuePlatform === 'wx'
     * 头条：mpvue === tt, mpvuePlatform === 'tt'
     * 百度：mpvue === swan, mpvuePlatform === 'swan'
     * 支付宝(蚂蚁)：mpvue === my, mpvuePlatform === 'my'
     */

    let logs
    if (mpvuePlatform === 'my') {
      logs = mpvue.getStorageSync({ key: 'logs' }).data || []
      logs.unshift(Date.now())
      mpvue.setStorageSync({
        key: 'logs',
        data: logs
      })
    } else {
      logs = mpvue.getStorageSync('logs') || []
      logs.unshift(Date.now())
      mpvue.setStorageSync('logs', logs)
    }
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

::-webkit-scrollbar {
  width: 0;
  height: 0;
  color: transparent;
}

.van-ellipsis{overflow:hidden;white-space:nowrap;text-overflow:ellipsis}.van-multi-ellipsis--l2{overflow:hidden;text-overflow:ellipsis;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical}.van-multi-ellipsis--l3{overflow:hidden;text-overflow:ellipsis;display:-webkit-box;-webkit-line-clamp:3;-webkit-box-orient:vertical}.van-clearfix::after{content:'';display:table;clear:both}.van-hairline,.van-hairline--bottom,.van-hairline--left,.van-hairline--right,.van-hairline--surround,.van-hairline--top,.van-hairline--top-bottom{position:relative}.van-hairline--bottom::after,.van-hairline--left::after,.van-hairline--right::after,.van-hairline--surround::after,.van-hairline--top-bottom::after,.van-hairline--top::after,.van-hairline::after{content:' ';position:absolute;pointer-events:none;box-sizing:border-box;-webkit-transform-origin:center;transform-origin:center;top:-50%;left:-50%;right:-50%;bottom:-50%;-webkit-transform:scale(.5);transform:scale(.5);border:0 solid #eee}.van-hairline--top::after{border-top-width:1px}.van-hairline--left::after{border-left-width:1px}.van-hairline--right::after{border-right-width:1px}.van-hairline--bottom::after{border-bottom-width:1px}.van-hairline--top-bottom::after{border-width:1px 0}.van-hairline--surround::after{border-width:1px}
</style>
