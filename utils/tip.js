

// 提示是否登录方法
const isLogin=()=>{
	uni.showModal({
		title: '登录失效提示',
		content: '是否前往登录页',
		cancelText: '我再逛逛',
		confirmText: '前往登录',
		success: res => {
			if (res.confirm) {
				// console.log('用户点击了确定')
				uni.navigateTo({
					url: '../login/login'
				})
			} 
			else if (res.cancel) {
				// 取消
				// 判断当前页面路径======>页面栈
				let page = getCurrentPages()
				if(page[page.length-1].route=='pages/cart/cart'){//如果访问购物车，且点击取消
					// 就回到首页
					uni.reLaunch({
						url:'../index/index'
					})
				}else if(page[page.length-1].route=='pages/order/order'){
					uni.reLaunch({
						url:'../mine/mine'
					})
				}
			}
		},
	})
}

 const format=(shijian)=>{
	   let date = new Date(shijian)
		var y = date.getFullYear(); 
		var m = date.getMonth() + 1;  
			m = m < 10 ? ('0' + m) : m;  
		var d = date.getDate();  
			d = d < 10 ? ('0' + d) : d;  
		var h = date.getHours();  
			h=h < 10 ? ('0' + h) : h;  
		var minute = date.getMinutes();  
			minute = minute < 10 ? ('0' + minute) : minute;  
		var second=date.getSeconds();  
			second=second < 10 ? ('0' + second) : second;  
		return y + '-' + m + '-' + d+' '+h+':'+minute+':'+second; 
}

const tips=(title,icon)=>{
	uni.showToast({
		title,
		icon
	})
}


module.exports = {
	isLogin,
	format,
	tips
}