<template>
  <view class="container" style="overflow: hidden;" :style="{height:heightVH}">
    <view class="margin-tb-lg">
      <view>
        <carousel :img-list="itemsList" @selected="selected" @selected2="selected2" url-key="url"/>
      </view>
<!--      <view class="box">-->
<!--        <vastwu-imgbox :list="itemsList" :offsetX="16" :offsetY="8" @slideclick="selected" :auto=false></vastwu-imgbox>-->
<!--      </view>-->
    </view>

    <view class="bottom-bar">
      <view class="bottom-button bg-gradual-blue shadow">
        <text @tap="handleClick">以上由淘宝店铺【恭喜发财工作室】提供</text>
      </view>
    </view>

  </view>
</template>
<script>
import Config from "@/config/config"
import addTips from "@/components/add-tips"
import { getShareObj } from "@/utils/share"
import vastwuImgbox from '@/components/vastwu-imgbox/vastwu-imgbox'
import carousel from '@/components/vear-carousel'

// 在页面中定义激励视频广告
let videoAd = null;
// 在页面中定义插屏广告
let interstitialAd = null

export default {
  components: {
    addTips,
    vastwuImgbox,
    carousel
  },
  data() {
    return {
      SHOW_TIP: false,
      statusBarHeight: 0,
      heightVH: '110vh',
      // 职业（医生教师妈妈爸爸等）、节假日（春节除夕七夕圣诞等）
      itemsList: [{
        title: '啊啊啊',
        url: Config.imageCdn + '/MPTian/redpackage/1.jpg',
        getKey: 'https://support.weixin.qq.com/cgi-bin/mmsupport-bin/showredpacket?receiveuri=kuz5ixSgJdZ&check_type=2#wechat_redirect'
      },{
        title: '发发发的',
        url: Config.imageCdn + '/MPTian/redpackage/1.jpg',
        getKey: 'https://support.weixin.qq.com/cgi-bin/mmsupport-bin/showredpacket?receiveuri=kuz5ixSgJdZ&check_type=2#wechat_redirect'
      },{
        title: '沙发的啊就了',
        url: Config.imageCdn + '/MPTian/redpackage/1.jpg',
        getKey: 'https://support.weixin.qq.com/cgi-bin/mmsupport-bin/showredpacket?receiveuri=kuz5ixSgJdZ&check_type=2#wechat_redirect'
      }],
    }
  },
  onLoad(option) {
    let that = this;

    if (this.windowHeight <= 520) {
      this.heightVH = '120vh'
    }


    // 在页面onLoad回调事件中创建插屏广告实例
    // if (uni.createInterstitialAd) {
    //   interstitialAd = uni.createInterstitialAd({
    //     adUnitId: 'adunit-3fbbbc8a3e8752c4'
    //   })
    //   interstitialAd.onLoad(() => {})
    //   interstitialAd.onError((err) => {
    //     console.log(err);
    //   })
    //   interstitialAd.onClose(() => {})
    // }


    // #ifdef MP
    // 在页面onLoad回调事件中创建激励视频广告实例
    // if (uni.createRewardedVideoAd) {
    //   videoAd = uni.createRewardedVideoAd({
    //     adUnitId: 'adunit-18eceb8ba71421d7'
    //   })
    //   videoAd.onLoad(() => {
    //     that.rewardedVideoAdLoaded = true;
    //   })
    //   videoAd.onError((err) => {
    //     // 广告组件出现错误，直接允许用户保存，不做其他复杂处理
    //     that.rewardedVideoAdLoaded = false;
    //   })
    //   videoAd.onClose((res) => {
    //     if (res && res.isEnded || res === undefined) {
    //       // 正常播放结束，下发奖励
    //
    //     } else {
    //       // 播放中途退出，进行提示
    //       that.$toast('请完整观看哦')
    //     }
    //   })
    // }
    // #endif

  },
  onReady() {
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
    selected(item) {
      console.log('selected', item)
    },
    selected2(item) {
      console.log('selected2', item)
    },
    handleClick() {
      wx.showRedPackage({
        url: 'https://support.weixin.qq.com/cgi-bin/mmsupport-bin/showredpacket?receiveuri=abcJqTpylEG&check_type=2#wechat_redirect',
        fail(err){
          console.log('拉起红包错误',err);
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.box {
  position: relative;
  margin: 0 auto;
  margin-top: 30px;
  width: 80%;
}

.bottom-bar{
  background-color: #fff;
  position: fixed;
  bottom: 0;
  height: 45px;
  width: 100%;
  overflow: hidden;
  box-shadow: 0 0 10px #ccc;
  display: flex;
}
.bottom-button {
  width: 100%;
  font-size: 28rpx;
  text-align: center;
  line-height: 90rpx;
}
</style>
