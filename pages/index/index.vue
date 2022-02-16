<template>
  <scroll-view class="container container-index" style="overflow-y: scroll;">
<!--    <view v-if="SHOW_TIP">-->
<!--      <add-tips :statusBarHeight="statusBarHeight" />-->
<!--    </view>-->

    <view class="menu-list" :style="{'margin-top': statusBarHeight+40+'px' }">

      <!-- #ifdef MP -->
      <!--   banner广告    -->
      <view class="ad-container margin-top cu-list menu sm-border card-menu">
        <ad :unit-id="unitId1" style="z-index: 9"></ad>
      </view>
      <!-- #endif -->

      <view class="cu-card article" @click="dateHandle">
        <view class="cu-item shadow" style="margin: 30rpx 30rpx 0rpx 30rpx;">
          <view class="title">
            <view class="text-cut">限时节日挂件</view>
          </view>
          <view class="content">
            <image style="width: 180rpx;" src="/static/image/logo/date.jpg" mode="aspectFill"></image>
            <view class="desc">
              <view class="text-content">春节,七夕,中秋等限时节日挂件,让你的头像引领潮流</view>
              <view>
                <view class="grid justify-between">
                  <view>
                    <view class="cu-tag bg-red light sm round">限时制作</view>
                    <view class="cu-tag bg-cyan light sm round">根据节日动态更新</view>
                  </view>
                </view>
              </view>
            </view>
          </view>
        </view>
      </view>

      <view class="cu-card article" @click="addMask">
        <view class="cu-item shadow" style="margin: 30rpx 30rpx 0rpx 30rpx;">
          <view class="title">
            <view class="text-cut">换个发型带口罩</view>
          </view>
          <view class="content">
            <image style="width: 180rpx;" src="/static/image/logo/gexing-logo.jpg" mode="aspectFill"></image>
            <view class="desc">
              <view class="text-content">给头像换发型、加帽子。阳光太刺眼带个墨镜吧</view>
              <view>
                <view class="grid justify-between">
                  <view>
                    <view class="cu-tag bg-red light sm round">防疫情,保健康</view>
                    <!--										 <view class="cu-tag bg-cyan light sm round">保健康</view>-->
                  </view>
                </view>
              </view>
            </view>
          </view>
        </view>
      </view>

      <view class="cu-card article" @click="animeHandle">
        <view class="cu-item shadow" style="margin: 30rpx 30rpx 0rpx 30rpx;">
          <view class="title">
            <view class="text-cut">卡通动漫风</view>
          </view>
          <view class="content">
            <image style="width: 180rpx;" src="/static/image/logo/anime-logo.jpg" mode="aspectFill"></image>
            <view class="desc">
              <view class="text-content">让头像转换成温柔的卡通动漫风格,欧拉欧拉木大木大</view>
              <view>
                <view class="grid justify-between">
                  <view>
                    <view class="cu-tag bg-red light sm round">日漫风、手绘风</view>
                    <view class="cu-tag bg-cyan light sm round">艺术特效</view>
                  </view>
                </view>
              </view>
            </view>
          </view>
        </view>
      </view>

      <view class="cu-card article" @click="pixi">
        <view class="cu-item shadow" style="margin: 30rpx 30rpx 0rpx 30rpx;">
          <view class="title">
            <view class="text-cut">可爱像素风</view>
          </view>
          <view class="content">
            <image style="width: 180rpx;" src="/static/image/logo/pixi-logo.jpg" mode="aspectFill"></image>
            <view class="desc">
              <view class="text-content">让头像变成可爱的像素风格,愿我们童心永存</view>
              <view>
                <view class="grid justify-between">
                  <view>
                    <view class="cu-tag bg-red light sm round">像素风</view>
                    <view class="cu-tag bg-cyan light sm round">卡通风</view>
                  </view>
                </view>
              </view>
            </view>
          </view>
        </view>
      </view>

      <!-- #ifdef MP-WEIXIN -->
      <view class="cu-card article" @click="wangzhe">
        <view class="cu-item shadow" style="margin: 30rpx 30rpx 0rpx 30rpx; ">
          <view class="title">
            <view class="text-cut">王者皮肤免费抽</view>
          </view>
          <view class="content">
            <image style="width: 180rpx;" src="/static/image/logo/wangzhe.jpg" mode="aspectFill"></image>
            <view class="desc">
              <view class="text-content">王者幸运星小程序,皮肤免费抽,碎片免费送！</view>
              <view>
                <view class="grid justify-between">
                  <view>
                    <view class="cu-tag bg-red light sm round">王者皮肤</view>
                    <view class="cu-tag bg-cyan light sm round">良心推荐</view>
                  </view>
                </view>
              </view>
            </view>
          </view>
        </view>
      </view>
      <!-- #endif -->

      <!-- #ifdef MP-WEIXIN -->
      <view class="cu-card article" @click="ganfanzu">
        <view class="cu-item shadow" style="margin: 30rpx 30rpx 0rpx 30rpx; ">
          <view class="title">
            <view class="text-cut">每日外卖红包</view>
          </view>
          <view class="content">
            <image style="width: 180rpx;" src="/static/image/logo/ganfanzu.jpg" mode="aspectFill"></image>
            <view class="desc">
              <view class="text-content">干饭组小程序,可每日领取饿了么、美团外卖红包</view>
              <view>
                <view class="grid justify-between">
                  <view>
                    <view class="cu-tag bg-red light sm round">外卖红包</view>
                    <view class="cu-tag bg-cyan light sm round">良心推荐</view>
                  </view>
                </view>
              </view>
            </view>
          </view>
        </view>
      </view>
      <!-- #endif -->

      <!-- #ifdef MP -->
      <!--   banner广告    -->
      <view class="ad-container margin-top cu-list menu sm-border card-menu">
        <ad :unit-id="unitId2" style="z-index: 9"></ad>
      </view>
      <!-- #endif -->

      <view class="cu-card article" @click="addSlogan">
        <view class="cu-item shadow" style="margin: 30rpx 30rpx 0rpx 30rpx; ">
          <view class="title">
            <view class="text-cut">头像横幅口号</view>
          </view>
          <view class="content">
            <image style="width: 180rpx;" src="/static/image/logo/slogan-logo.jpg" mode="aspectFill"></image>
            <view class="desc">
              <view class="text-content">饮茶先啦,只想搞钱,买房买车,我要减肥,拒绝暧昧</view>
              <view>
                <view class="grid justify-between">
                  <view>
                    <view class="cu-tag bg-red light sm round">自定义口号</view>
                    <!-- <view class="cu-tag bg-cyan light sm round">自定义口号</view> -->
                  </view>
                </view>
              </view>
            </view>
          </view>
        </view>
      </view>

      <view class="cu-card article" @click="addText">
        <view class="cu-item shadow" style="margin: 30rpx 30rpx 0rpx 30rpx; ">
          <view class="title">
            <view class="text-cut">头像加字</view>
          </view>
          <view class="content">
            <image style="width: 180rpx;" src="/static/image/logo/text-logo.jpg" mode="aspectFill"></image>
            <view class="desc">
              <view class="text-content">头像一键加字,加V字,制作姓氏头像,让你在朋友圈脱颖而出</view>
              <view>
                <view class="grid justify-between">
                  <view>
                    <view class="cu-tag bg-red light sm round">任意文字、颜色</view>
                    <!-- <view class="cu-tag bg-cyan light sm round">多种颜色</view> -->
                  </view>
                </view>
              </view>
            </view>
          </view>
        </view>
      </view>

      <!-- #ifdef MP -->
      <view class="cu-card article" @click="getRedPackpage">
        <view class="cu-item shadow" style="margin: 30rpx 30rpx 0rpx 30rpx; ">
          <view class="title">
            <view class="text-cut">微信红包封面</view>
          </view>
          <view class="content">
            <image style="width: 180rpx;" src="/static/image/logo/red-package.jpg" mode="aspectFill"></image>
            <view class="desc">
              <view class="text-content">免费领取微信红包封面,每日6点定时刷新,数量有限先到先得</view>
              <view>
                <view class="grid justify-between">
                  <view>
                    <view class="cu-tag bg-red light sm round">红包封面</view>
                    <view class="cu-tag bg-cyan light sm round">先到先得</view>
                  </view>
                </view>
              </view>
            </view>
          </view>
        </view>
      </view>
      <!-- #endif -->

      <view class="about-actions margin-top cu-list menu sm-border card-menu animation-shake animation-speed-2 animation-delay-3">
        <view class="cu-item arrow feedback-btn" @tap="ifndefMp">
          <view class="content">
            <button class="free-btn-bordernone" open-type="contact">
              <tui-icon name="kefu" color="green" :size="20"></tui-icon>
              <text style="color: grey; padding-left: 10px;" class="text-sm">
                联系客服
              </text>
            </button>
          </view>
        </view>
        <view class="cu-item arrow feedback-btn" @click="yinSi">
          <view class="content">
            <button class="free-btn-bordernone">
              <tui-icon name="about-fill" color="green" :size="20"></tui-icon>
              <text style="color: grey; padding-left: 10px;" class="text-sm">
                隐私说明
              </text>
            </button>
          </view>
        </view>
