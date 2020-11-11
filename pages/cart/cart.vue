<template>
	<view class="container" v-if="buffer">
		<view class="top">
			<scroll-view class="scroll-view_H" scroll-x="true" :scroll-left="item.left" v-for="(item,index) in cateList" :key="index">
				<view class="cartInfo" id="demo1">
					<!-- 明日来写购物车基本信息 -->
					<view class="cartInfochild">
						<!-- 选择框 -->
						<view class="cartInfo_switch common">
							<!-- 点击当前商品 -->
							<switch @change="changeOne($event,index)" type="checkbox" :checked="item.status" :data-ind="ind" />
						</view>
						<!-- 图片 -->
						<view class="cartInfo_image common">
							<image :src="item.img" mode="widthFix"></image>
						</view>

						<!-- 信息 -->
						<view class="cartInfo_info">
							<label style="font-size: 26rpx;">{{item.goodsname}}</label>
							<label style="font-size: 24rpx; color: #ccc;">规格：不错的商品</label>
							<label style="color: red;">￥{{item.price}}</label>
						</view>
						<!-- 加减数量 -->
						<view class="cartInfo_num">
							<view class="cartInfo_num_child">
								<label @click="changeNum(1,index,item.id)">-</label>
								<label>{{item.num}}</label>
								<label @click="changeNum(2,index,item.id)">+</label>
							</view>
						</view>
					</view>

				</view>
				<view class="cartDel" id="demo2" @click="delOne(index,item.id)">
					<label for="">删除</label>
				</view>
			</scroll-view>
		</view>

		<!-- 底部 -->
		<view class="foot">
			<view class="footd1" >
				<switch @change="changeAll" type="checkbox" :checked="allStatus" />
				<label>全选</label>
			</view>
			<view class="footd2">
				<view class="footd2sp1">总计：<label style="color: red;">{{jiesuan.countMoney}}</label></view>
				<label class="footd2sp2">不含运费，已优惠￥0.00</label>
			</view>
			<!-- 跳到提交订单，结算页面 -->
			<view class="footd3" @click="toConfirm">
				<!-- 被选中的商品的个数 -->
				<label>去结算({{jiesuan.countNum}}件)</label>
			</view>
		</view>

	</view>
	<view v-else>
		<image src="/static/kk.jpg" mode="widthFix"></image>
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
				scrollLeft: 0, //默认横向滚动 0,
				buffer: true, //检测购物车是否有数据
				userInfo: {},
				cateList: [],
				header: {}, // 初始化请求头
				allStatus:true, // 全选按钮默认为true
			}
		},
		// 页面显示时
		onShow() {
			// 判断用户是否登录
			if (!app.globalData.loginStatus) {
				isLogin();
				return
			}
			// 从缓存的到用户信息
			this.userInfo = uni.getStorageSync('userInfo')
			// 组装header
			app.globalData.header.authorization = this.userInfo.token
			this.header = app.globalData.header
			// 得到购物车数据
			this.getCartList()
		},
		// 计算属性
		computed: {
			jiesuan() {
				let countMoney = 0 // 总金额
				let countNum = 0 // 购买商品数量
				let tabNum = 0 // 购物车右上角小角标
				// 循环判断cartList里每一项status是否为真
				this.cateList.forEach(item => {
					if (item.status) { //如果被选中的话
						countMoney += parseFloat(item.price) * parseInt(item.num)
						countNum += 1
					}
					tabNum += parseInt(item.num)
				})
				if (tabNum > 0) {
					uni.setTabBarBadge({
						index: 1,
						text: countNum.toString()
					})
					this.buffer = true;
				} else {
					uni.removeTabBarBadge({
						index: 1,
					})
					this.buffer = false;
				}
				return {
					countMoney,
					countNum
				}
			}
		},
		methods: {
			getCartList() {
				this.$http({
						url: '/api/cartlist',
						header: this.header,
						data: {
							uid: this.userInfo.uid
						}
					})
					.then(res => {
						console.log(res)
						let data = res.data
						if (data.code == 200) { // 成功
							let cartData = data.list
							if (cartData == null) { // 数据为空
								this.buffer = false;
								return
							} else {
								this.buffer = true
							}
							cartData.forEach(item => {
								item.img = this.$URL + item.img
								item.status = true;
								item.left = 0
							})
							this.cateList = cartData
							this.checkAll()
						} else if (data.code == 403) { // 登陆过期
							isLogin()
						} else { // 网络超时
							tips('请刷新重试!')
						}
					})
			},
			changeNum(type, index, id) {
				if (type == 1) { //自减
					if (this.cateList[index].num == 1) {
						tips('请左滑删除', 'none');
						return
					}
					--this.cateList[index].num
				} else { // 自加
					++this.cateList[index].num
				}
				// 操作数据库
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
						if (res.data.code == 403) {
							isLogin()
						} else if (res.data.code != 200) {
							tips('请重试!', 'none')
						}
					})

			},
			changeOne(e, index) { // 点击单选按钮
				console.log(e, index)
				this.cateList[index].status = e.detail.value
				this.checkAll() //检查全选按钮的状态
			},
			checkAll() { // 检查全选按钮的状态
				// 根据下标查看有没有未选中的单选按钮
				let index = this.cateList.findIndex(item => item.status == false)
				if (index != -1) { // 没有全部选择
					this.allStatus = false
				}else{ // 全部选中
					this.allStatus = true
				}
			},
			changeAll(e){ // 点击全选按钮
				this.allStatus = e.detail.value
				// 同步所有的单选按钮
				this.cateList.forEach(item=>item.status = this.allStatus)
			},
			delOne(index,id){ // 删除
				uni.showModal({
					title:'删除提示',
					content:'您确定要删除吗？',
					success:res=>{
						if(res.confirm){ // 确认删除
							this.$http({
								url:'/api/cartdelete',
								method:'POST',
								header:this.header,
								data:{id}
							})
							.then(res=>{
								if(res.data.code ==200){ // 删除成功
									this.cateList.splice(index,1)
									tips('删除成功','success')
								}else if(res.data.code == 403){ // 登录失效 显示是否登录
									isLogin()
								}else{ // 其他错误
									tips('请重试!','none')
								}
							})
						}
					}
				})
			},
			toConfirm(){ // 前往结算页面
				let order = []
				// 将购物车中选中的商品 传送到结算页面
				this.cateList.forEach(item=>{
					if(item.status){
						order.push(item)
					}
				})
				uni.navigateTo({
					url:'../confirm/confirm?params='+JSON.stringify(order)
				})
			}

		}
	}
</script>

<style>
	@import url("../../common/css/cart.css");

	.cartInfo_image_img {
		width: 120rpx;
		height: 120rpx;
	}
</style>
