<template>
  <view class="page">
    <swiper
      class="swiper-container"
      previous-margin="120rpx"
      next-margin="120rpx"
      circular
      autoplay
      @change="swiperChange"
    >
      <swiper-item
        :class="['swiper-item', { 'swiper-item--active': currentIndex == index }]"
        v-for="(item, index) in imgList"
        :key="item[urlKey]"
        @click.stop="selected(index)"
      >
        <image
          class="swiper-item-img"
          :src="item[urlKey]"
          :style="dontFirstAnimation ? 'animation: none;' : ''"
          mode="aspectFill"
        ></image>
<!--        <view class="swiper-item-name">{{ item.title }}</view>-->
      </swiper-item>
    </swiper>
    <view class="date">世间美好皆不如你</view>
<!--    <view class="btn">点 击 领 取</view>-->
  </view>
</template>
<script>
export default {
  props: {
    imgList: {
      type: Array,
      default() {
        return [];
      }
    },
    urlKey: {
      type: String,
      default() {
        return '';
      }
    }
  },
  data() {
    return {
      currentIndex: 0,
      dontFirstAnimation: true
    };
  },
  methods: {
    swiperChange(e) {
      this.dontFirstAnimation = false;
      this.currentIndex = e.detail.current;
    },
    selected(index) {
      this.$emit('selected', index);
    }
  }
};
</script>
<style lang="scss" scoped>
.swiper-container {
  @include wh(750, 840);
}
.swiper-item {
  @include fcc();
  
  position: relative;
  box-sizing: border-box;
  &-img {
    @include wh(435, 700);

    border-radius: 14rpx;
  }
  &-name {
    @include sc(32, #fff);
    @include tlc();
    bottom: 15rpx;
  }
  &--active {
    @include fcc();
    .swiper-item-img {
      // @include wh(522, 840);
      transition: transform 0.4s ease-in-out;
      @include fd(1.2);
    }
  }
}
.date {
  @include sc(26, #fff);
  @include fcc();
  font-weight: bold;
  height: 80rpx;
  margin: 80rpx 0;
}
//.btn {
//  @include wh(435, 100);
//  @include fcc();
//  @include sc(30, #fff);
//  border-radius: 14rpx;
//  background-color: rgb(224, 37, 37);
//  margin: 0 auto;
//}
</style>
