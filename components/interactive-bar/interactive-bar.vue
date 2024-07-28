<template>
	<view class="interactiveBar">
		<view class="info">
			<view class="left">
				<view class="item" v-if="type==0" @click="clickShare">
					<uni-icons type="redo" size="28" color="#999"></uni-icons>
					<text></text>
				</view>
				<view class="item" v-if="type==1" @click="clickCommentBtn">
					<view class="input">评价一下...</view>
				</view>
			</view>
			<view class="right">
				<view class="item" @click="clickLike">
					<uni-icons v-if="!newItem.isLike" type="heart" size="28" color="#999"></uni-icons>
					<uni-icons v-else type="heart-filled" size="28" color="#dd524d"></uni-icons>
					<text v-if="newItem.like_count" :style="{color:newItem.isLike?'#dd524d':'#999'}">{{newItem.like_count}}</text>
				</view>

				<view class="item" @click="clickCollect">
					<uni-icons v-if="!newItem.isCollection&&type==1" type="star" size="28" color="#999"></uni-icons>
					<uni-icons v-if="newItem.isCollection&&type==1" type="star-filled" size="28" color="#f0ad4e"></uni-icons>
					<text  ></text>
				</view>

				<view class="item" v-if="type==1" @click="clickCommentBtn">
					<uni-icons type="chatbubble" size="28" color="#999"></uni-icons>
					<text v-if="newItem.comment_count" :style="{color:newItem.comment_count==1?'#dd524d':'#999'}"> </text>
				</view>
				
				<view class="item" v-if="type==1" @click="clickShare">
					<uni-icons type="redo" size="28" color="#999"></uni-icons>
					<text></text>
				</view>
			</view>
		</view>
	</view>
</template>

<script setup>
import { ref, watch } from 'vue';
import  debounce from "lodash.debounce"
const props= defineProps({
	type:{
		type:Number,
		default:0
	},
	item:{
		type:Object,
		default(){
			return {}
		}
	}
})
const newItem=ref(props.item)
const emit = defineEmits(['comment','share']) 
const current_id=uniCloud.getCurrentUserInfo().uid
const db=uniCloud.database()

watch(()=>props.item,(nv)=>{
	newItem.value=nv
},{
	deep:true,
	immediate:true
})
//点赞
const clickLike=debounce(clickLikeFn,1000,{'leading':true,'trailing':false})
async function clickLikeFn(){
	if(newItem.value.isLike){
		newItem.value.like_count--
		db.collection("soup-like").where({soup_id:newItem.value._id,user_id:current_id,like_type:0}).remove()
	}else{
		newItem.value.like_count++
		db.collection("soup-like").add({
			soup_id:newItem.value._id,
			like_type:0,
		})
	}
	newItem.value.isLike=!newItem.value.isLike
	uni.$emit('like',{_id:newItem.value._id,isLike:newItem.value.isLike,like_count:newItem.value.like_count})
}

//收藏
const clickCollect = async()=>{
	console.log(newItem.value);
	console.log("收藏");
	if(newItem.value.isCollection){		
		await db.collection("soup-collection").where({soup_id:newItem.value._id,user_id:current_id,collection_type:0}).remove()
		newItem.value.isCollection=!newItem.value.isCollection
	}else{
		await db.collection("soup-collection").add({
			soup_id:newItem.value._id,
			collection_type:0
		})
		newItem.value.isCollection=!newItem.value.isCollection
	}
	
	
}
//点击分享
const clickShare=()=>{
	emit('share')
}
//点击评论框按钮
const clickCommentBtn = ()=>{
	console.log("交互子组件");
	emit("comment")
}
</script>

<style lang="scss" scoped>
	.interactiveBar {		
		.info {
			height: 130rpx;
			display: flex;
			justify-content: space-between;
			align-items: center;
			padding: 0 30rpx;

			.item {
				display: flex;
				align-items: center;
				padding: 10rpx 15rpx;
				color: #999;
			}

			.left {				
				flex:1;
				margin-right: 15rpx;
				.item {
					padding-left: 0;
				}
				.input{
					width: 100%;
					height: 70rpx;
					background: #f7f7f7;
					border-radius: 70rpx;
					display: flex;
					align-items: center;
					padding:0 30rpx;
				}
			}

			.right {
				display: flex;

				.item:last-child {
					padding-right: 0;
				}
			}
		}

	}
</style>