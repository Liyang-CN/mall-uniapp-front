<template> 
	<view class="container">
		<!-- 详情图片 -->
		<view class="detailImage">
			<image :src="detail.img">
		</view>
		<!-- 详情基本信息 -->
		<view class="detailInfo">
			<view class="detailInfoName">
				<label>{{detail.goodsname}}</label>
			</view>
			<view class="detailInfoPrice">
				<label style="color: red;">￥ {{detail.price}}</label>
				<label style="font-size: 24rpx;color: #ccc;">(此价格不与套装优惠同时享受)</label>
			</view>
			<view class="detailInfoMarket">
				<label style="font-size: 18rpx;color: #ccc;">￥{{detail.market_price}}</label>
			</view>
		</view>

		<!-- 基本信息改变 -->
		<view class="changeInfo">
			<view class="youhui">
				<view>促销：<label class="manjian">满减</label><label class="dazhe">满2件9折；3件8折</label></view>
			</view>
			<!-- 数量加减 -->
			<view class="changeNum">
				<view class="num">购买数量</view>
				<view class="action">
					<label class="jian" @click="changeNum(1)">-</label>
					<label class="zhi">{{detail.cartnum}}</label>
					<label class="jia" @click="changeNum(2)">+</label>
				</view>
			</view>
			<!-- 商品属性 -->
			<view class="changeState">
				<view class="productStat">
					<label for="">{{detail.specsname}}</label>
				</view>
				<view class="productGuige" v-for="(item,index) in detail.specsattr">
					<label></label>
					<view class="bg">{{item}}</view>
				</view>
			</view>
		</view>
		<!-- 商品详情 -->
		<view class="productDetail">
			<view class="productDetailTitle">商品详情</view>
			<!-- 需要处理图片自适应问题 -->
			<image :src="productDetailImage.detailImage" mode="widthFix" style="width: 100%;" />
		</view>

		<view class="productEval">
			<view class="eval">商品评价</view>
			<view v-for="(item,index) in evals" :key="index">
				<label class="evalUsername">{{item.name}}</label>
				<label class="evalUsertitle">{{item.title}}</label>
				<view class="evalImage">
					<image v-for="(i,ind) in item.img" :key="ind" :src="i">
				</view>
				<label class="evalTime">{{item.time}}</label>
			</view>
		</view>
		<!-- 底部按钮 -->
		<view class="foot">
			<button class="footbtn1" @click="addCart">加入购物车</button>
			<button class="footbtn2">立即购买</button>
		</view>
	</view>
</template>

<script>
	let app = getApp()
	let {isLogin,tips} = require('../../utils/tip.js')
	export default {
		data() {
			return {
				bg: 'threed3i1', //商品属性背景色
				productDetailImage: {
					detailImage: "../../static/detail/2.jpg"
				},
				evals: [{ //评价内容
					name: '小李白',
					title: '效果很好，物流到位，下次继续来',
					img: ["../../static/detail/pingjia1.jpg", "../../static/detail/pingjia1.jpg", "../../static/detail/pingjia1.jpg",
						"../../static/detail/pingjia1.jpg", "../../static/detail/pingjia2.jpg", "../../static/detail/pingjia3.jpg"
					],
					time: '2020-01-13'
				}],
				id: 0,
				detail: {},
			}
		},
		onLoad: function(options) {
			this.id = Number(options.id)
			this.getDetail(this.id)
		},
		onShow() {

		},
		methods: {
			addCart() {
				if (!app.globalData.loginStatus) {
					// 询问是否登录 
					isLogin()
					return
				}
				let {uid,token} = uni.getStorageSync("userInfo")
				app.globalData.header.authorization = token
				// 请求添加购物车的接口
				this.$http({
						url: '/api/cartadd',
						header: app.globalData.header,
						data: {
							uid,
							goodsid: this.id,
							num: this.detail.cartnum
						},
						method: 'POSt'
					})
					.then(res => {
						console.log(res)
						if (res.data.code == 200) {
							tips('添加成功','success')
						} else {
							tips('添加失败','none')
						} 
					})
			},
			getDetail(id) {
				this.$http({
						url: '/api/getgoodsinfo',
						data: {
							id
						}
					})
					.then(res => {
						console.log(res)
						// 处理数据
						let data = res.data.list[0];
						// 处理图片路径
						data.img = this.$URL + data.img;
						// 处理商品属性  商品的sku :商品库存单位
						data.specsattr = data.specsattr.split(',');
						// 将添加购物车的商品数据量追加到商品数据中
						data.cartnum = 1;
						this.detail = data
					})
			},
			changeNum(type) {
				if (type == 1) { //减
					this.detail.cartnum = this.detail.cartnum <= 1 ? 1 : --this.detail.cartnum
				} else { // 加
					this.detail.cartnum = this.detail.cartnum >= 10 ? 10 : ++this.detail.cartnum
				}
			}

		}

	}
</script>

<style>
	@import url("../../common/css/details.css");
</style>
