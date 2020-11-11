<template>
	<view class="box">
		<view class="row">
			<text>手机号</text>
			<input type="text" v-model="phone" />
		</view>
		<view class="row">
			<view class="send">
				<text>验证码</text>
				<text class="getCodeBtn" @click="getCode">{{str}}</text>
			</view>
			<input type="text" v-model="code" placeholder="— — — —" maxlength="4" />
		</view>
		<view class="row">
			<text style="font-size: 23rpx;">收不到验证码？试试 <text style="color:#00BB00;font-size: 23rpx;"> 语音验证</text></text>
			<button type="primary" style="width: 90%;border-radius: 80rpx;margin-top: 50rpx;" @click="login">登录</button>
		</view>
		<view class="row">
			<text style="color: #006699;text-align: center;">通过微信授权登录</text>
		</view>
	</view>
</template>

<script>
	let app = getApp()
	export default {
		data() {
			return {
				phone: '',
				code: '',
				str: '获取验证码',
				sendBuffer: true // 不允许短时间多次点击发送按钮
			}

		},
		onLoad() {},
		methods: {
			getCode() {
				if (this.sendBuffer) {
					//首先先验证手机号格式是否正确
					if (!/^1[3456789]\d{9}$/.test(this.phone)) {
						uni.showToast({
							title: '手机号错误！',
							icon: 'none'
						});
						return
					}
					// 请求后端给的验证码
					this.$http({
							url: '/api/sms',
							data: {
								phone: this.phone
							}
						})
						.then(res => {
							if (res.data.code == 200) {
								this.sendBuffer = false // 关闭发送开关
								uni.setStorageSync('code', {
									value: res.data.list.code,
									time: new Date().getTime()
								})
								// 显示倒计时
								let time = 60
								let timer = setInterval(() => {
									this.str = time + 's后可重新获取'
									time--;
									if (time == 0) {
										clearInterval(timer)
										this.str = '获取验证码'
										time = 60
										this.sendBuffer = true
									}
								}, 1000)
							}
						})
				} else {
					uni.showToast({
						title: '稍后才可再次获取',
						icon: 'none'
					})
				}

			},
			login() {
				//首先先验证手机号格式是否正确
				if (!/^1[3456789]\d{9}$/.test(this.phone)) {
					uni.showToast({
						title: '手机号错误！',
						icon: 'none'
					});
					return
				}
				// 判断验证码是否过期   先设定为五分钟有效期  1000*60*5
				let {
					value,
					time
				} = uni.getStorageSync('code')
				// 如果超过五分钟 就提示
				if (new Date().getTime() - time > 300000) {
					uni.showToast({
						title: '验证码已过期，请重新获取',
						icon: 'none'
					});
					return
				}
				// 将本地取出来的验证码 和刚刚获取的验证码比较
				if (value != this.code) {
					uni.showToast({
						title: '验证码错误，请重新获取',
						icon: 'none'
					});
					return
				}
				// 请求登录接口
				this.$http({
						url: '/api/wxlogin',
						data: {
							phone: this.phone
						}
					})
					.then(res => {
						if (res.data.code == 200) { // 登陆成功
							uni.showToast({
								title: res.data.msg
							})
							// 用户信息缓存到本地
							uni.setStorageSync('userInfo', res.data.list)
							// 设置loginStatus为true
							app.globalData.loginStatus = true
							// 延迟跳转到个人中心
							setTimeout(() => {
								uni.reLaunch({
									url: '../mine/mine'
								})
							}, 1000)
						} else {
							uni.showToast({
								title: '登录失败！',
								icon: 'none'
							})
						}

					})
			}
		}
	}
</script>

<style>
	/* 导入外部的样式文件 */
	/* @import url("../../common/css/index.css"); */
	.box {
		position: relative;
	}

	.row {
		display: flex;
		flex-direction: column;
		justify-content: space-around;
		margin: 40rpx;
	}

	.send {
		display: flex;
		justify-content: space-between;
	}

	.send text:nth-of-type(2) {
		color: #00BB00;
	}

	text {
		font-size: 27rpx;
		margin-bottom: 10rpx;
	}

	input {
		border-bottom: 1rpx solid gray;
		height: 65rpx;
	}

	.getCodeBtn {
		font-size: 30rpx
	}
</style>
