<template>
  <view class="container" :style="{height:windowHeight+'px'}">
    <view v-if="SHOW_TIP">
      <add-tips :statusBarHeight="statusBarHeight" />
    </view>

    <view class="avatar-container grid justify-center" id="avatar-container" @touchstart="touchStart" @touchend="touchEnd"
          @touchmove="touchMove">
      <view class="avatar-bg-border">
        <image @touchstart="touchAvatarBg" class="bg avatar-bg" id="avatar-bg" :src="avatarPath"></image>
      </view>

      <!--   口罩操作icon   -->
      <!--			 <icon type="cancel" class="cancel" id="cancel" :style="{top:cancelCenterY-10 + 'px', left:cancelCenterX-10 + 'px'}"></icon>-->
      <!--			 <icon type="waiting" class="handle" id="handle" color="green" :style="{top:handleCenterY-10 + 'px', left:handleCenterX-10 +'px'}"></icon>-->
      <!--			 <text class="cuIcon-order cancel circle" @click="flipHorizontal" id="cancel" :style="{top:cancelCenterY-10 + 'px', left:cancelterX-10 +'px'}"></text>-->

      <!-- 口罩图片 -->
      <image v-if="currentMaskUrl !== ''" class="mask flip-horizontal" :class="{maskWithBorder: showBorder}" id='mask' :src="maskPic"
             :style="{top:maskCenterY-maskSize/2-2+'px', left:maskCenterX-maskSize/2-2+'px',
				transform: 'rotate(' +rotate+ 'deg)' + 'scale(' +scale+')' + 'rotateY('+ rotateY +'deg)'}"></image>

      <!--   口罩移动，放大缩小icon   -->
      <text class="cuIcon-full handle circle" :class="{hideHandle: !showBorder}" id="handle" :style="{top:handleCenterY-10 + 'px', left:handleCenterX-10 +'px'}"></text>
      <text class="cuIcon-order cancel circle" v-if="isAndroid" :class="{hideHandle: !showBorder}" id="cancel" @click="flipHorizontal"
            :style="{top:cancelCenterY-10 + 'px', left:cancelCenterX-10 +'px', transform: 'rotate(' +90+ 'deg)'}"></text>
    </view>

    <!--  绘制区域  -->
    <view>
      <canvas class="cans-id-mask" canvas-id="cans-id-mask" style="height:270px;width:270px;margin-left: auto;margin-right: auto;" />
    </view>

    <view class="flex-sub text-center">
      <view class="solid-bottom">
        <text class="text-white text-bold">{{ dateSlogan }}</text>
      </view>
      <view class="solid-bottom">
        <text class="text-white">
          {{ dateTitle }}头像制作截止至：
          <text class="margin-lr-xs">{{dateTtlStr.slice(0, 4)}}-{{dateTtlStr.slice(4, 6)}}-{{dateTtlStr.slice(6, 8)}}</text>
        </text>
      </view>
    </view>
    <view class="grid justify-around action-wrapper">
      <view class="grid col-1">
        <button id="btn-my-avatar" class="cu-btn round action-btn bg-gradual-blue shadow " @tap="getUserInfo">我的头像</button>
      </view>
      <view class="grid col-2">
        <button id="btn-save" class="cu-btn round action-btn bg-gradual-blue shadow" @click="draw">
          <text class="cuIcon-down">
          </text>保存</button>
      </view>
      <view class="grid col-3">
        <button id="btn-choose-img" class="cu-btn round action-btn bg-gradual-blue shadow" @click="chooseImage">选择图片</button>
      </view>
    </view>
    <view class="grid justify-around share-wrapper">

      <!--			<view class="grid col-2 animation-shake animation-speed-2 animation-delay-3">-->
      <!--				<button class="cu-btn block line-orange lg share-btn" open-type="share">-->
      <!--					<text class="cuIcon-upload"></text> <text class="text-yellow">分享给好友</text> </button>-->
      <!--			</view>-->

      <!--			<ad unit-id="adunit-85230d6cd9a1beee"></ad>-->

    </view>

    <scroll-view class="scrollView mask-scroll-view" scroll-x="true">
      <view v-for="(item, index) in dataImgListCur" :key="index" style="display: inline-flex;">
        <text v-if="currentMaskUrl === item && isAndroid" class="cuIcon-order cancel circle" @click="flipHorizontal" id="cancel"
              :style="{transform: 'rotate(' +90+ 'deg)'}"></text>
        <!--				<text v-if="currentMaskId == index" style="margin-left: 55px;" class="cuIcon-question cancel circle" @click="showTips" id="cancel"></text>-->
        <image class="imgList" :src="cdnUrl + item" :data-mask-id="index" @tap="changeMask(item)"></image>
      </view>
    </scroll-view>

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

  </view>
