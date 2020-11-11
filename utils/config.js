// 定义URL
let URL = ''

if (process.env.NODE_ENV === 'development') {
	URL = 'http://localhost:3000' // 这里需要跨域  去api文件夹里 配置一下跨域 (cor)
	// URL = 'https://api.aslegou.top'
} else {
	URL = 'https://api.aslegou.top'
}
 
export default URL
