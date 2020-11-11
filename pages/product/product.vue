<template>
	<view>
		<view class="search">
			<icon type="search" color="white" size="10"></icon>
			<input type="text" value="" placeholder="搜索商品" placeholder-class="placeholder" />
		</view>
		<view class="list">
			<view class="row" v-for="(item,index) in list" :key="index" @click="toDetail(item.id)">
				<!-- <view class="row"> -->
				<image :src="item.img" mode="widthFix"></image>
				<view class="info">
					<text>{{item.goodsname}}</text>
					<text>￥{{item.price}}</text>
					<text>3565评论</text>
				</view>
			</view>
		</view>
		<!-- <view class="api">
			暂无商品数据！
		</view> -->
	</view>
</template>

<script>
	export default {
		data() {
			return {
				page: 1, // 初始化页码
				pageSize: 6, // 初始化页面偏移量
				cateId: '', // 初始化分类id
				url: '', // 初始化请求地址
				type: 1, // 初始化几级分类  1：一级分类  2：二级分类
				totalPage: 0, // 初始化总页数
				list: [], // 初始化数据列表
			}
		},
		onLoad(options) {
			let {
				id,
				type
			} = options
			// console.log(options)
			this.cateId = id
			this.type = type
			if (type == 1) { // 请求一级分类
				this.url = '/api/getcategoodPage'
			} else { // 请求二级分类
				this.url = '/api/getsecondcategoodPage'
			}
			this.getList()
		},
		onReachBottom() {
			if (this.page < this.totalPage) {
				uni.showLoading({
						title: '数据拉取中...'
					})
					++this.page
				setTimeout(() => {
					this.getList()
				}, 500)
			} else {
				uni.showToast({
					title: '没有数据了',
					icon: 'none'
				})
			}
		},
		methods: {
			getList() {
				let data = {} // 组装参数
				if (this.type == 1) { // 获取一级分类
					data = {
						fid: this.cateId,
						page: this.page,
						size: this.pageSize
					}
				} else { // 获取二级分类
					data = {
						sid: this.cateId,
						page: this.page,
						size: this.pageSize
					}
				}
				this.$http({
						url: this.url,
						data
					})
					.then(res => {
						console.log(res)
						this.totalPage = res.data.list[0]
						let data = res.data.list[1]
						if(data==null){
							uni.showToast({
								title:'暂无数据!',icon:'none'
							})
							return
						}
						data.forEach(item => {
							item.img = this.$URL + item.img
						})
						this.list = this.list.concat(data)
						uni.hideLoading()
					})
			},
			toDetail(id) {
				uni.navigateTo({
					url: '../details/details?id=' + id
				})
			}
		}

	}
</script>

<style>
	.search {
		margin: 65rpx;
		height: 75rpx;
		background-color: #f26b11;
		border-radius: 80rpx;
		color: white;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	icon {
		margin: 0 10rpx 0 250rpx;
	}

	.placeholder {
		color: white;
		font-size: 25rpx;
	}

	.row {
		position: relative;
		margin: 10rpx 20rpx;
		height: 190rpx;
		border-bottom: 1rpx solid #AAAAAA;
	}

	image {
		position: absolute;
		top: 0;
		left: 10rpx;
		width: 160rpx;
	}

	.info {
		height: 85%;
		width: 100%;
		position: absolute;
		top: 0;
		left: 200rpx;
		display: flex;
		justify-content: space-around;
		flex-direction: column;
		font-size: 25rpx;
	}

	.info text:nth-of-type(2) {
		color: red;
	}

	.info text:nth-of-type(3) {
		font-size: 20rpx;
		color: #AAAAAA;
	}

	.api {
		line-height: 200rpx;
		text-align: center;
		font-size: 40rpx;
		color: #006699;
	}
</style>
