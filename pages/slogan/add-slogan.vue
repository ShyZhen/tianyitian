<template>
  <view class="container" :style="{height:heightVH}" style="overflow: hidden">
    <view v-if="SHOW_TIP">
      <add-tips :statusBarHeight="statusBarHeight" />
    </view>

    <view id="avatar-section" @tap="nextHappiness">
      <canvas canvas-id="cans-id-happines" style="width:270px; height:270px;" class="isCan"></canvas>
    </view>

    <view class="tui-drop-input-box grid justify-center">
      <tui-dropdown-list :show="dropdownShow" :top="94" :height="400">
        <template v-slot:selectionbox>
          <tui-button size="small" type="white" shape="circle" @tap="dropDownList(-1)">选择口号
            <view class="tui-animation" :class="[dropdownShow?'tui-animation-show':'']">
              <tui-icon name="turningdown" :size="20"></tui-icon>
            </view>
          </tui-button>
        </template>
        <template v-slot:dropdownbox>
          <view class="tui-selected-list">
            <scroll-view scroll-y class="tui-dropdown-scroll">
              <block v-for="(item,index) in dropdownlistData" :key="index">
                <tui-list-cell @tap="dropDownList(index)" :last="dropdownlistData.length-1==index">
                  <tui-icon :name="item.icon" :size="item.size" :color="item.color"></tui-icon>
                  <text class="tui-ml-20" style="margin-left: 20px;">{{item.name}}</text>
                </tui-list-cell>
              </block>
            </scroll-view>
          </view>
        </template>
      </tui-dropdown-list>
    </view>

    <view class="grid justify-around action-wrapper">
      <view class="grid col-1">
        <button id="btn-my-avatar" class="cu-btn round action-btn bg-gradual-blue shadow" open-type="getUserInfo" @tap="getUserInfo">我的头像</button>
      </view>
      <view class="grid col-2">
        <button id="btn-save" class="cu-btn round action-btn bg-gradual-blue shadow" @tap="checkAdBeforeSave">
          <text class="cuIcon-down">
          </text>保存</button>
      </view>
      <view class="grid col-3">
        <button id="btn-choose-img" class="cu-btn round action-btn bg-gradual-blue shadow" @tap="chooseImage">选择图片</button>
      </view>
    </view>

<!--    <view class="grid justify-around share-wrapper">-->
<!--      <ad unit-id="adunit-c42c8c8ce8b6106d"></ad>-->
<!--    </view>-->

    <!--    <tui-footer copyright="赛尔教育咨询服务有限公司"></tui-footer>-->

  </view>
</template>
<script>
import {
  mapState,
  mapMutations
} from "vuex";
// import tuiFooter from "@/components/tui/footer";
import tuiIcon from "@/components/tui/icon"
import tuiButton from "@/components/tui/button"
import tuiListCell from "@/components/tui/list-cell"
import tuiDropdownList from "@/components/tui/dropdown-list"
import { getShareObj } from "@/utils/share.js"

// 在页面中定义激励视频广告
let videoAd = null;
// 在页面中定义插屏广告
let interstitialAd = null

