<template>
  <view class="container" style="overflow: hidden;" :style="{height:heightVH}">
<!--    <view v-if="SHOW_TIP">-->
<!--      <add-tips :statusBarHeight="statusBarHeight" />-->
<!--    </view>-->

    <view class="avatar-container grid justify-center" id="avatar-container">
      <view class="avatar-bg-border">
        <cover-image v-show="displayImage" class="bg avatar-bg" id="avatar-bg" :src="avatarPath"></cover-image>

        <!--  绘制区域  -->
        <view>
          <canvas class="cans-id-mask" canvas-id="cans-id-mask" style="height:270px;width:270px;margin-left: auto;margin-right: auto;" />
        </view>
      </view>
    </view>

    <view class="flex-sub text-center">
      <view class="solid-bottom">
        <text class="text-white text-bold">{{slogan}}</text>
      </view>
    </view>
    <view class="grid justify-around action-wrapper">
      <view class="grid col-1">
        <button id="btn-my-avatar" class="cu-btn round action-btn bg-gradual-blue shadow " @tap="getUserInfo">我的头像</button>
      </view>
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
<!--      <view class="check-date cu-btn round" style="background: #f14444" @tap="changeDate('pixel')">-->
<!--        像素风-->
<!--      </view>-->
<!--      <view class="check-date cu-btn round" style="background: #20e2e8" @tap="changeDate('cartoon')">-->
<!--        卡通风-->
<!--      </view>-->

      <view>
        <view class="tui-drop-input-box grid justify-center">
          <tui-dropdown-list :show="dropdownShow" :top="94" :height="400">
            <template v-slot:selectionbox>
              <tui-button size="small" type="white" shape="circle" @tap="dropDownList(-1)">像素风
                <view class="tui-animation" :class="[dropdownShow?'tui-animation-show':'']">
                  <tui-icon name="turningdown" :size="20"></tui-icon>
                </view>
              </tui-button>
            </template>
            <template v-slot:dropdownbox>
              <view class="tui-selected-list">
                <scroll-view scroll-y class="tui-dropdown-scroll">
                  <block v-for="(item,index) in dropdownListData" :key="index">
                    <tui-list-cell @tap="dropDownList(index)" :last="dropdownListData.length-1==index">
                      <tui-icon :name="item.icon" :size="item.size" :color="item.color"></tui-icon>
                      <text class="tui-ml-20" style="margin-left: 20px;">{{item.name}}</text>
                    </tui-list-cell>
                  </block>
                </scroll-view>
              </view>
            </template>
          </tui-dropdown-list>
        </view>
      </view>

      <view class="uni-common-mt">
        <text class="text-white text-bold">点击按钮即可自动合成</text>
      </view>
    </view>

  </view>
</template>
<script>
import {
  mapState,
  mapMutations
} from "vuex"
import tuiFooter from "@/components/tui/footer"
import addTips from "@/components/add-tips"
import { getShareObj } from "@/utils/share.js"
import tuiIcon from "@/components/tui/icon"
import tuiButton from "@/components/tui/button"
import tuiListCell from "@/components/tui/list-cell"
import tuiDropdownList from "@/components/tui/dropdown-list"

// 在页面中定义激励视频广告
let videoAd = null;
// 在页面中定义插屏广告
let interstitialAd = null

const STORAGE_KEY = 'PLUG-ADD-MYAPP-KEY';

