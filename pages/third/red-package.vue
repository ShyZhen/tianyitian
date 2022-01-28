<template>
  <view class="container" style="overflow: hidden;" :style="{height:heightVH}">
    <!--    <view v-if="SHOW_TIP">-->
    <!--      <add-tips :statusBarHeight="statusBarHeight" />-->
    <!--    </view>-->

  </view>
</template>
<script>
import Config from "@/config/config"
import addTips from "@/components/add-tips"
import { getShareObj } from "@/utils/share.js"

// 在页面中定义激励视频广告
let videoAd = null;
// 在页面中定义插屏广告
let interstitialAd = null

export default {
  components: {
    addTips,
  },
  data() {
    return {
      SHOW_TIP: false,
      statusBarHeight: 0,
      heightVH: '110vh',
    }
  },
  onLoad(option) {
    let that = this;

    if (this.windowHeight <= 520) {
      this.heightVH = '120vh'
    }

    /*
    // 在页面onLoad回调事件中创建插屏广告实例
    if (uni.createInterstitialAd) {
      interstitialAd = uni.createInterstitialAd({
        adUnitId: 'adunit-ae132e93d50f453f'
      })
      interstitialAd.onLoad(() => {})
      interstitialAd.onError((err) => {
        console.log(err);
      })
      interstitialAd.onClose(() => {})
    }
    */

    // #ifdef MP
    // 在页面onLoad回调事件中创建激励视频广告实例
    if (uni.createRewardedVideoAd) {
      videoAd = uni.createRewardedVideoAd({
        adUnitId: 'adunit-fca91856edc6089d'
      })
      videoAd.onLoad(() => {
        that.rewardedVideoAdLoaded = true;
      })
      videoAd.onError((err) => {
        // 广告组件出现错误，直接允许用户保存，不做其他复杂处理
        that.rewardedVideoAdLoaded = false;
      })
      videoAd.onClose((res) => {
        if (res && res.isEnded || res === undefined) {
          // 正常播放结束，下发奖励
          that.savedCounts = that.addCounts
          setSavedCounts(that.addCounts)

          that.saveCans()
        } else {
          // 播放中途退出，进行提示
          that.$toast('请完整观看哦')
        }
      })
    }
    // #endif

  },
  onReady() {

    // 判断是否已经显示过
    let cache = uni.getStorageSync(getApp().globalData.STORAGE_KEY);
    if (!cache) {
      this.statusBarHeight = uni.getSystemInfoSync().statusBarHeight;

      // 没显示过，则进行展示
      this.SHOW_TIP = true;
      // 关闭时间
      let that = this;
      setTimeout(() => {
        that.SHOW_TIP = false;
      }, 5000);
    }
  },
  onShow() {
    let that = this

    // 在适合的场景显示插屏广告
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

  }
}
</script>

<style lang="scss" scoped>
.avatar-container {
  height: 290px;
  width: 100%;
  margin-top: 150rpx;
  margin-left: auto;
  margin-right: auto;
  // background-size: 100%;
}

.avatar-bg-border {
  border: 6px solid white;
  border-radius: 10px;
  width: 282px;
  height: 282px;
}

.avatar-bg {
  position: absolute;
  z-index: 10;
  height: 270px;
  width: 270px;
}

.action-wrapper {
  padding-top: 50rpx;
  padding-left: 100rpx;
  padding-right: 100rpx;
  font-weight: 800;
}

.share-wrapper {
  padding-top: 10rpx;
  padding-left: 100rpx;
  padding-right: 100rpx;
  font-weight: 800;
}

.mask {
  height: 100px;
  width: 100px;
  position: absolute;
  top: 100px;
  border: 3px solid rgba(255, 255, 255, 0.0);
}

.maskWithBorder {
  border: dashed 3px white;
}

.hideHandle {
  display: none;
}

.circle {
  border-radius: 50%;
  font-size: 15px;
  color: #000;
  line-height: 25px;
  text-align: center;
  background: #fff;
}

.handle,
.cancel {
  position: absolute;
  z-index: 1;
  width: 25px;
  height: 25px;
  background-color: white;
  color: black;
}

.scrollView {
  width: 100%;
  position: absolute;
  bottom: 0px;
  white-space: nowrap;
}

.infoView {
  width: 95%;
  position: absolute;
  bottom: 85px;
  white-space: nowrap;
  background-color: white;
  margin: 10px;
  padding: 1px 5px;
  border-radius: 5px;
  white-space: pre-wrap;
}


// cavans 真机上无法隐藏
.cans-id-mask {
  //position: absolute;
  //left: 1000px;

  position: absolute;
  z-index: 0;
  height: 270px;
  width: 270px;
}

.flip-horizontal {
  -moz-transform: scaleX(-1);
  -webkit-transform: scaleX(-1);
  -o-transform: scaleX(-1);
  transform: scaleX(-1);
}

.check-scroll {
  width: 100%;
  position: absolute;
  margin-top: 5%;
  text-align: center;
  .check-date {
    width: 30%;
    margin: 0 5px 0 5px;
    display: inline-flex;
    color: white;
  }
}


.tui-dropdown-list {
  width: 140px !important;
}

.tui-drop-input-box {
  box-sizing: border-box;
}

.tui-animation {
  display: inline-block;
  transform: rotate(0deg);
  transition: all 0.2s;
}

.tui-animation-show {
  transform: rotate(180deg);
}

.tui-selected-list {
  width: 140px;
  background: #fff;
  border-radius: 20upx;
  overflow: hidden;
  transform: translateZ(0);
}

.tui-dropdown-scroll {
  height: 300upx;
}

.tui-btn-block {
  height: 60rpx !important;
  line-height: 60rpx !important;
  font-size: 32rpx !important;

}
</style>
