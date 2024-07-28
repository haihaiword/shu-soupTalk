<script setup>
	import{onLaunch,onShow,onHide} from "@dcloudio/uni-app"
	import {useUserStore} from "@/stores/user.js"
	const uniIdCo=uniCloud.importObject('uni-id-co')
	const userStore=useUserStore()
	onLaunch(()=>{
		// uni.login({
		// 	success:login=> {
		// 		 uniIdCo.loginByWeixin({
		// 			code:login.code
		// 		}).then(res=>{
		// 			userStore.loginSuccess({...res,showToast:false})
		// 		})
		// 		// console.log(login);
		// 	}
		// })
		
	})
	onShow(()=>{
		console.log('App Show')
	})
	onHide(()=>{
		console.log('App Hide')
	})
</script>

<style lang="scss">
@import "common/style/common-style.scss";
@import "@/static/fonts/iconfont.css";
</style>
