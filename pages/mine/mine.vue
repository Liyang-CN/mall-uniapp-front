<template>
	<view class="container">
		<!-- 顶部头像部分 -->
		<view class="mineTop">
			<view class="mineTop_left">
				<view class="mineTop_left_image">
					<image :src="userInfo.img" mode="widthFix"></image>
				</view>
				<view class="mineTop_left_info">
					<label for="" style="color: #fff;" @click="toLogin">{{userInfo.phone}}</label>
				</view>
			</view>
			<view class="mineTop_right">
				<view class="mineTop_right_info">
					<label for="">今日签到</label>
				</view>
			</view>
		</view>

		<!-- 订单状态 -->
		<view class="order_state">
			<view class="order_state_list" v-for="(item,ind) in orderList" :key="ind">
				<image :src="item.icon" mode=""></image>
				<text class="list_text">{{item.name}}</text>
			</view>
		</view>

		<!-- 个人信息 -->
		<view class="person_msg">
			<view class="person_msg_list" v-for="(item,ind) in personMsgList" :key="ind">
				<view class="person_msg_list_info">
					<image :src="item.icon" alt class="MsgItemLogo" />
					<label>{{item.name}}</label>
				</view>
				<view class="MsgItemRight">
					<label class="remaB" v-show="item.remaBala">200余额</label>
					<image src="../../static/mine/xiayiye.png" alt class="MsgItemDetail" />
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	let app = getApp()
	export default {
		data() {
			return {
				userinfo: {
					phone: '请登录',
					img: '/static/mine/tou.png'
				},
				// 订单状态信息
				orderList: [{
						name: "全部订单",
						icon: "../../static/mine/quanbudingdan.png"
					},
					{
						name: "待付款",
						icon: "../../static/mine/daifukuan.png"
					},
					{
						name: "待收货",
						icon: "../../static/mine/daishouhuo.png"
					}
				],
				//   个人信息
				personMsgList: [{
						name: "地址管理",
						icon: "../../static/mine/dizhiguanli.png"
					},
					{
						name: "我的钱包",
						icon: "../../static/mine/zu.png",
						remaBala: "200余额"
					},
					{
						name: "我的优惠券",
						icon: "../../static/mine/wodeyouhuiquan.png",
					},
					{
						name: "我的二维码",
						icon: "../../static/mine/wodeerweima.png",
					},
					{
						name: "我的小伙伴",
						icon: "../../static/mine/xiaohuoban.png"
					}
				],
				userInfo: {
					phone: '请登录',
					img: '/static/mine/tou.png'
				}
			}
		},
		onShow() {
			// 判断是否登录  再APP.vue里已经判断过token的有效期了
			// 因为app.vue里是异步判断token是否过期 所以这里需要延迟一下
			setTimeout(() => {
				if (app.globalData.loginStatus) { // 登录有效
					let {phone} = uni.getStorageSync('userInfo')
					this.userInfo = {
						phone: phone.substr(0, 3) + '****' + phone.substr(7),
						img: '/static/mine/timg.jpg'
					}
					// 修改tabbar为“个人中心”
					uni.setTabBarItem({
						index: 2,
						text: '个人中心'
					})
				} else {
					// 登录失效
				}
			}, 1000)
		},
		methods: {
			toLogin() {
				if (!app.globalData.loginStatus) {
					uni.navigateTo({
						url: '../send/send'
					})
				}
			}
		}
	}
</script>

<style>
	@import url("../../common/css/mine.css");
</style>
