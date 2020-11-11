<template>
	<view class="container">
		<!-- left左侧一级分类列表 -->
		<scroll-view scroll-y class="left">
			<!-- 循环遍历的 -->
			<view class="left_list" :class="activeIndex == ind ? 'activeList' : ''" v-for="(item,ind) in cateData" :key="ind"
			 @click="changeCate(ind)">
				<label for="">{{ item.catename }}</label>
			</view>
		</scroll-view>
		<!-- right右侧二级分类详情 -->
		<scroll-view scroll-y class="right">
			<view class="row">
				<view class="row_list" v-for="(item,index) in classify" :key="index" @click="toProduct(item.id)">
					<image :src="item.img" mode="widthFix"></image>
					<text>{{item.catename}}</text>
				</view>
			</view>
		</scroll-view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				activeIndex: 0,
				cateData: [], //左侧一级分类数据
				classify: [] //右侧二级分类详情	
			}
		},
		onLoad() {

			if (this.getCateData()) {
				this.changeCate(0)
			}
		},
		methods: {
			// 得到商品分类列表
			getCateData() {
				this.$http({
						url: '/api/getcates'
					})
					.then(res => {
						if (res.data.code == 200) {
							let data = res.data.list
							data.forEach(item => {
								if (item.children) {
									item.children.forEach(item => {
										item.img = this.$URL + item.img
									})
								}
							})
							this.cateData = data;
							this.classify = this.cateData[this.activeIndex].children
						} else {
							uni.showToast({
								title: '请重试！'
							})
						}
					})
			},
			changeCate(index) {
				this.activeIndex = index
				this.classify = this.cateData[index].children
			},
			toProduct(id) {
				uni.navigateTo({
					url: '../product/product?type=2&id=' + id
				})
			}
		}
	}
</script>

<style>
	/* 导入外部的样式文件 */
	@import url("../../common/css/classify.css");

	/* 点击左侧导航，显示动态样式 */
	.activeList {
		border-left: 6rpx solid #f26b11;
		color: #f26b11;
	}
</style>