export default {
  components: {
    // tuiFooter,
    tuiButton,
    tuiListCell,
    tuiDropdownList,
    tuiIcon,
  },
  data() {
    return {
      heightVH: '100vh',
      windowHeight: getApp().globalData.windowHeight,
      cansWidth: 270, // 宽度 px
      cansHeight: 270, // 高度 px
      cansBgColor: "#FFD314",
      cornerBgColor: '#C12928',
      cornerBgBoarderColor: '#FFFFFF',
      r: 40,
      boarderWidth: 15,
      wishText: '中国加油',
      dropdownlistData: [{
        name: "中国加油",
        color: "#000",
        icon: "attestation",
        size: 20
      },
        {
          name: "众志成城",
          color: "#000",
          icon: "attestation",
          size: 20
        },
        {
          name: "饮茶先啦",
          color: "#000",
          icon: "attestation",
          size: 20
        },
        {
          name: "我要减肥",
          color: "#000",
          icon: "attestation",
          size: 20
        },
        {
          name: "我想脱单",
          color: "#000",
          icon: "attestation",
          size: 20
        },
        {
          name: "拒绝暧昧",
          color: "#000",
          icon: "attestation",
          size: 20
        },
        {
          name: "只想搞钱",
          color: "#000",
          icon: "attestation",
          size: 20
        },
        {
          name: "我要富婆",
          color: "#000",
          icon: "attestation",
          size: 20
        },
        {
          name: "我要帅哥",
          color: "#000",
          icon: "attestation",
          size: 20
        },
        {
          name: "我是富婆",
          color: "#000",
          icon: "attestation",
          size: 20
        },
        {
          name: "我是帅哥",
          color: "#000",
          icon: "attestation",
          size: 20
        },
        {
          name: "叔叔不约",
          color: "#000",
          icon: "attestation",
          size: 20
        },
        {
          name: "奋斗2021",
          color: "#000",
          icon: "attestation",
          size: 20
        }
      ],
      dropdownShow: false,
      avatarPath: '/static/image/head/'+ Math.floor(Math.random()*19) + '.jpg',
      happinessPathList: [],
      happinessIndex: 0,
      modalName: null,
      //首先定义一下，全局变量
      lastTime: 0, //此变量用来记录上次摇动的时间
      x: 0,
      y: 0,
      z: 0,
      lastX: 0,
      lastY: 0,
      lastZ: 0, //此组变量分别记录对应 x、y、z 三轴的数值和上次的数值
      lastChangeTime: 0,
      showGentleMessage: false,

      // 默认1次保存，有广告加载时候判断次数，看完广告加5次
      savedCounts: 1,
      enableInterstitialAd: true,
      rewardedVideoAdLoaded: false,

      ownImageUsed: false,
      showQuestion: false,
      envId: 'happiness-production-yy81s',
      collectionName: 'ad_config',
      docId: 'add_happiness_rwzc',
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

    if (this.windowHeight <= 520) {
      this.heightVH = '120vh'
    }

    if (!!getApp().globalData.userAvatarFilePath) {
      this.avatarPath = getApp().globalData.userAvatarFilePath;
    }

    this.ctx = uni.createCanvasContext('cans-id-happines', this);
    this.paint();

    /*
    // 在页面onLoad回调事件中创建插屏广告实例
    if (uni.createInterstitialAd) {
      interstitialAd = uni.createInterstitialAd({
        adUnitId: 'adunit-ae132e93d50f453f'
      })
      interstitialAd.onLoad(() => {})
      interstitialAd.onError((err) => {})
      interstitialAd.onClose(() => {})
    }

    // 在页面onLoad回调事件中创建激励视频广告实例
    if (uni.createRewardedVideoAd) {
      videoAd = uni.createRewardedVideoAd({
        adUnitId: 'adunit-c9f0e42fec4aa9be'
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
    */
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
    } else {}
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
    dropDownList(index) {
      if (index !== -1) {
        this.wishText = this.dropdownlistData[index].name;
        this.paint();
      }
      this.dropdownShow = !this.dropdownShow
    },
    paint(avatarFilePath, happinessFilePath) {
      if (!avatarFilePath) {
        avatarFilePath = this.avatarPath;
      }
      if (!happinessFilePath) {
        happinessFilePath = this.happinessPath;
      }
      this.drawCansBgImg(avatarFilePath);
      this.drawTextBg();
      // this.drawHappiness(happinessFilePath);
      this.drawDefaultText();
      uni.vibrateShort();
    },
    drawCansBgImg(imageFilePath) {
      this.ctx.drawImage(imageFilePath, 0, 0, this.cansWidth, this.cansHeight);
      this.ctx.draw(false);
    },
    drawTextBg() {
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
        sLeft: 0.05,
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
      this.ctx.rect(0, 190, 270, 80);
      this.ctx.setFillStyle('#d81e06');
      this.ctx.fill();
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
        for (var i = 0; i < item.text.length; i++) {
          this.ctx.fillText(item.text[i], isLeft, item.sTop * this.cansHeight + item.lineHeight * i)
        }
      } else {
        this.ctx.fillText(item.text, isLeft, item.sTop * this.cansHeight)
      }
      this.ctx.draw(true)
      this.ctx.restore()
    },
    downloadAvatarAndPaintAll(imageUrl) {
      this.$loading('头像加载中...')
      let that = this
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
        desc: '用于完善个人资料',
        success: (res) => {
          if (res.userInfo) {
            this.ownImageUsed = true;
            let userInfo = res.userInfo;
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
          that.$imageCheck(tempImagePath, that.loadRecImageOrStartToCrop);
        },
        complete: (res) => {
          //this.$loading(false)
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
    changeHappiness(e) {
      this.happinessIndex = parseInt(e.currentTarget.dataset.target, 10);
      // this.happinessPath = this.happinessPathList[this.happinessIndex];
      this.paint();
    },
    nextHappiness() {
      this.happinessIndex = (this.happinessIndex + 1) % 5;
      // this.happinessPath = this.happinessPathList[this.happinessIndex];
      this.paint();
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
        // x: 0,
        // y: 0,
        // width: this.cansWidth * 1.5,
        // height: this.cansHeight * 1.5,
        // destWidth: this.cansWidth * 3,
        // destHeight: this.cansHeight * 3,
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
              console.log(res)
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
            }
          });
        },
        complete(res) {
          that.$loading(false)
        }
      }, this)
    },
    showModal: function(e) {
      console.log(e.currentTarget.dataset);
      this.modalName = e.currentTarget.dataset.target;
    },
    hideModal: function(e) {
      this.modalName = null;
    },
    toSharePage: function() {
      uni.switchTab({
        url: '/pages/share/share'
      });
      this.hideModal();
    },

    // 内容检查



    onClickFab(e) {
      let index = e.index

      switch (index) {
        case -1:
          break;
        case 0:
          uni.switchTab({
            url: "/pages/happiness/add-mask"
          })
          break;
        case 1:
          uni.switchTab({
            url: "/pages/about/about"
          })
          break;
          // case 2:
          // 	uni.previewImage({
          // 		urls: ["https://thorui.cn/img/reward.jpg"]
          // 	})
          // 	break;
        default:
          break;
      }
    }

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

.scrollView {
  width: 100%;
  position: absolute;
  bottom: 5px;
  white-space: nowrap;
}

.imgList {
  height: 35px;
  width: 65px;
  border: 2px solid white;
  border-radius: 5px;
  margin: 10px 10px 10px 10px;
  background-color: white;
}

.slogan-bg {
  background-color: red;
  border-radius: 25px;
  height: 25px;
  width: 55px;
  color: white;
  margin: auto;

}

.tui-dropdown-list {
  width: 140px !important;
}

.tui-drop-input-box {
  padding: 50upx 50upx 0upx 50upx;
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
