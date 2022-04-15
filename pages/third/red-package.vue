<template>
  <view class="container" style="overflow: hidden" :style="{ height: heightVH }">

    <view class="margin-tb-xl">
      <view class="title margin-tb-sm">点击图片领取，最后更新于 {{getDay()}}</view>
      <view>
        <carousel :img-list="itemsList" @selected="selected" url-key="url" />
      </view>
    </view>
    <view class="bottom-bar">
      <view class="bottom-button bg-gradual-blue shadow">
        <text @tap="handleClick">以上由tb店铺【恭喜发财工作室】提供</text>
      </view>
    </view>
  </view>
</template>
<script>
import addTips from '@/components/add-tips';
import { getShareObj } from '@/utils/share';
import carousel from '@/components/vear-carousel';
import {getRedPackage} from "@/apis/api";

// 在页面中定义激励视频广告
let videoAd = null;
// 在页面中定义插屏广告
let interstitialAd = null;

export default {
  components: {
    addTips,
    carousel
  },
  data() {
    return {
      SHOW_TIP: false,
      statusBarHeight: 0,
      heightVH: '100vh',
      // 职业（医生教师妈妈爸爸等）、节假日（春节除夕七夕圣诞等）
      itemsList: [],
      currIndex: 0
    };
  },
  onLoad(option) {
    let that = this;
    that.$loading()
    getRedPackage().then(res => {
      that.itemsList = res.data
      that.$loading(false)
    }).catch(err => {
      that.$loading(false)
    })

    if (this.windowHeight <= 520) {
      this.heightVH = '120vh';
    }

    // 在页面onLoad回调事件中创建插屏广告实例
    if (uni.createInterstitialAd) {
      interstitialAd = uni.createInterstitialAd({
        adUnitId: 'adunit-3fbbbc8a3e8752c4'
      })
      interstitialAd.onLoad(() => {})
      interstitialAd.onError((err) => {
        console.log(err);
      })
      interstitialAd.onClose(() => {})
    }

    // #ifdef MP
    // 在页面onLoad回调事件中创建激励视频广告实例
    if (uni.createRewardedVideoAd) {
      videoAd = uni.createRewardedVideoAd({
        adUnitId: 'adunit-18eceb8ba71421d7'
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
          that.getRedPackage(that.currIndex)
        } else {
          // 播放中途退出，进行提示
          that.$toast('请完整观看哦')
        }
      })
    }
    // #endif
  },
  onReady() {},
  onShow() {
    let that = this;

    // 在适合的场景显示插屏广告
    if (interstitialAd) {
      interstitialAd.show().catch((err) => {
        console.error(err);
      });
    }
  },
  onShareAppMessage(res) {
    return getShareObj();
  },
  onShareTimeline(res) {
    return getShareObj();
  },

  methods: {

    getDay() {
      let calendar = new Date()
      let year = calendar.getFullYear()
      let month = calendar.getMonth() + 1   // 1-12
      let date = calendar.getDate()         // 1-31
      return year+'-'+month+'-'+date
    },

    selected(index) {
      // 看完广告领取
      let that = this
      that.currIndex = index

      if (!!videoAd) {
        that.$loading(false)
        uni.showModal({
          title: '领取红包封面',
          content: '看完视频广告可领取，数量有限',
          success: function(res) {
            if (res.confirm) {
              console.log('用户点击确定');
              // 用户触发广告后，显示激励视频广告
              if (videoAd) {
                videoAd.show().catch(() => {
                  // 失败重试
                  videoAd.load()
                      .then(() => {
                        videoAd.show();
                      })
                      .catch(err => {
                        console.log(err);
                        console.log('激励视频 广告显示失败')
                      })
                })
              }
            } else if (res.cancel) {
              console.log('用户点击取消')
              that.$toast('视频很短的 (✪ω✪)')
              //that.saveCans()
              return
            }
          }
        });
      } else {
        that.$loading(false)
        that.getRedPackage(that.currIndex);
      }
    },

    getRedPackage(index) {
      let that = this
      wx.showRedPackage({
        url: that.itemsList[index].key,
        fail(err) {
          console.log('拉起红包错误,请重试', err);
        }
      });
    },

    handleClick() {
      let url = 'https://shop333222202.taobao.com/'
    }
  }
};
</script>

<style lang="scss" scoped>
.box {
  position: relative;
  margin: 0 auto;
  margin-top: 30px;
  width: 80%;
}
.title {
  @include sc(26, #fff);
  @include fcc();
}
.bottom-bar {
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
