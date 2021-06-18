<template>
  <view class="container" :style="{height:windowHeight+'px'}" style="overflow-x: hidden">
    <view id="avatar-section">
      <canvas canvas-id="cans-id-happines" style="width:270px; height:270px;" class="isCan"></canvas>
    </view>

    <view class="grid justify-around action-wrapper">
      <view class="grid col-1">
        <button id="btn-my-avatar" class="cu-btn round action-btn bg-gradual-blue shadow " @tap="getUserInfo">我的头像</button>
      </view>
      <view class="grid col-2">
        <button id="btn-save" class="cu-btn round action-btn bg-gradual-blue shadow" @click="checkAdBeforeSave">
          <text class="cuIcon-down">
          </text>保存</button>
      </view>
      <view class="grid col-3">
        <button id="btn-choose-img" class="cu-btn round action-btn bg-gradual-blue shadow" @click="chooseImage">选择图片</button>
      </view>
    </view>

    <view>
      <view class="uni-form-item uni-column">
        <view class="title uni-inline-item" style="margin: 10px;text-align: center">
          <input class="uni-inline-item"
                 style="margin:10px;text-align:center;color:#fff;width:100%;"
                 confirm-type="done"
                 @blur="onKeyInput" @confirm="onKeyInput" :maxlength="isAndroid ? 1 : 7"
                 placeholder-style="margin-left:10px;text-align:center;color:#fff;"
                 placeholder="点此输入一个字如富,美,萌,忙,帅,萌,穷"
          />
        </view>
      </view>
    </view>

    <view class="grid justify-around share-wrapper">
      <ad unit-id="adunit-5df4999be4aa8961"></ad>
    </view>

    <view>
      <view class="grid col-5 padding-sm">
        <view class="margin-tb-sm text-center" v-for="(item,index) in ColorList" :key="index">
          <button @click="changeColor" :data-color="item.color" class="cu-btn round" :class="['bg-' + item.name , shadow?'shadow':'']">{{item.title}}</button>
        </view>
      </view>
    </view>

  </view>
</template>
<script>
import {
  mapState,
  mapMutations
} from "vuex";
import tuiFooter from "@/components/tui/footer"
import tuiFab from "@/components/tui/tui-fab"
import addTips from "@/components/add-tips"
import { getShareObj } from "@/utils/share.js"

// 在页面中定义激励视频广告
let videoAd = null;
// 在页面中定义插屏广告
let interstitialAd = null

