<template>
  <view class="container" style="overflow: hidden;" :style="{height:heightVH}">
<!--    <view v-if="SHOW_TIP">-->
<!--      <add-tips :statusBarHeight="statusBarHeight" />-->
<!--    </view>-->

    <view class="avatar-container grid justify-center" id="avatar-container" @touchstart="touchStart" @touchend="touchEnd"
          @touchmove="touchMove">
      <view class="avatar-bg-border">
        <image @touchstart="touchAvatarBg" class="bg avatar-bg" id="avatar-bg" :src="avatarPath"></image>
      </view>

      <!--   口罩操作icon   -->
      <!--			 <icon type="cancel" class="cancel" id="cancel" :style="{top:cancelCenterY-10 + 'px', left:cancelCenterX-10 + 'px'}"></icon>-->
      <!--			 <icon type="waiting" class="handle" id="handle" color="green" :style="{top:handleCenterY-10 + 'px', left:handleCenterX-10 +'px'}"></icon>-->
      <!--			 <text class="cuIcon-order cancel circle" @tap="flipHorizontal" id="cancel" :style="{top:cancelCenterY-10 + 'px', left:cancelterX-10 +'px'}"></text>-->

      <!-- 口罩图片 -->
      <image v-if="currentMaskUrl !== ''" class="mask flip-horizontal" :class="{maskWithBorder: showBorder}" id='mask' :src="maskPic"
             :style="{top:maskCenterY-maskSize/2-2+'px', left:maskCenterX-maskSize/2-2+'px',
				transform: 'rotate(' +rotate+ 'deg)' + 'scale(' +scale+')' + 'rotateY('+ rotateY +'deg)'}"></image>

      <!--   口罩移动，放大缩小icon   -->
      <text class="cuIcon-full handle circle" :class="{hideHandle: !showBorder}" id="handle" :style="{top:handleCenterY-10 + 'px', left:handleCenterX-10 +'px'}"></text>
      <text class="cuIcon-order cancel circle" v-if="isAndroid" :class="{hideHandle: !showBorder}" id="cancel" @tap="flipHorizontal"
            :style="{top:cancelCenterY-10 + 'px', left:cancelCenterX-10 +'px', transform: 'rotate(' +90+ 'deg)'}"></text>
    </view>

    <!--  绘制区域  -->
    <view>
      <canvas class="cans-id-mask" canvas-id="cans-id-mask" style="height:270px;width:270px;margin-left: auto;margin-right: auto;" />
    </view>

    <view class="flex-sub text-center">
      <view class="solid-bottom">
        <!-- #ifdef APP-PLUS -->
        <text class="text-white text-bold">{{slogan}}</text>
        <!-- #endif -->
        <!-- #ifdef MP -->
		    <text class="text-white text-bold">每天可免费保存2次,剩余{{savedCounts}}次</text>
        <!-- #endif -->
      </view>
    </view>
    <view class="grid justify-around action-wrapper">
      <!-- #ifdef MP -->
      <view class="grid col-1">
        <button id="btn-my-avatar" class="cu-btn round action-btn bg-gradual-blue shadow" open-type="getUserInfo" @tap="getUserInfo">我的头像</button>
      </view>
      <!-- #endif -->
      <view class="grid col-2">
        <button id="btn-save" class="cu-btn round action-btn bg-gradual-blue shadow" @tap="draw">
          <text class="cuIcon-down">
          </text>保存</button>
      </view>
      <view class="grid col-3">
        <button id="btn-choose-img" class="cu-btn round action-btn bg-gradual-blue shadow" @tap="chooseImage">选择图片</button>
      </view>
    </view>
    <view class="grid justify-around share-wrapper">

      <!--			<view class="grid col-2 animation-shake animation-speed-2 animation-delay-3">-->
      <!--				<button class="cu-btn block line-orange lg share-btn" open-type="share">-->
      <!--					<text class="cuIcon-upload"></text> <text class="text-yellow">分享给好友</text> </button>-->
      <!--			</view>-->

