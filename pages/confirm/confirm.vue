<template>
	<view class="container">
		<!-- s收货地址 -->
		<view class="address">
			<view class="address_info">
				<label for="">收件人:{{ information.name }}</label>
				<label for="">{{ information.phone }}</label>
			</view>
			<view class="address_res">
				收货地址：<label for="">{{ information.address }}</label>
			</view>
			<view >
				收件人:<input type="text" placeholder="请填写收件人名称" />
			</view>
		</view>

		<!-- 商品信息 -->
		<view class="carts">
			<view class="cartsInfo" v-for="(item,index) in orders" :key="index">
				<!-- 70px -->
				<view class="carts_detail">
					<image :src="item.img" mode="widthFix" style="width:500rpx;"></image>
					<view class="carts_name">
						<view for="" style="font-size: 30rpx;">{{item.goodsname}}</view>
						<view for="" style="font-size: 26rpx; color: #C0C0C0;">规格:不错的商品</view>
					</view>
					<view class="carts_price">
						<label for="">￥ {{item.price}}</label>
					</view>
				</view>
				<!-- 50px -->
				<view class="cart_num">
					<view class="">
						购买数量：
					</view>
					<view class="">
						<label for="" class="jian" @click="changeNum(1,index,item.id)">-</label>
						<label for="" class="num">{{item.num}}</label>
						<label for="" class="jia" @click="changeNum(2,index,item.id)">+</label>
					</view>
				</view>
				<!-- 横线 -->
				<view class="xian"></view>
			</view>
			<!-- 50px -->
			<view class="kuaidi">
				<label for="">配送方式</label>
				<label for="">XX快递</label>
			</view>
		</view>

		<!-- 优惠券 -->
		<view class="yhquan">
			<label for="">优惠券</label>
			<label for="" style="margin-right: 40rpx;">无可用</label>
		</view>
		<!-- jifen积分 -->
		<view class="jifen">
			<view class="use">
				<label for="">使用积分</label>
			</view>
			<view class="input" style="margin-right: 40rpx;">
				<input type="text" value="" placeholder="输入积分" />
				<label for="" class="input_use">使用</label>
				<label for="" class="input_keyi">可使用50积分</label>
			</view>
		</view>

		<!-- 具体详细 -->
		<view class="resDetail">
			<view class="">
				<label for="">商品金额</label>
				<label for="" style="margin-right:40rpx;color:red">￥{{jisuan.countMoney}}</label>
			</view>
			<view class="">
				<label for="">运费</label>
				<label for="" style="margin-right:40rpx;color:red">+￥0.00</label>
			</view>
			<view class="">
				<label for="">优惠券</label>
				<label for="" style="margin-right:40rpx;color:red">-￥0.00</label>
			</view>
			<view class="">
				<label for="">会员优惠</label>
				<label for="" style="margin-right:40rpx;color:red">-￥0.00</label>
			</view>
			<view class="">
				<label for="">积分抵扣</label>
				<label for="" style="margin-right:40rpx;color:red">-￥0.00</label>
			</view>
		</view>
		<!-- 实付金额 -->
		<view class="sfje">
			实付金额：<label for="" style="color:red">￥{{jisuan.countMoney}}</label>
		</view>

		<!-- 确认订单按钮 -->
		<view class="btn">
			<!-- 点击提交订单按钮，发起支付请求 -->
			<button type="primary" @click="submitOrder(jisuan.countMoney,jisuan.countNum)">提交订单</button>
		</view>
	</view>
</template>

<script>
	let app = getApp()
	let {
		isLogin,
		tips
	} = require('../../utils/tip.js')
	export default {
		data() {
			return {
				information: {
					name: 'YouSu',
					phone: '18240279221',
					address: '北京市海淀区隐泉路清林苑6号楼中公优就业总部3层'
				},
				orders: [], //订单列表
				userInfo: {}, // 用户信息
				header: {}, // 自定义header
			}
		},
		onLoad(options) {
			this.orders = JSON.parse(options.params);
			this.userInfo = uni.getStorageSync('userInfo')
			this.header = app.globalData.header;
		},
		// 计算属性
		computed: {
			jisuan() {
				var countMoney = 0; // 总价钱
				var countNum = 0 // 商品种类数量
				this.orders.forEach(item => {
					if (item.status) {
						countMoney += parseFloat(item.price) * parseInt(item.num)
						countNum += 1
					}
				})
				return {
					countMoney,
					countNum
				}
			}
		},
		methods: {
			// 修改数量
			changeNum(type, index, id) {
				if (type == 1) { // 自减
					if (this.orders[index].num == 1) {
						tips('数量不能再少啦!', 'none');
						return
					}
					--this.orders[index].num
				} else { // 自加
					++this.orders[index].num
				}
				// 操作数据库 通过接口
				this.$http({
						url: '/api/cartedit',
						method: 'POST',
						data: {
							id,
							type
						},
						header: this.header
					})
					.then(res => {
						if (res.data.code == 403) { // 登录失效
							isLogin()
						} else if (res.data.code != 200) {
							tips('请重试!', 'none')
						}
					})
			},
			// 提交订单
			submitOrder(countmoney, countnumber) {
				let params = {
					uid: this.userInfo.uid,
					username: "YouSu",
					userphone: this.userInfo.phone,
					useraddress: "北京市海淀区隐泉路清林苑6号楼中公优就业总部3层",
					countmoney,
					countnumber,
					addtime:new Date()
				}
				// 组装购物车id字符串
				let idstr = ''
				this.orders.forEach(item=>{
					idstr+=item.id+','
				})
				idstr = idstr.substr(0,idstr.length-1)
				// console.log(params,idstr)
				// 请求接口
				// 接口有错貌似  请求不到
				this.$http({
					url:'/api/orderadd',
					method:'POST',
					header:this.header,
					data:{
						params,
						idstr
					}
				})
				.then(res=>{
					console.log(res)
					if(res.data.code == 200){
						tips('提交订单成功！','success')
						setTimeout(()=>{
							uni.navigateTo({
								url:'../order/order'
							})
						},1000)
					}else{
						tips('请重试!','none')
					}
				})
			}
		},

	}
</script>

<style>
	@import url("../../common/css/confirm.css");
</style>
