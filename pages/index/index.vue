<template> 
	<view class="">
		<!-- 搜索框区域 -->
		<view class="head">
			<image src="../../static/index/logo.jpg" mode="widthFix"></image>
			<view class="searchview">
				<input type="text" value="" placeholder="寻找商品" @focus="getsearch" />
			</view>
		</view>
		<!-- 快速分类导航 滚动视图 -->
		<scroll-view scroll-x class="quicknav">
			<view v-for="(item,index) in quicknav" :key="index" @click="changeNav(index,item.id)">
				<text :class="index == topindex ? 'navactive' : '' ">{{item.catename}}</text>
			</view>
		</scroll-view>
		<!-- 轮播图 -->
		<swiper indicator-dots circular autoplay :interval="3000" :duration="1000">
			<swiper-item v-for="(item,index) in swipers" :key="index">
				<image :src="item.img" mode=widthFix></image>
			</swiper-item>
		</swiper>
		<!-- 功能导航 -->
		<view class="funnav">
			<view class="funnavrow" v-for="(item,index) in funNavList" :key="index" @click="toClassify(index)">
				<image :src="item.icon" mode="widthFix"></image>
				<text>{{item.name}}</text>
			</view>
		</view>
		<!-- 秒杀商品推荐区域 -->
		<view class="seckill">
			<!-- 秒杀左侧区域 -->
			<view class="leftseckill">
				<view class="title">
					<image src="../../static/index/xianshi.jpg" mode="widthFix"></image>
					<text>限时秒杀</text>
				</view>
				<view class="info">
					<text>每天零点场，好货抢不停</text>
				</view>
				<view>
					<countdown :startTime="startTime" :endTime="enTime" />
				</view>
				<image src="../../static/classify/1.jpg" mode="widthFix" class="goodimg"></image>
			</view>
			<!-- 秒杀右侧区域 -->
			<view class="rightseckill">
				<view class="top">
					<view class="topinfo">
						<text>品牌上新 <text style="background: #f33182;font-size: 28rpx;color: white;">折</text></text>
						<text>每天九点，抢大牌</text>
					</view>
					<image src="../../static/index/goods1.jpg" mode="widthFix"></image>
				</view>
				<view class="bottom">
					<view class="bottomgood">
						<text>每日十件</text>
						<text>只为您好选</text>
						<image src="../../static/index/goods1.jpg" mode="widthFix"></image>
					</view>
					<view class="bottomgood">
						<text>每日十件</text>
						<text>只为您好选</text>
						<image src="../../static/index/goods1.jpg" mode="widthFix"></image>
					</view>
				</view>
			</view>
		</view>
		<!-- 广告图片推送区域 -->
		<view class="gg">
			<image src="../../static/index/swiper1.jpg" mode="widthFix"></image>
		</view>
		<!-- 推荐商品区域 -->
		<view class="recommendgood">
			<!-- 推荐导航 -->
			<view class="recommendnav">
				<view :class="bottomindex==index? 'recommendactive':''" v-for="(item,index) in indexGoodsCate" :key="index" @click="changeBottom(index)">
					<text>{{item}}</text>
				</view>
			</view>
			<!-- 热门推荐 -->
			<view class="recommendlist" v-show="bottomindex==0">
				<view class="recommendrow" v-for="(item,index) in hotRecommend" :key="index" @click="toDetail(item.id)">
					<image :src="item.img" mode="widthFix"></image>
					<view class="recommendrowinfo">
						<text>{{item.goodsname}}</text>
						<text>现价格： ￥{{item.price}}</text>
						<text>原价格：￥{{item.market_price}}</text>
						<text>
							立即抢购
						</text>
					</view>
				</view>
			</view>
			<!-- 上心推荐 -->
			<view class="recommendlist" v-show="bottomindex==1">
				<view class="recommendrow" v-for="(item,index) in hotRecommend" :key="index" @click="toDetail(item.id)" >
					<image :src="item.img" mode="widthFix"></image>
					<view class="recommendrowinfo">
						<text>{{item.goodsname}}</text>
						<text>现价格： ￥{{item.price}}</text>
						<text>原价格：￥{{item.market_price}}</text>
						<text>
							立即抢购
						</text>
					</view>
				</view>
			</view>
			<!-- 所有商品 -->
			<view class="recommendlist" v-show="bottomindex==2">
				<view class="recommendrow" v-for="(item,index) in hotRecommend" :key="index" @click="toDetail(item.id)">
					<image :src="item.img" mode="widthFix"></image>
					<view class="recommendrowinfo">
						<text>{{item.goodsname}}</text>
						<text>现价格： ￥{{item.price}}</text>
						<text>原价格：￥{{item.market_price}}</text>
						<text>
							立即抢购
						</text>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import countdown from "@/components/cz-countdown/cz-countdown.vue"
	let {
		format
	} = require('@/utils/tip');
	export default {
		components: {
			countdown
		},
		data() {
			return {
				startTime: '2020-01-01 00:00:00',
				enTime: '2020-02-01 00:00:00',
				skilldata: {},
				quicknav: [], //快速分类导航,
				topindex: 0, // 选中快速分类的下标
				swipers: [],
				products: [], //热销、上新、所有商品数据
				funNavList: [{ //功能导航数据
						name: "限时抢购",
						icon: require("../../static/index/xiaohuoban.png")
					},
					{
						name: "积分商城",
						icon: require("../../static/index/jifentixicopy.png")
					},
					{
						name: "联系我们",
						icon: require("../../static/index/lianxiwomen.png")
					},
					{
						name: "商品分类",
						icon: require("../../static/index/-shangpinfenlei-gai.png")
					}
				],
				indexGoodsCate: ['热门推荐', '上心推荐', '所有商品'], // 主页下面三个推荐商品类型导航
				hotRecommend: [], // 热门推荐商品列表
				shangxinRecommend: [], // 上心推荐
				allRecommend: [], // 所有推荐商品
				bottomindex: 0,
			}
		},
		onLoad() {
			this.getCate()
			this.getBanner()
			this.getSecKill()
			this.getIndxGoods(0)
		},
		methods: {
			// 获取一级分类方法
			getCate() {
				this.$http({
						url: '/api/getcate'
					})
					.then(res => {
						this.quicknav = res.data.list
					})
			},
			// 点击切换一级分类
			changeNav(index,id) {
				this.topindex = index
				uni.navigateTo({
					url:"../product/product?type=1&id="+id
				})
			},
			// 获取banner图方法
			getBanner() {
				this.$http({
						url: '/api/getbanner'
					})
					.then(res => {
						let list = res.data.list
						list.forEach(item => {
							item.img = this.$URL + item.img
						})
						this.swipers = list
					})
			},
			// 点击前往分类页
			toClassify(index) {
				if (index == 3) {
					uni.navigateTo({
						url: '../classify/classify'
					})
				}
			},
			// 获取秒杀商品信息
			getSecKill() {
				this.$http({
						url: '/api/getseckill'
					})
					.then(res => {
						console.log(res)
					})
			},
			// 获得推荐商品
			getIndxGoods(index) {
				this.$http({
						url: '/api/getindexgoods'
					})
					.then(res => {
						let data = res.data.list[index].content
						data.forEach(item => {
							item.img = this.$URL + item.img
						})
						this.hotRecommend = data
					})
			},
			// 切换推荐商品导航
			changeBottom(index) {
				this.bottomindex = index
				this.getIndxGoods(index)
			},
			toDetail(id){
				uni.navigateTo({
					url:'../details/details?id='+id
				})
			}
		}
	}
</script>

<style>
	@import url("../../common/css/index.css");
</style>