<!--      <ad unit-id="adunit-f185ab11a9a8b6df" style="z-index: 9"></ad>-->
    </view>

    <view class="check-scroll">
      <view class="check-date cu-btn round" style="background: #f14444" @tap="changeDate('gexing')">
        发型
      </view>
      <view class="check-date cu-btn round" style="background: #20e2e8" @tap="changeDate('mask')">
        口罩
      </view>
    </view>


    <scroll-view class="scrollView mask-scroll-view" scroll-x="true">
      <view v-for="(item, index) in imgList" :key="index" style="display: inline-flex;">
        <text v-if="currentMaskUrl === item && isAndroid" class="cuIcon-order cancel circle" @tap="flipHorizontal" id="cancel"
              :style="{transform: 'rotate(' +90+ 'deg)'}"></text>
        <!--				<text v-if="currentMaskUrl" style="margin-left: 55px;" class="cuIcon-question cancel circle" @tap="showTips" id="cancel"></text>-->
        <image class="imgList" :src="cdnUrl + item" :data-mask-id="index" @tap="changeMask(item)"></image>
      </view>
    </scroll-view>

    <!--
      <view class="cu-modal" :class="modalName=='saveTip'?'show':''">
        <view class="cu-dialog">
          <view class="cu-bar bg-white justify-end">
            <view class="content">已保存至相册</view>
            <view class="action" @tap="hideModal">
              <text class="cuIcon-close text-red"></text>
            </view>
          </view>
          <view class="padding">
            祝大家健康快乐！有需求可以进行反馈。
          </view>
          <view class="cu-bar bg-white justify-end">
            <view class="action">
              <button class="cu-btn line-green text-green" @tap="hideModal">朕知道了</button>
            </view>
          </view>
        </view>
      </view>
    -->

  </view>
</template>
<script>
import {
  mapState,
  mapMutations
} from "vuex"
import addTips from "@/components/add-tips"
import { getShareObj } from "@/utils/share.js"
import Config from "@/config/config"
import ImgList from "@/config/imgList"
import {getSavedCounts, setSavedCounts} from '../../utils/auth'

// 在页面中定义激励视频广告
let videoAd = null;
// 在页面中定义插屏广告
let interstitialAd = null

const range = (start, end, step) => {
  return Array.from(Array.from(Array(Math.ceil((end - start) / step)).keys()), x => start + x * step);
}

