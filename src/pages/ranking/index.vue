<template>
  <div class="home">
   排行
  </div>
</template>

<script>

export default {
  data () {
    return {
      bannerList: ['https://pub.file.k12.vip/2019/03/04/1102390948861579266.png','https://pub.file.k12.vip/2018/11/17/d1615b9fa20ee58a38b87a6ed02b96b.png', "https://pub.file.k12.vip/2019/03/04/1102391104851939329.png"]
    }
  },


  methods: {
    bindViewTap () {
      const url = '../logs/main'
      if (mpvuePlatform === 'wx') {
        mpvue.switchTab({ url })
      } else {
        mpvue.navigateTo({ url })
      }
    },
    clickHandle (ev) {
      console.log('clickHandle:', ev)
      // throw {message: 'custom test'}
    }
  },

  created () {
    // let app = getApp()
  }
}
</script>

<style lang="scss" scoped>
.home {
  &-scroll {
    margin: 0 auto;
    width: 80%;
    &-item {
      overflow: auto;
      .banner-image {
        width: 100%;
      }
    }
  }
}
</style>