export default {
  components: {
    tuiFooter,
    tuiFab,
    addTips
  },
  data() {
    return {
      isAndroid: getApp().globalData.IS_ANDROID,
      ColorList: this.ColorList,
      windowHeight: 0,
      cansWidth: 270, // 宽度 px
      cansHeight: 270, // 高度 px
      cansBgColor: "#FFD314",
      cornerBgColor: '#C12928',
      cornerBgBoarderColor: '#FFFFFF',
      r: 40,
      boarderWidth: 15,
      wishText: '萌',
      avatarPath: '/static/image/head/'+ Math.floor(Math.random()*12) + '.jpg',
      happinessPathList: [],
      happinessIndex: 0,
      x: 0,
      y: 0,
      z: 0,

      // 默认1次保存，有广告加载时候判断次数，看完广告加5次
      savedCounts: 1,
      enableInterstitialAd: true,
      rewardedVideoAdLoaded: false,
      interstitialAdAlreadyShow: false,

      ownImageUsed: false,
      statusBarHeight: 0,
      SHOW_TIP: false,
      duration: 20,
    }
  },
  computed: {
    ...mapState({
      userInfo: 'userInfo'
    }),
    happinessPath: function() {
      return this.happinessPathList[this.happinessIndex];
    },
    cornerX: function() {
      return Math.ceil(this.cansWidth * 0.7);
    },
    cornerY: function() {
      return Math.ceil(this.cansHeight * 0.7);
    }
  },
  onLoad(option) {
    let that = this;
    this.windowHeight = getApp().globalData.windowHeight;
    if (this.windowHeight < 705) {
      this.windowHeight += 166
    }

    if (!!getApp().globalData.userAvatarFilePath) {
      this.avatarPath = getApp().globalData.userAvatarFilePath;
    }

    this.ctx = uni.createCanvasContext('cans-id-happines', this);
    this.paint();


    // 在页面onLoad回调事件中创建插屏广告实例
    if (wx.createInterstitialAd) {
      interstitialAd = wx.createInterstitialAd({
        adUnitId: 'adunit-ae132e93d50f453f'
      })
      interstitialAd.onLoad(() => {})
      interstitialAd.onError((err) => {})
      interstitialAd.onClose(() => {})
    }

    // 在页面onLoad回调事件中创建激励视频广告实例
    if (wx.createRewardedVideoAd) {
      videoAd = wx.createRewardedVideoAd({
        adUnitId: 'adunit-8296f48990df1b7f'
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
          // that.checkAdBeforeSave();
        }
      })
    }
  },
  onReady() {
    // 判断是否已经显示过
    let cache = uni.getStorageSync(getApp().globalData.STORAGE_KEY);
    if (!cache) {
      this.statusBarHeight = getApp().globalData.statusBarHeight;
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
    // let defaultAvatarIndex = Math.round(Math.random());
    // console.log(defaultAvatarIndex);
    if (getApp().globalData.rapaintAfterCrop) {
      getApp().globalData.rapaintAfterCrop = false;
      this.avatarPath = getApp().globalData.cropImageFilePath;;
      this.paint();
    } else {
      //从剪裁页面跳转回来时不用展示，其他情况下，页面打开时展示插屏广告
      if (interstitialAd && this.enableInterstitialAd && !this.interstitialAdAlreadyShow) {
        interstitialAd.show()
            .then(() => {
              this.interstitialAdAlreadyShow = true;
            })
            .catch((err) => {
              console.error(err)
            })
      }
    }
  },
  onHide() {},
  onShareAppMessage(res) {
    return getShareObj()
  },
  onShareTimeline(res) {
    return getShareObj()
  },
  methods: {
    ...mapMutations(["saveLoginUserInfo"]),
    changeColor(e) {
      console.log(e);
      this.cornerBgColor = e.currentTarget.dataset.color;
      this.paint();
    },
    onKeyInput: function(event) {
      // 解决ios下的bug：https://developers.weixin.qq.com/community/develop/doc/000c862f33c7b85a565ae91b556400?_at=1589312743359
      this.wishText = event.target.value.substr(0, 1)
      this.paint()
    },
    paint(avatarFilePath, happinessFilePath) {
      if (!avatarFilePath) {
        avatarFilePath = this.avatarPath;
      }
      if (!happinessFilePath) {
        happinessFilePath = this.happinessPath;
      }
      this.drawCansBgImg(avatarFilePath);
      this.drawCornerBg();
      // this.drawHappiness(happinessFilePath);
      this.drawDefaultText();
      uni.vibrateShort();
    },
    drawCansBgImg(imageFilePath) {
      this.ctx.drawImage(imageFilePath, 0, 0, this.cansWidth, this.cansHeight);
      this.ctx.draw(false);
    },
    drawCornerBg() {
      this._drawCircleWithBoarder(this.cornerBgBoarderColor, this.cornerBgColor, this.cornerX, this.cornerY, this.r, this
          .boarderWidth);
    },
    drawHappiness(happinessFilePath) {
      this.ctx.drawImage(happinessFilePath, this.cornerX + 5, this.cornerY + 7, this.cansWidth * 0.25, this.cansHeight *
          0.25);
      this.ctx.draw(true);
    },
    /**
     * legacy
     */
    drawDefaultText() {
      let textOption = {
        text: this.wishText,
        sLeft: 0.73,
        sTop: 0.93,
        fontSize: 60,
        color: 'white',
        bold: true,
        lineHeight: 12
      };
      this._drawText(textOption);
      uni.vibrateShort();
    },
    /**
     *  绘制圆形边框
     * @param {Object} sColor  线条色
     * @param {Object} fColor
     * @param {Object} cornerX  相对比例坐标
     * @param {Object} cornerY
     * @param {Object} r
     */
    _drawCircleWithBoarder(sColor, fColor, cornerX, cornerY, r, boarderWidth) {
      this.ctx.save();
      var cx = cornerX + r;
      var cy = cornerY + r;
      // 圆的中心的 cx, cy 坐标, 圆的半径, 起始角, 结束角。
      this.ctx.arc(cx, cy, r, 0, 2 * Math.PI); // 创建弧/曲线（用于创建圆或部分圆）
      this.ctx.setLineWidth(boarderWidth);
      this.ctx.setStrokeStyle(sColor);
      this.ctx.stroke();
      this.ctx.setFillStyle(fColor);
      this.ctx.fill();
      this.ctx.restore();
      this.ctx.draw(true);
    },
    _drawText(item) {
      var isLeft
      if (item.sLeft == 'center') {
        isLeft = this.cansWidth * .5 - (item.fontSize * item.text.length) / 2
      } else {
        isLeft = item.sLeft * this.cansWidth
      }
      this.ctx.save()
      if (item.bold) this.ctx.font = `normal bold ${item.fontSize}px edu-lishu`;
      // if (item.bold) this.ctx.font = `normal bold ${item.fontSize}px ` + item.fontFamily;
      // fontFamily
      this.ctx.setFillStyle(item.color)
      this.ctx.setFontSize(item.fontSize)
      // this.ctx.setFontFamily(item.fontFamily);
      if (item.text instanceof Array) {
        if (!item.lineHeight) item.lineHeight = item.fontSize + 2
        console.log('我是数组', item.text)
        for (var i = 0; i < item.text.length; i++) {
          this.ctx.fillText(item.text[i], isLeft, item.sTop * this.cansHeight + item.lineHeight * i)
        }
      } else {
        console.log('绘制字符', item.text)
        this.ctx.fillText(item.text, isLeft, item.sTop * this.cansHeight)
      }
      this.ctx.draw(true)
      this.ctx.restore()
    },
    downloadAvatarAndPaintAll(imageUrl) {
      let that = this
      this.$loading('头像加载中...')

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
     */
    getUserInfo(e) {
      let that = this
      this.$loading('头像加载中...')
      uni.getUserProfile({
        desc: '用于完善个人资料', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
        success: (res) => {
          if (res.userInfo) {
            this.ownImageUsed = true
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
            })
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
      let that = this
      that.$loading('加载中...')
      uni.chooseImage({
        count: 1, // 默认9
        sizeType: ['compressed'], //可以指定是原图还是压缩图，默认二者都有
        sourceType: ['album', 'camera'],
        success: function(res) {
          that.$loading(false)
          let tempImagePath = res.tempFilePaths[0];
          that.imageCheck(tempImagePath, that.loadRecImageOrStartToCrop);
          // that.loadRecImageOrStartToCrop(tempImagePath);
        },
        complete: (res) => {
          this.$loading(false)
        }
      })
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
    checkAdBeforeSave() {
      let that = this
      that.$loading('合成中...')

      if (!!videoAd && this.rewardedVideoAdLoaded && this.savedCounts <= 0) {
        that.$loading(false)
        uni.showModal({
          title: '获取使用次数',
          content: '请完整观看趣味广告视频',
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
        this.saveCans()
      }
    },
    /**
     * 保存
     */
    saveCans() {
      let that = this
      that.$loading('保存中...')
      uni.canvasToTempFilePath({
        x: 0,
        y: 0,
        width: this.cansWidth * 1.5,
        height: this.cansHeight * 1.5,
        destWidth: this.cansWidth * 3,
        destHeight: this.cansHeight * 3,
        canvasId: 'cans-id-happines',
        success: function(res) {
          getApp().globalData.maskAvatarSavedTempPath = res.tempFilePath
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
    imageCheck: function(tempImagePath, callback) {
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
          // console.log(res.tempFilePath)
          wx.getFileSystemManager().readFile({
            filePath: tempFilePathCompressed, // 压缩图片，然后安全检测
            success: buffer => {
              console.log(buffer.data);
              uni.showLoading({
                title: '加载中...'
              });
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
                  uni.hideLoading();
                }
              })
            }
          })
        }
      })
    },
  },
}
</script>

<style lang="scss" scoped>
.isCan {
  border: 6px solid white;
  border-radius: 10px;
  width: 270px;
  height: 270px;
  margin-top: 150rpx;
  margin-left: auto;
  margin-right: auto;
  background-size: 100%;
  z-index: 800;
}

@media (min-width: 320px) {
  /* 仅在 320px 或更宽的屏幕上生效的样式规则 */
  .action-wrapper {
    padding-top: 50rpx;
    padding-left: 100rpx;
    padding-right: 100rpx;
    font-weight: 800;
  }

  // .action-btn {
  // 	background-color: #FFC700;
  // 	color: white;
  // }
}

.action-wrapper {
  padding-top: 50rpx;
  padding-left: 100rpx;
  padding-right: 100rpx;
  font-weight: 800;
}

// .action-btn {
// 	background-color: #FFC700;
// 	color: white;
// }

.share-wrapper {
  padding-top: 10rpx;
  padding-left: 100rpx;
  padding-right: 100rpx;
  font-weight: 800;
}

.happiness-option-wrapper {
  position: absolute;
  z-index: 1000;
  width: 200rpx;
  margin-top: 25px;
}

.happiness-option {
  width: 60px;
  height: 60px;
}
</style>