export default {
  components: {
    addTips
  },
  data() {
    return {
      slogan: '换个发型好心情',
      SHOW_TIP: false,
      duration: 15,
      statusBarHeight: 0,
      heightVH: '100vh',
      windowHeight: getApp().globalData.windowHeight,
      isAndroid: getApp().globalData.IS_ANDROID,
      modalName: null,
      cansWidth: 270, // 宽度 px
      cansHeight: 270, // 高度 px
      avatarPath: '/static/image/head/'+ Math.floor(Math.random()*19) + '.jpg',
      imgList:[],
      currentMaskUrl: '',
      showBorder: false,
      maskCenterX: getApp().globalData.windowWidth / 2,
      maskCenterY: 250,
      cancelCenterX: getApp().globalData.windowWidth / 2 - 50 - 2,
      cancelCenterY: 200,
      handleCenterX: getApp().globalData.windowWidth / 2 + 50 - 2,
      handleCenterY: 300,

      maskSize: 100,
      scale: 1,
      rotate: 0,
      rotateY: 0, // 值180时，则水平翻转
      mask_center_x: getApp().globalData.windowWidth / 2,
      mask_center_y: 250,
      cancel_center_x: getApp().globalData.windowWidth / 2 - 50 - 2,
      cancel_center_y: 200,
      handle_center_x: getApp().globalData.windowWidth / 2 + 50 - 2,
      handle_center_y: 300,
      scaleCurrent: 1,
      rotateCurrent: 0,
      touch_target: "",
      start_x: 0,
      start_y: 0,
      cdnUrl: '',

      // 默认1次保存，有广告加载时候判断次数，看完广告加3次
      savedCounts: 0,
      addCounts: 0,
      enableInterstitialAd: true,
      rewardedVideoAdLoaded: false,
    }
  },
  computed: {
    ...mapState({
      userInfo: 'userInfo'
    }),
    maskPic: function() {
      return Config.imageCdn + this.currentMaskUrl
    }
  },
  onLoad(option) {
    let that = this;

    // 初始化网络素材
    this.cdnUrl = Config.imageCdn
    this.imgList = ImgList.gexing

    if (this.windowHeight <= 520) {
      this.heightVH = '110vh'
    }

    if (!!getApp().globalData.userAvatarFilePath) {
      this.avatarPath = getApp().globalData.userAvatarFilePath;
    }


    // 在页面onLoad回调事件中创建插屏广告实例
    // if (uni.createInterstitialAd) {
    //   interstitialAd = uni.createInterstitialAd({
    //     adUnitId: 'adunit-51c892872d1f6c1f'
    //   })
    //   interstitialAd.onLoad(() => {})
    //   interstitialAd.onError((err) => {
    //     console.log(err);
    //   })
    //   interstitialAd.onClose(() => {})
    // }



    // #ifdef MP
    // 在页面onLoad回调事件中创建激励视频广告实例
    if (uni.createRewardedVideoAd) {
      videoAd = uni.createRewardedVideoAd({
        adUnitId: 'adunit-31a67b923e77e6f5'
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

    uni.vibrateShort();

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
      }, that.duration * 1000);
    }
  },
  onShow() {
    let that = this
    // 初始化默认次数和加的次数
    that.addCounts = Config.addCounts
    that.savedCounts = getSavedCounts()

    // 在适合的场景显示插屏广告
    if (interstitialAd) {
      interstitialAd.show().catch((err) => {
        console.error(err)
      })
    }

    if (getApp().globalData.rapaintAfterCrop) {
      getApp().globalData.rapaintAfterCrop = false;
      this.avatarPath = getApp().globalData.cropImageFilePath;
      this.paint();
    }
  },
  onShareAppMessage(res) {
    return getShareObj()
  },
  onShareTimeline(res) {
    return getShareObj()
  },
  methods: {
    ...mapMutations(["saveLoginUserInfo"]),
    changeDate(item) {
      this.$loading('拼命加载中...')
      if (item === 'gexing') {
        this.slogan = '换个发型好心情'
        this.imgList = ImgList.gexing
      } else if (item === 'mask') {
        this.slogan = '带上口罩，防止疫情蔓延'
        this.imgList = ImgList.mask
      }

      setTimeout(() => {
        this.$loading(false)
      }, 1000)
    },
    paint() {},
    showTips() {
      this.modalName = 'tips'
    },
    touchAvatarBg() {
      this.showBorder = false
    },
    touchStart(e) {
      if (e.target.id == "mask") {
        this.touch_target = "mask"
        this.showBorder = true
      } else if (e.target.id == "handle") {
        this.touch_target = "handle"
      } else {
        this.touch_target = ""
      }

      if (this.touch_target != "") {
        this.start_x = e.touches[0].clientX
        this.start_y = e.touches[0].clientY
      }
    },
    touchEnd(e) {
      this.mask_center_x = this.maskCenterX;
      this.mask_center_y = this.maskCenterY;
      this.cancel_center_x = this.cancelCenterX;
      this.cancel_center_y = this.cancelCenterY;
      this.handle_center_x = this.handleCenterX;
      this.handle_center_y = this.handleCenterY;
      this.touch_target = "";
      this.scaleCurrent = this.scale;
      this.rotateCurrent = this.rotate;
    },
    touchMove(e) {
      var current_x = e.touches[0].clientX;
      var current_y = e.touches[0].clientY;
      var moved_x = current_x - this.start_x;
      var moved_y = current_y - this.start_y;
      if (this.touch_target == "mask") {
        this.maskCenterX = this.maskCenterX + moved_x;
        this.maskCenterY = this.maskCenterY + moved_y;
        this.cancelCenterX = this.cancelCenterX + moved_x;
        this.cancelCenterY = this.cancelCenterY + moved_y;
        this.handleCenterX = this.handleCenterX + moved_x;
        this.handleCenterY = this.handleCenterY + moved_y;
      };
      if (this.touch_target == "handle") {
        this.handleCenterX = this.handleCenterX + moved_x;
        this.handleCenterY = this.handleCenterY + moved_y;
        this.cancelCenterX = 2 * this.maskCenterX - this.handleCenterX;
        this.cancelCenterY = 2 * this.maskCenterY - this.handleCenterY;
        let diff_x_before = this.handle_center_x - this.mask_center_x;
        let diff_y_before = this.handle_center_y - this.mask_center_y;
        let diff_x_after = this.handleCenterX - this.mask_center_x;
        let diff_y_after = this.handleCenterY - this.mask_center_y;
        let distance_before = Math.sqrt(diff_x_before * diff_x_before + diff_y_before * diff_y_before);
        let distance_after = Math.sqrt(diff_x_after * diff_x_after + diff_y_after * diff_y_after);
        let angle_before = Math.atan2(diff_y_before, diff_x_before) / Math.PI * 180;
        let angle_after = Math.atan2(diff_y_after, diff_x_after) / Math.PI * 180;

        this.scale = distance_after / distance_before * this.scaleCurrent;
        this.rotate = angle_after - angle_before + this.rotateCurrent;
      }
      this.start_x = current_x;
      this.start_y = current_y;
    },
    downloadAvatarAndPaintAll(imageUrl) {
      this.$loading('头像加载中...')
      let that = this;
      uni.downloadFile({
        url: imageUrl,
        success: function(res) {
          that.$loading(false)
          that.avatarPath = res.tempFilePath;
          getApp().globalData.userAvatarFilePath = res.tempFilePath;
          that.paint();
        },
        fail: function(e) {
          console.log(e);
          that.$loading(false)
          uni.showModal({
            title: '图片加载超时',
            content: '检查网络，点击确定重新加载',
            success(res) {
              if (res.confirm) {
                that.downloadAvatarAndPaintAll(imageUrl);
              } else if (res.cancel) {
                console.log('用户点击取消');
              }
            }
          })
        }
      })
    },
    /**
     *  获取用户信息回调方法
     * @param {Object} result
     */
    getUserInfo() {
      let that = this
      this.$loading('头像加载中...')
      uni.getUserProfile({
        desc: '用于完善个人资料',
        success: (res) => {
          if (res.userInfo) {
            let userInfo = res.userInfo
            userInfo.avatarUrl = userInfo.avatarUrl.replace("132", "0") // 使用最大分辨率头像 959 * 959
            getApp().globalData.userAvatarUrl = userInfo.avatarUrl
            that.downloadAvatarAndPaintAll(userInfo.avatarUrl)
            that.saveLoginUserInfo(userInfo)
          } else {
            uni.showModal({
              title: '获取用户头像失败',
              content: '用户信息仅用于创建新的图片，请放心使用',
              showCancel: false
            });
          }
        },
        complete: (res) => {
          this.$loading(false)
        }
      })
    },

    /**
     *  选择图片
     */
    chooseImage() {
      let that = this;
      that.$loading('加载中...')
      uni.chooseImage({
        count: 1, // 默认9
        sizeType: ['compressed'],
        sourceType: ['album', 'camera'],
        success: function(res) {
          that.$loading(false)
          let tempImagePath = res.tempFilePaths[0];
          that.$imageCheck(tempImagePath, that.loadRecImageOrStartToCrop);
        },
        fail: (res) => {
          that.$loading(false)
        },
        complete: (res) => {
          //this.$loading(false)
        }
      });
    },
    loadRecImageOrStartToCrop(tempImagePath) {
      this.ownImageUsed = true;
      let that = this;
      uni.getImageInfo({
        src: tempImagePath,
        success: function(image) {
          let width = image.width;
          let height = image.height;
          let delta = (width - height) / width.toFixed(3);
          console.log('delta', delta);
          // 如果是正方形或者接近正放心则直接加载不进行剪裁
          if ((-0.02 <= delta && delta <= 0) || (0 < delta && delta <= 0.02)) {
            let tempFilePathCompressed = tempImagePath;
            that.avatarPath = tempImagePath;
            that.paint();
          } else {
            uni.navigateTo({
              url: '/pages/crop/crop?tempFilePath=' + tempImagePath
            })
          }
        }
      });
    },

    // 内容检查


    changeMask(url) {
      this.currentMaskUrl = url
      this.showBorder = true
    },
    draw() {
      if (this.currentMaskUrl === '') {
        this.$toast('您还没选择您的口罩哦')
        return
      }
      let scale = this.scale;
      let rotate = this.rotate;
      let mask_center_x = this.mask_center_x;
      let mask_center_y = this.mask_center_y;
      let that = this;

      that.$loading('合成中...')
      uni.getImageInfo({
        src: that.maskPic,
        success: function (image) {
          // 创建节点选择器
          // 口罩中心位置的计算是从屏幕左上角开始，所以我们需要获取头像图片的位置，来得到口罩相对头像的位置
          var query = uni.createSelectorQuery()
          query.select('#avatar-bg').boundingClientRect()
          query.exec(function(res) {
            //res就是 所有标签为#的元素的信息的数组
            mask_center_x = mask_center_x - res[0].left
            mask_center_y = mask_center_y - res[0].top
            const pc = uni.createCanvasContext('cans-id-mask')
            const mask_size = 100 * scale

            pc.clearRect(0, 0, that.cansWidth, that.cansHeight)
            pc.drawImage(that.avatarPath, 0, 0, that.cansWidth, that.cansHeight)
            pc.translate(mask_center_x, mask_center_y)
            pc.rotate(rotate * Math.PI / 180)
            if (that.isAndroid) {
              that.rotateY == 180 && pc.scale(-1, 1)
            }

            pc.drawImage(image.path, -mask_size / 2, -mask_size / 2, mask_size, mask_size)
            pc.draw()

            // 有成功加载的激励视频，才展现提示框
            if (!!videoAd && that.rewardedVideoAdLoaded && that.savedCounts <= 0) {
              that.$loading(false)
              uni.showModal({
                title: '免费额度已用光ㄒoㄒ',
                content: '看完视频广告可获'+that.addCounts+'次保存次数',
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
                    // that.saveCans()
                    return
                  }
                }
              });
            } else {
              that.$loading(false)
              that.saveCans()
            }
          })
        },
        complete() {
          that.$loading(false)
        }
      })
    },
    flipHorizontal() {
      this.rotateY = this.rotateY == 0 ? 180 : 0;
    },
    /**
     * 保存
     */
    saveCans() {
      let that = this

      that.$loading('保存中...')
      uni.canvasToTempFilePath({
        // x: 0,
        // y: 0,
        // height: this.cansWidth,
        // width: this.cansHeight,
        // destWidth: this.cansWidth * 3,
        // destHeight: this.cansHeight * 3,
        canvasId: 'cans-id-mask',
        success: function(res) {
          getApp().globalData.maskAvatarSavedTempPath = res.tempFilePath;
          uni.saveImageToPhotosAlbum({
            filePath: res.tempFilePath,
            success: function(res) {
              uni.showToast({
                title: '请至相册查看'
              })
              that.savedCounts--
              setSavedCounts(that.savedCounts)
              console.log('剩余次数：',that.savedCounts)
              uni.vibrateShort()
            },
            fail(res) {
              if (res.errMsg.indexOf("fail")) {
                uni.showModal({
                  title: '您需要授权相册权限',
                  success(res) {
                    if (res.confirm) {
                      uni.openSetting({
                        success(res) {
                          console.log("相册授权成功");
                        },
                        fail(res) {
                          console.log(res)
                        }
                      })
                    }
                  }
                })
              }
            },
          });
        },
        complete(res) {
          that.$loading(false)
        }
      }, this)
    },
    showModal: function(e) {
      this.modalName = e.currentTarget.dataset.target;
    },
    hideModal: function(e) {
      this.modalName = null;
    },
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
  z-index: 0;
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

.imgList {
  height: 65px;
  width: 65px;
  border: 2px solid white;
  border-radius: 5px;
  margin: 10px 10px 10px 10px;
}

// cavans 真机上无法隐藏
.cans-id-mask {
  position: absolute;
  left: 1000px;
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
  bottom: 100px;
  text-align: center;
  .check-date {
    width: 30%;
    margin: 0 5px 0 5px;
    display: inline-flex;
    color: white;
  }
}
</style>
