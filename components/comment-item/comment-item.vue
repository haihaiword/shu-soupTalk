<template>
	<view class="commentItem">
		<view class="outer">
			<view class="avatar">
				<image class="pic" :src="commentItem.userInfo.avatar||'../../static/images/defAvatar.png'" mode=""></image>
			</view>
			<view class="content">
				<view class="userinfo">
					<view class="left">
						<view class="name">{{commentItem.userInfo.username}}</view>
						<view class="time">
							<uni-dateformat :date="commentItem.comment_date" :threshold="[60000, 3600000]" format="yyyy/MM/dd hh:mm"></uni-dateformat>
						</view>
					</view>
					<view class="right">
						<view class="like" @click="clickLike">
							<view class="num" v-if="commentItem.like_count>0" 
							:style="{color:commentItem.isLike?'#dd524d':'#a7a7a7'}">
							{{commentItem.like_count}}</view>
							<uni-icons v-if="!commentItem.isLike" type="hand-up" size="20" color="#a7a7a7"></uni-icons>
							<uni-icons v-else type="hand-up-filled" size="20" color="#dd524d"></uni-icons>
						</view>
						<view class="remove" 
						v-if="!toplevel&& !commentItem.is_delete&&(commentItem.userInfo._id==current_id||isAdminRole())"
						@click="commentRemove">
							<uni-icons type="trash" size="20" color="#a7a7a7"></uni-icons>
							<text>删除</text>
						</view>
					</view>
				</view>
				<view class="reply" @click="goReply">
					<text :class="commentItem.is_delete?'isDelete':''"> {{commentItem.comment_content}}</text>
					<text class="text" v-if="commentItem.replyInfo">
						//回复 <text class="nickname">@{{commentItem.replyInfo.userInfo.username}}</text>：
						{{commentItem.replyInfo.comment_content}}
					</text>
					
				</view>
			</view>
		</view>
	
		<view class="subReply" v-if="subReply && commentItem.childCount" @click="goReply">
			<view class="list">
				<view class="row" v-for="row in commentItem.child" :key="row._id">{{row.userInfo.username}}：{{row.comment_content}}</view>
				<view class="row more">共{{commentItem.childCount}}条回复 
					<uni-icons type="right" color="#a7a7a7" size="16"></uni-icons>
				</view>
			</view>
		</view>
	</view>
</template>

<script setup>
import { ref , watch} from 'vue';
import  debounce from "lodash.debounce"
import { isAdminRole } from "../../utils/common";
const emits=defineEmits(['reply'])
const current_id= ref(uniCloud.getCurrentUserInfo().uid)
const db=uniCloud.database()
// const commentItem = ref(props.item);
const props = defineProps({
	subReply:{
		type:Boolean,
		default:false
	},
	item:Object,
	reply:{
		type:Boolean,
		default:false
	},	
	toplevel:{
		type:Boolean,
		default:false
	}
})
const commentItem = ref(props.item);
//点击回复
const goReply = ()=>{
	if(props.subReply){
		uni.navigateTo({
			url:"/pages/detail/reply"
		})
		uni.setStorageSync("currentReply",props.item)
	}	
	// console.log(props.item.comment_content);
	if(props.reply){
		// return console.log(props.item.replyInfo);
		emits("reply",props.item)
	}
}
watch(()=>props.item,(nv)=>{
	commentItem.value=nv
},{
	deep:true,
	immediate:true
})

//删除评论
const commentRemove = async()=>{
	console.log(commentItem.value);
	return
	let result = await uni.showModal({
		title:"是否删除"
	})
	if(!result.confirm) return;	
	let {result:{errCode}} = await db.collection("soup-comments").doc(commentItem.value._id).update({
		is_delete:true
	})
	console.log(errCode);
	if(errCode == 0) uni.$emit("commentRemove");
	
}
//点赞
const clickLike=debounce(clickLikeFn,1000,{'leading':true,'trailing':false})
async function clickLikeFn(){
	if(commentItem.value.isLike){
		commentItem.value.like_count--
		db.collection("soup-like")
		.where({soup_id:commentItem.value.soup_id,comment_id:commentItem.value._id,user_id:current_id.value,like_type:1}).remove()
	}else{
		commentItem.value.like_count++
		db.collection("soup-like").add({
			soup_id:commentItem.value.soup_id,
			comment_id:commentItem.value._id,
			like_type:1,
		})
	}
	commentItem.value.isLike=!commentItem.value.isLike
	uni.$emit('commentLike',{_id:commentItem.value._id,isLike:commentItem.value.isLike,like_count:commentItem.value.like_count})
}
</script>

<style lang="scss" scoped>
	.isDelete{
		text-decoration: line-through;
		color:$text-font-color-3;
	}
.commentItem{
	padding:30rpx;
	.outer{
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
		.avatar{
			width: 60rpx;
			height:60rpx;
			margin-right: 20rpx;
			border-radius: 50%;
			overflow: hidden;
			.pic{
				width: 100%;
				height: 100%;
			}
		}
		.content{
			flex:1;
			.userinfo{
				height: 60rpx;
				display: flex;
				align-items: center;
				justify-content: space-between;
				.left{
					.name{
						font-size: 26rpx;
						color:$text-font-color-2;
					}
					.time{
						font-size: 22rpx;
						color:$text-font-color-3;
					}
				}
				.right{
					color:$text-font-color-3;
					font-size: 22rpx;
					display: flex;
					align-items: center;
					.like{
						display: flex;
						align-items: center;
						.num{
							margin-right: 5rpx;
						}
					}
					.remove{
						margin-left:20rpx;
						display: flex;
						align-items: center;
						justify-content: center;
					}
				}
			}
			.reply{
				padding:20rpx 0;
				font-size: 30rpx;
				color:$text-font-color-1;
				line-height: 1.7em;
				.text{
					color:$text-font-color-3;
					.nickname{
						color:$brand-theme-color;
					}
				}
			}
		
		}
	}
	.subReply{
		padding-left:80rpx;
		.list{
			background: #f4f4f4;
			padding:20rpx;
			border-radius: 10rpx;
			.row{
				line-height: 1.8em;
				font-size: 28rpx;
				color:$text-font-color-2;
			}
			.more{
				color:$text-font-color-3;
			}
		}
	}
}
</style>