<script>
	// 项目的根组件
	export default {
		globalData: {
			loginStatus: true, // true:登录有效  false:登录无效
			header: {
				"content-type": "application/json",
				"authorization": ''
			}
		},
		onLaunch() {
			// 这里检测登录状态 检测token
			// 先在缓存里找有没有token  如果有再判断token过期与否
			// loginStatus 检测登录状态的全局变量
			let userInfo = uni.getStorageSync('userInfo') || ''
			if (userInfo == '') { // 用户未登录
				// 修改个人中心tabbar为 未登录
				uni.setTabBarItem({
					index: 2,
					text: '未登录'
				})
				this.globalData.loginStatus = false
			}else{ // 用户已登录 这时需要判断token是否过期
				// 组装header里的authoriation
				this.globalData.header.authorization = userInfo.token
				this.$http({
					url:'/api/checktoken',
					header:this.globalData.header
				})
				.then(res=>{
					// console.log(res)
					if(res.data.code != 200){ // 过期
						uni.setTabBarItem({
							index:2,
							text:'未登录'
						})
						this.globalData.loginStatus=false
					}
				})
			}
		},
	}
</script>

<style>
	/*每个页面公共css */
</style>
