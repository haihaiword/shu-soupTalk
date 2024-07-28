<template>
	<view>
		<view class="commentPopup">
			<input @confirm="onSubmit" :focus="commentFocus" 
			v-model="commentData.comment_content" type="text" class="ipt" 
			:placeholder="commentData.reply_user_name?'回复:'+commentData.reply_user_name:'请输入评论内容'" maxlength="50">
			<view class="button" @click="onSubmit">
				<uni-icons type="paperplane" size="26" color="#333"></uni-icons>
			</view>			
		</view>
		<view class="safe-area-bottom" :style="{background:'#fff'}"></view>
	</view>
</template>

<script setup>
import { nextTick, ref } from 'vue';
import {useUserStore}from "@/stores/user.js"
const userStore=useUserStore()
const secCheckObj=uniCloud.importObject("secCheckContent",{customUI:true})
const db=uniCloud.database()
	const commentData=ref({
		comment_content:""
	})
const props =defineProps({
	source:{
		type:Object,
		default(){
			return {}
		}
	}
})
const commentFocus=ref(false)
const emtis=defineEmits(["success"])
const onSubmit = async()=>{
	uni.showLoading()
	let {reply_user_name,..._commentData} = commentData.value;
	let secRes= await secCheckObj.textSecCheck(commentData.value.comment_content,userStore.userInfo.openid)
	if(secRes.code){
		uni.hideLoading()
		uni.showModal({
			title:secRes.errMsg,
			content:`发布内容存在"${secRes.result.label}"问题,请重新编辑后发布!`,
			showCancel:false
		})
		return
	}
	let res= await db.collection("soup-comments").add(_commentData)
	commentData.value.comment_content=""
	emtis("success")
	console.log(res);
	// console.log("点击评论");
} 
const focuFn=()=> {
	commentFocus.value=false
	nextTick(()=>{
		commentFocus.value=true
		commentData.value={
			...commentData.value,
			...props.source
		}
	})
}
defineExpose({
	focuFn
})
</script>

<style lang="scss" scoped>

.commentPopup{
	background: #fff;
	padding:30rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	.ipt{
		background: #f7f7f7;
		height:70rpx;
		flex:1;
		padding:0 20rpx;
		font-size: 28rpx;
		color:#333;
	}
	.button{
		width: 70rpx;
		height: 70rpx;
		margin-left:10rpx;
		display: flex;
		align-items: center;
		justify-content: center;		
	}
}
</style>