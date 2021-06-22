<template>
  <scroll-view class="container container-index" style="overflow-y: scroll;">
    <view v-if="SHOW_TIP">
      <add-tips :statusBarHeight="statusBarHeight" />
    </view>

    <view class="menu-list" :style="{'margin-top': statusBarHeight+40+'px' }">
      <!--   banner广告    -->
<!--      <view class="ad-container margin-top cu-list menu sm-border card-menu">-->
<!--        <ad unit-id="adunit-71fc3d4c859b6b63" style="z-index: 9"></ad>-->
<!--      </view>-->

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
                    <view class="cu-tag bg-green light sm round">根据节日动态更新</view>
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
            <view class="text-cut">头像戴口罩</view>
          </view>
          <view class="content">
            <image style="width: 180rpx;" src="/static/image/logo/mask-logo.jpg" mode="aspectFill"></image>
            <view class="desc">
              <view class="text-content">换上口罩头像,防止疫情蔓延。超过30款口罩、护目镜任你选</view>
              <view>
                <view class="grid justify-between">
                  <view>
                    <view class="cu-tag bg-red light sm round">防疫情,保健康</view>
                    <!--										 <view class="cu-tag bg-green light sm round">保健康</view>-->
                  </view>
                </view>
              </view>
            </view>
          </view>
        </view>
      </view>

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
                    <view class="cu-tag bg-green light sm round">良心推荐</view>
                  </view>
                </view>
              </view>
            </view>
          </view>
        </view>
      </view>

      <!--   banner广告    -->
<!--      <view class="ad-container margin-top cu-list menu sm-border card-menu">-->
<!--        <ad unit-id="adunit-999663d8258f1111" style="z-index: 9"></ad>-->
<!--      </view>-->

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
                    <!-- <view class="cu-tag bg-green light sm round">自定义口号</view> -->
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
                    <!-- <view class="cu-tag bg-green light sm round">多种颜色</view> -->
                  </view>
                </view>
              </view>
            </view>
          </view>
        </view>
      </view>

      <view class="about-actions margin-top cu-list menu sm-border card-menu animation-shake animation-speed-2 animation-delay-3">
        <view class="cu-item arrow feedback-btn">
          <view class="content">
            <button class="free-btn-bordernone" open-type="contact">
              <tui-icon name="kefu" color="green" :size="20"></tui-icon>
              <text style="color: grey; padding-left: 10px;" class="text-sm">
                联系客服
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

      <!--   视频广告    -->
<!--      <view class="ad-container margin-top cu-list menu sm-border card-menu">-->
<!--        <ad unit-id="adunit-88e7b3ed90d66294" style="z-index: 9" ad-type="video" ad-theme="white"></ad>-->
<!--      </view>-->
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
      rewardedVideoAdLoaded: false
    }
  },
  onLoad() {
    // 在页面onLoad回调事件中创建插屏广告实例
    // if (wx.createInterstitialAd) {
    // 	interstitialAd = wx.createInterstitialAd({
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
      uni.switchTab({
        url: '/pages/date/date'
      })
    },
    addMask: function() {
      uni.switchTab({
        url: '/pages/mask/add-mask'
      })
    },
    ganfanzu: function() {
      wx.navigateToMiniProgram({
        appId: Config.jumpAppId,
        path: Config.jumpAppPath,
        success(res) {
        },
        fail(e) {
          console.log(e);
        }
      })
    },
    addSlogan: function(){
      uni.switchTab({
        url: '/pages/slogan/add-slogan'
      })
    },
    addText: function(){
      uni.switchTab({
        url: '/pages/text/add-text'
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