export default {
  components: {
    tuiFooter,
    addTips,
    tuiButton,
    tuiListCell,
    tuiDropdownList,
    tuiIcon,
  },
  data() {
    return {
      slogan: '沙尘虽小，但每一粒，都会反光',
      SHOW_TIP: false,
      statusBarHeight: 0,
      heightVH: '110vh',
      windowHeight: getApp().globalData.windowHeight,
      isAndroid: getApp().globalData.IS_ANDROID,
      modalName: null,
      pixiSize: 5,   // 像素风格参数 5,6,9,10 必须整除
      cansWidth: 270, // 宽度 px
      cansHeight: 270, // 高度 px
      avatarPath: '/static/image/head/'+ Math.floor(Math.random()*19) + '.jpg',
      displayImage: true,  // 当像素化、卡通化的时候隐藏图，让canvas展示效果
      scale: 1,

      // 默认1次保存，有广告加载时候判断次数，看完广告加5次
      savedCounts: 1,
      enableInterstitialAd: true,
      rewardedVideoAdLoaded: false,

      dropdownShow: false,
      dropdownListData: [{
        name: "轻度",
        color: "#000",
        icon: "attestation",
        size: 20,
        pixiSize: 5
      },{
        name: "中度",
        color: "#000",
        icon: "attestation",
        size: 20,
        pixiSize: 6
      },{
        name: "重度",
        color: "#000",
        icon: "attestation",
        size: 20,
        pixiSize: 9
      }],
    }
  },
  computed: {
    ...mapState({
      userInfo: 'userInfo'
    }),
  },
  onLoad(option) {
    let that = this;

    if (this.windowHeight <= 520) {
      this.heightVH = '120vh'
    }

    if (!!getApp().globalData.userAvatarFilePath) {
      this.avatarPath = getApp().globalData.userAvatarFilePath;
    }

    /*
    // 在页面onLoad回调事件中创建插屏广告实例
    if (wx.createInterstitialAd) {
      interstitialAd = wx.createInterstitialAd({
        adUnitId: 'adunit-ae132e93d50f453f'
      })
      interstitialAd.onLoad(() => {})
      interstitialAd.onError((err) => {
        console.log(err);
      })
      interstitialAd.onClose(() => {})
    }

    // 在页面onLoad回调事件中创建激励视频广告实例
    if (wx.createRewardedVideoAd) {
      videoAd = wx.createRewardedVideoAd({
        adUnitId: 'adunit-236eff9d951106ed'
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
          that.savedCounts = 5
          that.saveCans()
        } else {
          // 播放中途退出，进行提示
          that.$toast('请完整观看哦')
        }
      })
    }
    */
  },
  onReady() {

    uni.vibrateShort();

    // 判断是否已经显示过
    let cache = uni.getStorageSync(STORAGE_KEY);
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
    // 在适合的场景显示插屏广告
    if (interstitialAd) {
      interstitialAd.show().catch((err) => {
        console.error(err)
      })
    }

    if (getApp().globalData.rapaintAfterCrop) {
      getApp().globalData.rapaintAfterCrop = false;
      this.avatarPath = getApp().globalData.cropImageFilePath;
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

    dropDownList(index) {
      if (index !== -1) {
        this.pixiSize = this.dropdownListData[index].pixiSize;
        this.changeDate('pixel');
      }
      this.dropdownShow = !this.dropdownShow
    },

    // 像素风格、卡通风格切换
    changeDate(item) {
      let that = this
      that.$loading('拼命加载中...')
      if (item === 'pixel') {
        that.slogan = '沙尘虽小，但每一粒，都会反光'

        let query = wx.createSelectorQuery()
        query.select('#avatar-bg').boundingClientRect()
        query.exec(function(res) {
          // 开始
          that.getCanvasContent('cans-id-mask').then(res => {
            that.createPxMap('cans-id-mask').then(pxMap => {})
          })
        })

      } else if (item === 'cartoon') {
        that.slogan = '满眼夜星，满手白泥，愿童心永存'

        uni.showModal({
          title: '敬请期待',
          content: '该功能正在开发中...',
          showCancel: false,
          confirmText: '好叻',
        })
        that.$loading(false)
      }
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
          that.displayImage = true
        }
      })
    },

    /**
     *  选择图片
     */
    chooseImage() {
      let that = this
      that.$loading('加载中...')
      uni.chooseImage({
        count: 1, // 默认9
        sizeType: ['compressed'],
        sourceType: ['album', 'camera'],
        success: function(res) {
          that.$loading(false)
          let tempImagePath = res.tempFilePaths[0];
          that.imageCheck(tempImagePath, that.loadRecImageOrStartToCrop);
        },
        complete: (res) => {
          this.$loading(false)
          that.displayImage = true
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
            that.avatarPath = tempImagePath;
          } else {
            uni.navigateTo({
              url: '/pages/crop/crop?tempFilePath=' + tempImagePath
            })
          }
        }
      });
    },
    // 内容检查
    imageCheck: function(tempImagePath, callback) {
      // 判断是否需要内容检查
      if (!getApp().globalData.enableSecurityCheck) {
        callback(tempImagePath);
        return;
      }
      let that = this;
      uni.compressImage({
        src: tempImagePath,
        quality: 1,
        success: res => {
          let tempFilePathCompressed = res.tempFilePath;
          wx.getFileSystemManager().readFile({
            filePath: tempFilePathCompressed, // 压缩图片，然后安全检测
            success: buffer => {
              that.$loading('拼命加载中...')

              //这里是 云函数调用方法
              wx.cloud.callFunction({
                name: 'contentCheck',
                data: {
                  value: buffer.data
                },
                success(json) {
                  console.log("checkContent result", json)
                  if (json.result.errCode == 87014) {
                    uni.showModal({
                      title: '请勿使用违法违规内容',
                      content: '图片含有违法违规内容',
                      showCancel: false,
                      confirmText: '朕知道了',
                    });
                    console.log("bad")
                  } else {
                    console.log("good")
                    //图片合规则进行进一步处理
                    callback(tempImagePath);
                  }
                },
                fail(e) {
                  console.log(e);
                  uni.showModal({
                    title: '请重试',
                    content: '对不起，服务器开了小差',
                    showCancel: false,
                    confirmText: '好的',
                  });
                },
                complete() {
                  that.$loading(false)
                }
              })
            }
          })

        }
      })
    },

    draw() {
      let that = this
      that.$loading('合成中...')

      // 有成功加载的激励视频，才展现提示框
      if (!!videoAd && that.rewardedVideoAdLoaded && that.savedCounts <= 0) {
        that.$loading(false)
        uni.showModal({
          title: '获取使用次数',
          content: '观看完视频可以自动保存哦',
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
        return
      }
    },
    // 保证画完canvas再获取imageData
    getCanvasContent(cansId) {
      let that = this
      return new Promise((rel, rej) => {
        const canvasContext = wx.createCanvasContext(cansId)
        canvasContext.clearRect(0, 0, that.cansWidth, that.cansHeight)
        canvasContext.drawImage(that.avatarPath, 0, 0, that.cansWidth, that.cansHeight)
        canvasContext.draw()
        rel(canvasContext)
      })
    },
    createPxMap(cansId) {
      let that = this
      let pxMap = [];
      return new Promise((rel, rej) => {
        for (let i = 0; i <= that.cansWidth; i += that.pixiSize) {
          for (let j = 0; j <= that.cansWidth; j += that.pixiSize) {
            uni.canvasGetImageData({
              canvasId: cansId,
              x: i,
              y: j,
              width: 1,
              height: 1,
              success(res) {
                let pixel = res.data
                let color = `rgba(${pixel[0]},${pixel[1]},${pixel[2]},${pixel[3]/255})`
                pxMap.push({ x: i / that.pixiSize, y: j / that.pixiSize, color })
                // 需要真机测试
                if (i == j && i == that.cansWidth) {
                  that.drawPXCanvas(pxMap)
                }
              }
            })
          }
        }
      })
    },
    drawPXCanvas(pxMap) {
      let that = this
      const canvasContext = uni.createCanvasContext('cans-id-mask')
      pxMap.forEach((px, i) => {
        const { color, x, y } = px
        canvasContext.fillStyle = color
        canvasContext.fillRect(x*that.pixiSize, y*that.pixiSize, that.pixiSize, that.pixiSize)
      });
      canvasContext.draw()
      that.$loading(false)
      that.displayImage = false
    },

    /**
     * 保存
     */
    saveCans() {
      let that = this

      that.$loading('保存中...')
      uni.canvasToTempFilePath({
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