<!--        <view class="cu-item arrow feedback-btn" @click="tucao">-->
<!--          <view class="content">-->
<!--            <button class="free-btn-bordernone">-->
<!--              <tui-icon name="message" color="green" :size="20"></tui-icon>-->
<!--              <text style="color: grey; padding-left: 10px;" class="text-sm">-->
<!--                产品建议-->
<!--              </text>-->
<!--            </button>-->
<!--          </view>-->
<!--        </view>-->
      </view>

      <!-- #ifdef MP -->
      <!--   视频广告    -->
      <view class="ad-container margin-top cu-list menu sm-border card-menu">
        <ad :unit-id="unitId3" style="z-index: 9" ad-type="video" ad-theme="white"></ad>
      </view>
      <!-- #endif -->

    </view>
  </scroll-view>
</template>

<script>
import tuiIcon from "@/components/tui/icon"
import addTips from "@/components/add-tips"
import Config from "../../config/config"
import { getShareObj } from "@/utils/share.js"

// 在页面中定义插屏广告
let interstitialAd = null;

export default {
  components: {
    tuiIcon,
    addTips
  },
  data() {
    return {
      statusBarHeight: 0,
      SHOW_TIP: false,
      rewardedVideoAdLoaded: false,
      // #ifdef MP-QQ
      unitId1: '03557c198c223bc035bd5f711561d7cf',
      unitId2: '6c91df8d386ab013efc7660c015174ef',
      unitId3: 'dacf01cbf215546a3e82467155485b32',
      // #endif

      // #ifdef MP-WEIXIN
      unitId1: 'adunit-8d83e223ca40688b',
      unitId2: 'adunit-0b31e053930e7671',
      unitId3: 'adunit-38ee7d2334cf0937',
      // #endif
    }
  },
  onLoad() {
    // 在页面onLoad回调事件中创建插屏广告实例
    // if (uni.createInterstitialAd) {
    // 	interstitialAd = uni.createInterstitialAd({
    // 		adUnitId: 'adunit-be801ba020f6edeb'
    // 	})
    // 	interstitialAd.onLoad(() => {})
    // 	interstitialAd.onError((err) => {
    // 		console.log(err);
    // 	})
    // 	interstitialAd.onClose(() => {})
    // }
  },
  onShow() {
    this.statusBarHeight = getApp().globalData.statusBarHeight;
    this.SHOW_TIP = getApp().globalData.SHOW_TIP;

    setTimeout(() => {
      this.SHOW_TIP = false;
    }, 3000);

    if (interstitialAd) {
      interstitialAd.show().catch((err) => {
        console.error(err)
      })
    }
  },
  onShareAppMessage(res) {
    return getShareObj()
  },
  onShareTimeline(res) {
    return getShareObj()
  },
  methods: {
    dateHandle: function() {
      // #ifdef MP-QQ
      uni.reLaunch({
        url: '/pages/date/date'
      })
      // #endif
      // #ifndef MP-QQ
      uni.switchTab({
        url: '/pages/date/date'
      })
      // #endif
    },
    addMask: function() {
      // #ifdef MP-QQ
      uni.reLaunch({
        url: '/pages/mask/add-mask'
      })
      // #endif
      // #ifndef MP-QQ
      uni.switchTab({
        url: '/pages/mask/add-mask'
      })
      // #endif
    },
    animeHandle: function() {
      // #ifdef MP-QQ
      uni.reLaunch({
        url: '/pages/anime/anime'
      })
      // #endif
      // #ifndef MP-QQ
      uni.switchTab({
        url: '/pages/anime/anime'
      })
      // #endif
    },
    pixi: function() {
      // #ifdef MP-QQ
      uni.reLaunch({
        url: '/pages/pixel/pixel'
      })
      // #endif
      // #ifndef MP-QQ
      uni.switchTab({
        url: '/pages/pixel/pixel'
      })
      // #endif

    },
    ganfanzu: function() {
      uni.navigateToMiniProgram({
        appId: Config.jumpAppId,
        path: Config.jumpAppPath,
        success(res) {
        },
        fail(e) {
          console.log(e);
        }
      })
    },
    wangzhe: function() {
      uni.navigateToMiniProgram({
        appId: Config.jumpAppId2,
        path: Config.jumpAppPath2,
        success(res) {
        },
        fail(e) {
          console.log(e);
        }
      })
    },
    addSlogan: function(){
      uni.navigateTo({
        url: '/pages/slogan/add-slogan'
      })
    },
    addText: function(){
      uni.navigateTo({
        url: '/pages/text/add-text'
      })
    },

    // 微信红包封面
    // #ifdef MP-WEIXIN
    getRedPackpage: function(){
      uni.navigateTo({
        url: '/pages/third/red-package'
      })
    },
    // #endif

    yinSi: function(){
      uni.navigateTo({
        url: '/pages/about/agreement'
      })
    },

    tucao: function() {
      const Tucao = requirePlugin('tucao').default;
      this.wx = uni;
      Tucao.init(this, {
        productId: 333338
      }).go();
    },
    handleContact: function(e) {
      console.log(e.detail.path)
      console.log(e.detail.query)
    },

    ifndefMp: function(e) {
      // #ifndef MP
      uni.showModal({
        title: '联系邮箱',
        content: 'MailTo: huaixiu.zhen@gmail.com',
        showCancel: false,
        confirmText: '朕知道了',
      });
      // #endif
    }
  }
}
</script>

<style scoped>
.container-index{
  padding-bottom: 50px;
}

.logo-area{
  position: absolute;
  left: 20px;
}
.ad-container {
  width: 690rpx;
}

.about-actions{
  width: 690rpx;
}

.card-menu {
  margin-left: auto;
  margin-right: auto;
}

.free-btn-bordernone {
  background: none !important;
  color: #000 !important;
  display: inline-block !important;
}

.free-btn-bordernone::after {
  border: none;
}
</style>
