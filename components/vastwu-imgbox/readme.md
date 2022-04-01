###使用说明
```
<template>
	<view style="overflow: hidden;height: 100vh;">
		<view class="my-box">
			<vastwu-imgbox :list="list" :offsetX="16" :offsetY="-16" @slideclick="slideclick" :dur="3000"></vastwu-imgbox>
		</view>
	</view>
</template>

<script>
	import vastwuImgbox from '@/components/vastwu-imgbox/vastwu-imgbox.vue'
	export default {
		data() {
			return {
				list: [{
						imgUrl: 'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fpic.51yuansu.com%2Fpic%2Fcover%2F00%2F28%2F39%2F5802d6517a049_610.jpg&refer=http%3A%2F%2Fpic.51yuansu.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1638511208&t=125e69707bc4520ed0e4cfaad2635d8e'
					},
					{
						imgUrl: 'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fpic.51yuansu.com%2Fpic%2Fcover%2F00%2F28%2F39%2F5802d6517a049_610.jpg&refer=http%3A%2F%2Fpic.51yuansu.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1638511208&t=125e69707bc4520ed0e4cfaad2635d8e'
					},
					{
						imgUrl: 'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fpic.51yuansu.com%2Fpic%2Fcover%2F00%2F28%2F39%2F5802d6517a049_610.jpg&refer=http%3A%2F%2Fpic.51yuansu.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1638511208&t=125e69707bc4520ed0e4cfaad2635d8e'
					}
				]
			}
		},
		components: {
			vastwuImgbox
		},
		methods: {
			slideclick(url) {
				console.log(url)
			}
		}
	}
</script>

<style lang="scss" scoped>
	.my-box {
		position: relative;
		margin: 0 auto;
		margin-top: 30px;
		width: 80%;
	}

	.lookmore {
		position: absolute;
		width: 136rpx;
		height: 53rpx;
		bottom: 95rpx;
		left: 38%;
		z-index: 110;
	}
</style>
```

###参数说明
| 参数名 | 类型 | 默认值 | 说明 |
| ---- | ---- | ---- | ---- |
| list | Array | [{imgUrl:''}] | 图片数组 |
| offsetX | Number | 10 | 横向偏移量 |
| offsetY | Number | 10 | 纵向偏移量 |
| auto | Boolean | true | 是否自动播放 |
| dur | Number | 5000 | 自动播放时长间隔 |

###其他
#####因为slot在微信小程序环境中不兼容遍历写法，所以没有提供自定义插槽，如需修改自定义按钮，可以直接在组件中修改
```
<!-- 可自定义内容 -->
<image class="lookmore" @click.stop="slideclick(item)" src="https://cdn.img.telefen.com/Permerchant/mingpian/lookmore.png"></image>

```
