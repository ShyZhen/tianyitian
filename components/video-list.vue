<template>
	<view>
		<view class="videobox" :style="[{'background-color':videoboxBackgroundColor}]">
			<view class="videolistS-v" :style="[{'width':videolistWidth}]">
				<view class="videolistS-v-item"
				v-for="(item,index) in  videolist" :key="index"
				>
					<view class="Imagebox" @click="itemClick(item)">
						<!-- 封面 -->
						<image class="Image"
						:src="item.image"
						mode="aspectFill"
						></image>
					</view>
					<view class="videotitle">
						<!-- 标题 -->
						<view class="title">
							<text class="title-text">{{item.title}}</text>
						</view>
						<!-- 摘要 -->
<!--						<view class="desc">-->
<!--              <view>-->
<!--                <text class="desc-text">最后更新：</text>-->
<!--              </view>-->
<!--						</view>-->
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		props:{
			// 数据列表
			videolist:{
				type:Array,
				default:[]
			},
			// 外盒子背景色
			videoboxBackgroundColor:{
				type:String,
				default:'rgba(255, 255, 255, .0)'
			},
			// 内盒子宽度
			videolistWidth:{
				type:String,
				default:'690rpx'
			}
		},
		name:"video-list",
		data() {
			return {

			};
		},
    methods: {
      itemClick(e) {
        if (e) {
          this.$emit('itemClick', e);
        }
      }
    }
	}
</script>

<style>
.videobox {
  /* #ifndef APP-NVUE || APP-PLUS-NVUE */
  display: flex;
  flex-direction: column;
  /* #endif */
  width: 750rpx;
  justify-content: center;
  align-items: center;
}
.videobox view {
  display: flex;
}
.videobox .videolistS-v {
  width: 690rpx;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-between;

}
.videobox .videolistS-v .videolistS-v-item {
  width: 48%;
  flex-direction: column;
  margin-bottom: 30rpx;
  /* 图片下面，标题和描述的背景颜色 */
  background: #ffffff;
  border-radius: 14rpx;
  height: 180rpx;
}
.videobox .videolistS-v .videolistS-v-item .Imagebox {
  /*height: 296rpx;*/
  border-radius: 14rpx;
  position: relative;
}
.videobox .videolistS-v .videolistS-v-item .Imagebox .Image, .videobox .videolistS-v .videolistS-v-item .Imagebox image {
  height: 120rpx;
  border-top-left-radius: 14rpx;
  border-top-right-radius: 14rpx;
  /* #ifdef APP-VUE || H5 || MP */
  width: 100%;
  /* #endif */
  /* #ifdef APP-NVUE || APP-PLUS-NVUE */
  /* #endif */
}
.videobox .videolistS-v .videolistS-v-item .Imagebox .bottom, .videobox .videolistS-v .videolistS-v-item .Imagebox .top {
  position: absolute;
  right: 0;
}
.videobox .videolistS-v .videolistS-v-item .Imagebox .top {
  top: 0;
}
.videobox .videolistS-v .videolistS-v-item .Imagebox .top .top-text, .videobox .videolistS-v .videolistS-v-item .Imagebox .top .top-text > text {
  padding: 0 8rpx;
  height: 40rpx !important;
  line-height: 40rpx;
  text-align: center;
  color: #FFFFFF;
  background-color: rgba(193, 161, 97, 0.9);
  font-size: 28rpx !important;
  border-top-left-radius: 0;
  border-top-right-radius: 14rpx;
  border-bottom-right-radius: 0;
  border-bottom-left-radius: 14rpx;
}
.videobox .videolistS-v .videolistS-v-item .Imagebox .bottom {
  bottom: 0;
}
.videobox .videolistS-v .videolistS-v-item .Imagebox .bottom .bottom-text, .videobox .videolistS-v .videolistS-v-item .Imagebox .bottom .bottom-text > text {
  padding-bottom: 10rpx;
  padding-right: 10rpx;
  font-size: 26rpx;
  color: #FFFFFF;
}
.videobox .videolistS-v .videolistS-v-item .videotitle {
  /*height: 70rpx;*/
  margin-top: 10rpx;
  flex-direction: column;
  padding-left: 20rpx;
}
.videobox .videolistS-v .videolistS-v-item .videotitle .title {
  height: 40rpx;
  align-items: center;
  /* #ifdef APP-NVUE */
  flex-direction: row;
  flex-wrap: nowrap;
  /* #endif */
}
.videobox .videolistS-v .videolistS-v-item .videotitle .title text, .videobox .videolistS-v .videolistS-v-item .videotitle .title .title-text {
  height: 40rpx;
  align-items: center;
  font-size: 28rpx;
  color: #747d8c;
}
.videobox .videolistS-v .videolistS-v-item .videotitle .desc {
  /*height: 30rpx;*/
  align-items: center;
  /* #ifdef APP-NVUE */
  flex-direction: row;
  flex-wrap: nowrap;
  /* #endif */
  margin-top: inherit;
}
.videobox .videolistS-v .videolistS-v-item .videotitle .desc text, .videobox .videolistS-v .videolistS-v-item .videotitle .desc .desc-text {
  /*height: 30rpx;*/
  align-items: center;
  font-size: 26rpx;
  color: #747d8c;
}

text, .title-text, .desc-text, .title, .desc {
  overflow: hidden;
  word-break: break-all;
  /* break-all(允许在单词内换行。) */
  text-overflow: ellipsis;
  /* 超出部分省略号 */
  display: -webkit-box;
  /** 对象作为伸缩盒子模型显示 **/
  -webkit-box-orient: vertical;
  /** 设置或检索伸缩盒对象的子元素的排列方式 **/
  -webkit-line-clamp: 1;
  /** 显示的行数 **/
  lines: 1;
}

.red-dot {
  width: 20rpx;
  height: 20rpx;
  border-radius: 100%;
  background: #f33;
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, .2);
}
.green-dot {
  width: 20rpx;
  height: 20rpx;
  border-radius: 100%;
  background: #82fc17;
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, .2);
}

</style>