</template>
<script>
  import {mapMutations, mapState} from "vuex"
  import tuiFooter from "@/components/tui/footer"
  import addTips from "@/components/add-tips"
  import { getShareObj } from "@/utils/share"
  import Calendar from "../../utils/calendar"
  import Config from "@/config/config"
  import ImgList from "@/config/imgList"

  // 在页面中定义激励视频广告
let videoAd = null;
// 在页面中定义插屏广告
let interstitialAd = null

const range = (start, count, step) => {
  return Array.from(Array.from(Array(Math.ceil((count - start) / step)).keys()), x => start + x * step);
}
const STORAGE_KEY = 'PLUG-ADD-MYAPP-KEY';

export default {
  components: {
    tuiFooter,
    addTips
  },
  data() {
    return {
      SHOW_TIP: false,
      duration: 15,
      statusBarHeight: 0,
      windowHeight: 0,
      isAndroid: getApp().globalData.IS_ANDROID,
      modalName: null,
      savedCounts: 0,
      cansWidth: 270, // 宽度 px
      cansHeight: 270, // 高度 px
      avatarPath: '/static/image/head/'+ Math.floor(Math.random()*12) + '.jpg',
      currentMaskUrl: '',
      showBorder: false,
      maskCenterX: wx.getSystemInfoSync().windowWidth / 2,
      maskCenterY: 250,
      cancelCenterX: wx.getSystemInfoSync().windowWidth / 2 - 50 - 2,
      cancelCenterY: 200,
      handleCenterX: wx.getSystemInfoSync().windowWidth / 2 + 50 - 2,
      handleCenterY: 300,
      maskSize: 100,
      scale: 1,
      rotate: 0,
      rotateY: 0, // 值180时，则水平翻转
      mask_center_x: wx.getSystemInfoSync().windowWidth / 2,
      mask_center_y: 250,
      cancel_center_x: wx.getSystemInfoSync().windowWidth / 2 - 50 - 2,
      cancel_center_y: 200,
      handle_center_x: wx.getSystemInfoSync().windowWidth / 2 + 50 - 2,
      handle_center_y: 300,
      scaleCurrent: 1,
      rotateCurrent: 0,
      touch_target: "",
      start_x: 0,
      start_y: 0,
      cdnUrl: '',

      // 节日挂件封装
      dateType: '',
      dateTitle: '',
      dateSlogan: '',
      dateTtlStr: '',
      dateNextTtlStr: '',
      dataImgListCur: []
    }
  },
  computed: {
    ...mapState({
      userInfo: 'userInfo'
    }),
    maskPic: function() {
      // return '/static/image/date/' + this.dateType +'/'+ this.currentMaskId + '.png'
      return Config.imageCdn + this.currentMaskUrl
    }
  },
  onLoad(option) {
    // 初始化网络素材
    this.cdnUrl = Config.imageCdn

    this.windowHeight = getApp().globalData.windowHeight
    if (!!getApp().globalData.userAvatarFilePath) {
      this.avatarPath = getApp().globalData.userAvatarFilePath;
    }

    // 初始化当前date
    this.getHolidayKey()

    // 在页面onLoad回调事件中创建插屏广告实例
    /*
    let that = this;
    if (wx.createInterstitialAd) {
      interstitialAd = wx.createInterstitialAd({
        adUnitId: 'adunit-2bf7cf186785bfda'
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
        adUnitId: 'adunit-9a8af70b40e15f29'
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
          that.rewardedVideoAdAlreadyShow = true; // 本次使用不再展现激励广告
          that.saveCans();
        } else {
          // 播放中途退出，进行提示
          that.rewardedVideoAdAlreadyShow = false;
          uni.showToast({
            title: '请完整观看哦'
          })
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
      }, that.duration * 1000);
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
      this.paint();
    }
  },
  onShareAppMessage(res) {
    return this.shareData()
  },
  onShareTimeline(res) {
    return this.shareData()
  },
  methods: {
    ...mapMutations(["saveLoginUserInfo"]),
    paint() {
    },
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

    getHolidayKey() {
      let calendar = new Date()
      let year = calendar.getFullYear()
      let month = calendar.getMonth() + 1   // 1-12
      let date = calendar.getDate()         // 1-31

      // 处理字符串
      let yearStr = year.toString()
      let monthStr = this.handleSingleDate(month)
      let dateStr = this.handleSingleDate(date)
      let currentDate = yearStr + monthStr + dateStr

      let springFestival = Calendar.lunar2solar(year,1,6)       //除夕春节
      let lanternFestival = Calendar.lunar2solar(year,1,15)     //元宵节
      let dragonBoatFestival = Calendar.lunar2solar(year,5,5)   //端午
      let chineseValentineDay = Calendar.lunar2solar(year,7,7)  //七夕
      let midAutumn = Calendar.lunar2solar(year,8,15)           //中秋
      let motherDay = this.getMothersDay(calendar)              //母亲节
      let fatherDay = this.getFathersDay(calendar)              //父亲节

      // 转成阳历后进行排序
      let springM = this.handleSingleDate(springFestival.cMonth)
      let springD = this.handleSingleDate(springFestival.cDay)
      let lanternM = this.handleSingleDate(lanternFestival.cMonth)
      let lanternD = this.handleSingleDate(lanternFestival.cDay)
      let dragonM = this.handleSingleDate(dragonBoatFestival.cMonth)
      let dragonD = this.handleSingleDate(dragonBoatFestival.cDay)
      let chineseValentineM = this.handleSingleDate(chineseValentineDay.cMonth)
      let chineseValentineD = this.handleSingleDate(chineseValentineDay.cDay)
      let midAutumnM = this.handleSingleDate(midAutumn.cMonth)
      let midAutumnD = this.handleSingleDate(midAutumn.cDay)

      let DateList = [
        {key: 'yuandan', title: '元旦', slogan: '爆竹声中一岁除，春风送暖入屠苏', val: yearStr  + '01' + '03'},
        {key: 'qingren', title: '情人节', slogan: '一生一世执子手，不离不弃共白头', val: yearStr  + '02' + '14'},
        {key: 'nvshen', title: '女神节', slogan: '沉鱼落雁鸟惊喧，羞花闭月花愁颤', val: yearStr  + '03' + '08'},
        {key: 'qingming', title: '清明节', slogan: '燕子来时新社，梨花落后清明', val: yearStr  + '04' + '05'},
        {key: 'laodong', title: '劳动节', slogan: '田家少闲月，五月人倍忙。夜来南风起，小麦覆陇黄', val: yearStr  + '05' + '05'},
        {key: 'ertong', title: '儿童节', slogan: '儿童散学归来早，忙趁东风放纸鸢', val: yearStr  + '06' + '01'},
        {key: 'gaokao', title: '高考', slogan: '会当凌绝顶，一览众山小，祝大家金榜题名', val: yearStr  + '06' + '08'},
        {key: 'jiandang', title: '党的生日', slogan: '镰锤闪光红旗染，理想信念心灵燃', val: yearStr  + '07' + '01'},
        {key: 'jianjun', title: '建军节', slogan: '哪有什么岁月静好，不过是有人替你负重前行', val: yearStr  + '08' + '01'},
        {key: 'jiaoshi', title: '教师节', slogan: '鹤发银丝映日月，丹心热血沃新花', val: yearStr  + '09' + '10'},
        {key: 'guoqing', title: '国庆', slogan: '红旗烈焰燃苍穹，火纱一片换新彤', val: yearStr  + '10' + '07'},
        {key: 'shengdan', title: '圣诞', slogan: '圣诞老人童趣乐，平安之夜舞蹁跹', val: yearStr  + '12' + '25'},
        {key: 'chunjie', title: '春节', slogan: '大家沈醉对芳筵，愿新年，胜旧年', val: yearStr + springM + springD},
        {key: 'yuanxiao', title: '元宵节', slogan: '元宵争看采莲船，宝马香车拾坠钿', val: yearStr + lanternM + lanternD},
        {key: 'duanwu', title: '端午', slogan: '亿兆同归寿，群公共保昌', val: yearStr + dragonM + dragonD},
        {key: 'qixi', title: '七夕', slogan: '金风玉露一相逢，便胜却人间无数', val: yearStr + chineseValentineM + chineseValentineD},
        {key: 'zhongqiu', title: '中秋', slogan: '但愿人长久，千里共婵娟', val: yearStr + midAutumnM + midAutumnD},
        {key: 'muqinjie', title: '母亲节', slogan: '慈母手中线，游子身上衣', val: motherDay},
        {key: 'fuqinjie', title: '父亲节', slogan: '惟愿孩儿愚且鲁，无灾无难到公卿', val: fatherDay},
      ]

      // 排序
      let sortDateList = DateList.sort(function(a,b){return a.val - b.val})
      // console.log('当前日期:', currentDate)
      // console.log('所有节日排序:', sortDateList)

      // for循环从头遍历，获取离当前日期最近的节日，最差o(n)
      for (let i = 0; i < sortDateList.length; i++) {
        let cur = sortDateList[i];
        if (cur.val >= currentDate) {
          // console.log('最近节日', cur)
          this.dateType = cur.key
          this.dateTitle = cur.title
          this.dateSlogan= cur.slogan
          this.dataImgListCur = ImgList[this.dateType]

          // 本次截止日期
          this.dateTtlStr = cur.val

          // 下次预告
          // if (i <= sortDateList.length -1) {
          //   this.dateNextTtlStr = sortDateList[i+1].val
          // }

          return
        }
      }
    },

    getMothersDay(d) {
      d = d || new Date();
      let dd = new Date("May 01 "+d.getFullYear())
      let res = new Date("May " + (1 + (7 - dd.getDay()) + 7) + " " + d.getFullYear())
      let handleMonth = this.handleSingleDate(res.getMonth())
      let handleDate = this.handleSingleDate(res.getDate())
      return res.getFullYear().toString() + handleMonth + handleDate
    },
    getFathersDay(d) {
      d = d || new Date();
      let dd = new Date("Jun 01 "+d.getFullYear())
      let res = new Date("Jun " + (1 + (7 - dd.getDay()) + 14) + " " + d.getFullYear())
      let handleMonth = this.handleSingleDate(res.getMonth())
      let handleDate = this.handleSingleDate(res.getDate())
      return res.getFullYear().toString() + handleMonth + handleDate
    },
    // 处理单字日期
    handleSingleDate(number) {
      return number.toString().length === 1 ? '0' + number.toString() : number.toString()
    },

    shareData() {
      return {
        title: this.dateTitle + '头像限时制作',
        desc: this.dateSlogan,
        imageUrl: this.avatarPath,
        path: '/pages/date/date',
        success(res) {
        },
        fail(res) {
        }
      }
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
            userInfo.avatarUrl = userInfo.avatarUrl.replace("132", "0"); // 使用最大分辨率头像 959 * 959
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
          let tempImagePath = res.tempFilePaths[0];
          that.imageCheck(tempImagePath, that.loadRecImageOrStartToCrop);
        },
        complete: (res) => {
          this.$loading(false)
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
    changeMask(url) {
      this.currentMaskUrl = url
      this.showBorder = true
    },
    draw() {
      // 宝哥看看这里，第一次进来，直接保存，就是一个空图
      if (this.currentMaskUrl === '') {
        this.$toast('您还没选择您的挂件哦')
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
          var query = wx.createSelectorQuery()
          query.select('#avatar-bg').boundingClientRect()
          query.exec(function(res) {
            //res就是 所有标签为#的元素的信息的数组
            mask_center_x = mask_center_x - res[0].left
            mask_center_y = mask_center_y - res[0].top
            const pc = wx.createCanvasContext('cans-id-mask')
            const windowWidth = wx.getSystemInfoSync().windowWidth
            const mask_size = 100 * scale

            pc.clearRect(0, 0, that.cansWidth, that.cansHeight);
            pc.drawImage(that.avatarPath, 0, 0, that.cansWidth, that.cansHeight);
            pc.translate(mask_center_x, mask_center_y);
            pc.rotate(rotate * Math.PI / 180);
            if (that.isAndroid) {
              that.rotateY == 180 && pc.scale(-1, 1);
            }

            pc.drawImage(image.path, -mask_size / 2, -mask_size / 2, mask_size, mask_size);
            pc.draw();

            // 有成功加载的激励视频，才展现提示框
            if (!!videoAd && that.rewardedVideoAdLoaded) {
              uni.showModal({
                title: '获取无限制使用',
                content: '观看完视频可以自动保存哦',
                success: function(res) {
                  if (res.confirm) {
                    console.log('用户点击确定');
                    // 用户触发广告后，显示激励视频广告
                    if (videoAd) {
                      that.rewardedVideoAdAlreadyShow = true;
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
                    console.log('用户点击取消');
                    that.saveCans();
                    return;
                  }
                }
              });
            } else {
              that.saveCans();
            }
          })
        },
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
        x: 0,
        y: 0,
        width: this.cansHeight,
        height: this.cansWidth,
        destWidth: this.cansWidth * 3,
        destHeight: this.cansHeight * 3,
        canvasId: 'cans-id-mask',
        success: function(res) {
          getApp().globalData.maskAvatarSavedTempPath = res.tempFilePath;
          uni.saveImageToPhotosAlbum({
            filePath: res.tempFilePath,
            success: function(res) {
              if (that.savedCounts == 0) {
                that.modalName = 'saveTip';
              } else {
                uni.showToast({
                  title: '请至相册查看'
                })
              }
              that.savedCounts++;
              uni.vibrateShort();
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

.cans-id-mask {
  position: absolute;
  top: 2000px;
  left: 1000px;
}

.flip-horizontal {
  -moz-transform: scaleX(-1);
  -webkit-transform: scaleX(-1);
  -o-transform: scaleX(-1);
  transform: scaleX(-1);
}
</style>
