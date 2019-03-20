<template>
  <div class="home">
    <swiper class="home-scroll" indicator-dots  circular>
        <block v-for="item in bannerList" :key="item">
            <swiper-item class="home-scroll-item">
                <image class="banner-image" mode="widthFix" :src="item"></image>
            </swiper-item>
        </block>
    </swiper>
  </div>
</template>

<script>
import card from '@/components/card'

export default {
  data () {
    return {
      bannerList: ['https://pub.file.k12.vip/2019/03/04/1102390948861579266.png','https://pub.file.k12.vip/2018/11/17/d1615b9fa20ee58a38b87a6ed02b96b.png', "https://pub.file.k12.vip/2019/03/04/1102391104851939329.png"]
    }
  },

  components: {
    card
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
