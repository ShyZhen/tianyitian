<template>
	<view class="container" :style="{height:windowHeight+'px'}">
  <!-- <image class="page-bg" :style="{height:windowHeight+'px'}" mode="aspectFill" src="/static/image/page-bg.png"></image>-->

		<view class="content-wrapper">
			<view>
				<view class="ad-container margin-top cu-list menu sm-border card-menu">
					<ad unit-id="adunit-b7df91d4367e062b"></ad>
				</view>
				<view class="cu-card article" >
					<view class="cu-item shadow">
						<view class="title">
							<view class="text-cut">干饭组</view>
						</view>
						<view class="content">
							<image style="width: 160rpx; margin-top: 8px;" src="/static/image/logo/ganfanzu.jpg"
							 mode="widthFix"></image>
							<view class="desc">
								<view class="text-content">干饭组小程序，可每日领取饿了么、美团外卖红包</view>
								<view class="grid justify-between">
									<view>
										<view class="cu-tag bg-red light sm round">外卖红包</view>
										<view class="cu-tag bg-green light sm round">良心推荐</view>
									</view>
									<view>
										<button class="cu-btn line-orange sm" @click="addHappiness">
										<text class="cuIcon-forward"></text> <text class="text-orange">打开</text> </button>
									</view>
								</view>
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		mapState,
	} from "vuex";
	import tuiFooter from "@/components/tui/footer";
	import tuiIcon from "@/components/tui/icon"
  import Config from "../../config/config";

	// 在页面中定义插屏广告
	let interstitialAd = null

	export default {
		components: {
			tuiFooter,
			tuiIcon
		},
		data() {
			return {
				windowHeight: 0,
				webviewStyles: {
					progress: {
						color: '#FF3333'
					}
				},
				modalName: null
			}
		},
		onLoad() {
			this.windowHeight = getApp().globalData.windowHeight;
			// 在页面onLoad回调事件中创建插屏广告实例
      /*
			if (wx.createInterstitialAd) {
				interstitialAd = wx.createInterstitialAd({
					adUnitId: 'adunit-28338c7d91d145af'
				})
				interstitialAd.onLoad(() => {})
				interstitialAd.onError((err) => {
					console.log(err);
				})
				interstitialAd.onClose(() => {})
			}
			*/
		},
		onShow() {
			// 在适合的场景显示插屏广告
			if (interstitialAd) {
				interstitialAd.show().catch((err) => {
					console.error(err)
				})
			}
		},
		computed: {
			...mapState({
				userInfo: 'userInfo'
			})
		},
		methods: {
			addHappiness: function() {
				wx.navigateToMiniProgram({
          appId: Config.jumpAppId,
          path: Config.jumpAppPath,
					success(res) {
						console.log(res);
					},
					fail(e) {
						console.log(e);
					}
				})
			},
		},
	}
</script>

<style scoped>
	.content-wrapper {
		margin-top: 150rpx;
	}
	
	.about-actions{
		/* position: fixed; */
		/* bottom: 80px; */
		width: 500rpx;
		/* left: 125rpx; */
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
	
	.ad-container {
		width: 690rpx;
	}
</style>
