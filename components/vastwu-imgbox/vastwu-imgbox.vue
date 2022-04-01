<template>
	<view>
		<view class="card-box" :src="item.imgUrl" v-for="(item,i) in list" :key="i"
			:style="{'z-index':  zIndexs[`zIndex${i+1}`]+100,'left':lefts[`left${i+1}`],'top':`${-(zIndexs[`zIndex${i+1}`]*offsetY)-offsetY}px`}"
			@touchend="moveEnd($event,i+1)" :animation="animations[`animation${i+1}`]">
			<image class="main-img" :src="item.url" @touchstart="moveStart($event,i+1)" @touchmove="move($event,i+1)"></image>
			<!-- 可自定义内容 -->
      <view class="uni-center">
        <button class="lookmore cu-btn round action-btn bg-gradual-blue shadow" @click.stop="slideclick(item)">领取{{item.title}}</button>
      </view>
		</view>
	</view>
</template>

<script>
	export default {
		props: {
			list: {
				type: Array,
				required: true,
				default: function() {
					return []
				}
			},
			offsetX: {
				type: Number,
				default: 10
			},
			offsetY: {
				type: Number,
				default: 10
			},
			auto:{
				type:Boolean,
				default:true
			},
			dur:{
				type:Number,
				default:5000
			}
		},
		data() {
			return {
				currentIndex:1,
				animations: {},
				zIndexs: {},
				lefts:{},//左边偏移量
				running: false,
				touching:false,//是否正按着
				//初始位置
				x: 0,
				y: 0,
				// 移动位置
				x1:0,
				y1:0
			}
		},
		created() {
			for (var i = 0; i < this.list.length; i++) {
				this.$set(this.animations, `animation${i+1}`, uni.createAnimation({
					duration: 300,
					timingFunction: 'ease'
				}))
				this.$set(this.zIndexs, `zIndex${i+1}`, -(i + 1))
				this.$set(this.lefts, `left${i+1}`, `${-(this.zIndexs[`zIndex${i+1}`]*this.offsetX)-this.offsetX}px`)
			}
			if(this.auto){
				setInterval(()=>{
					if(!this.running&&!this.touching)
					this.action(this.currentIndex)
				},this.dur)
			}
			
		},
		methods: {
			move(e,i) {
				this.x1 = e.touches[0].pageX;
				this.y1 = e.touches[0].pageY;
				
				if(this.zIndexs[`zIndex${i}`] == -1 && (this.x - this.x1)>0)
				this.lefts[`left${i}`] = `${-(this.zIndexs[`zIndex${i}`]*this.offsetX)-this.offsetX}`-(this.x - this.x1) + 'px';
			},
			moveEnd(e,i) {
				this.touching=false;
				if((this.x - this.x1)>100 && this.x!=0 && this.x1!=0){
					if (this.zIndexs[`zIndex${i}`] != -1 || this.running) return
					this.action(i)
				}else{
					this.lefts[`left${i}`] = `${-(this.zIndexs[`zIndex${i}`]*this.offsetX)-this.offsetX}px`;
					this.x = 0
					this.x1 = 0
					this.running = false
				}
			},
			moveStart(e, i) {
				this.touching = true
				this.x = e.touches[0].pageX;
				this.y = e.touches[0].pageY;

			},
			action(i){
				this.running = true;
				this.animations[`animation${i}`].translateX(-250).translateY(0).rotate(0).opacity(0.3).step();
				this.animations[`animation${i}`].translateX(0).translateY(0).rotate(0).opacity(1).step();
				this.animations[`animation${i}`] = this.animations[`animation${i}`].export();
				
				setTimeout(() => {
					for (var j = 0; j < this.list.length; j++) {
						if (j + 1 === i) {
							this.zIndexs[`zIndex${j+1}`] = (-this.list.length)
						} else {
							this.zIndexs[`zIndex${j+1}`]++
						}
						this.lefts[`left${j+1}`] = `${-(this.zIndexs[`zIndex${j+1}`]*this.offsetX)-this.offsetX}px`						
					}
					
					if(i == this.list.length){
						this.currentIndex = 1
					}else{
						this.currentIndex++
					}
					
					// 重置
					for (var k = 0; k < this.list.length; k++) {
						this.$set(this.animations, `animation${k+1}`, uni.createAnimation({
							duration: 300,
							timingFunction: 'ease'
						}))
					}
					this.running = false
					this.x = 0
					this.x1 = 0
				}, 300)
			},
			slideclick(item) {
				this.$emit('slideclick', item);
			}
		}
	}
</script>

<style scoped>
	.card-box {
		position: absolute;
		height: 980rpx;
		width: 580rpx;
		top: 0;
		box-shadow: 0 0 20rpx #555;
		transition: z-index 2s easc;
		border-radius: 20rpx;
	}

	.main-img {
		width: 100%;
		height: 100%;
		border-radius: 20rpx;
	}
	
	.lookmore {
    bottom: 95rpx;
    /*left: 28%;*/
    z-index: 110;
    /*width: 45%;*/
	}
</style>
