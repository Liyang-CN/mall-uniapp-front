<template>
	<view>
		<uni-search-bar :radius="100" bgColor="#ffff" @confirm="search" @input="input" @cancel="cancel"></uni-search-bar>
		<view class="list" v-if="buffer">
			<view class="row" v-for="(item,index) in orders" :key="index">
				<view class="imagebox">
					<image v-for="(itm,indx) in item.child" :key="indx" :src="itm.img" mode="widthFix"></image>
				</view>
				<view class="info">
					<text space="nbsp">总计{{item.countnumber}}商品 </text>
					<text>应付金额 ￥:{{item.countmoney}}</text>
				</view>
			</view>
		</view>
		<view class="api" v-else>
			没有数据亲！
		</view>
	</view>
</template>

<script>
	import uniSearchBar from '@/components/uni-search-bar/uni-search-bar.vue';
	let app = getApp()
	let {
		isLogin,
		tips
	} = require('../../utils/tip.js')
	export default {
		components: {
			uniSearchBar
		},
		data() {
			return {
				orders: [],
				buffer: true, //页面显示开关,
				userInfo: {},
				header: {}
			}
		},
		onShow(options) {
			// 先判断是否登录
			if (!app.globalData.loginStatus) {
				isLogin();
				return
			}
			this.userInfo = uni.getStorageSync('userInfo')
			app.globalData.header.authorization = this.userInfo.token
			this.header = app.globalData.header

			// 获取订单数据
			this.getOrderList()
		},

		methods: {
			getOrderList() {
				this.$http({
						url: '/api/orderlist',
						data: {
							uid: this.userInfo.uid
						},
						header: this.header
					})
					.then(res => {
						if (res.data.code == 200) {
							if (res.data.list == null) {
								this.buffer = false;
								return
							}
							// 处理图片路径
							let data = res.data.list
							data.forEach(item=>{
								item.child.forEach(item=>{
									item.img= this.$URL+item.img
								})
							})
							this.orders = data
						}else{
							tips('请求失败，请重试！','none')
						}
					})
			},
		}

	}
</script>

<style>
	.row {
		position: relative;
		margin: 10rpx 20rpx;
		height: 240rpx;
		border: 1rpx solid #AAAAAA;
		border-radius: 30rpx;
	}

	.imagebox {
		position: absolute;
		top: 10rpx;
		left: 10rpx;
		display: flex;
		align-items: center;
	}

	image {
		width: 160rpx;
		margin-left: 10rpx;
	}

	.info {
		position: absolute;
		top: 180rpx;
		right: 50rpx;
		display: flex;
		justify-content: space-between;
		font-size: 25rpx;
		width: 340rpx;
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
