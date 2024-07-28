<template>
	<view class="replyLayout">
		<z-paging ref="paging" v-model="replyList" @query="queryList" empty-view-text="抢先回复" empty-view-img="http://cdn.uviewui.com/uview/empty/comment.png">
			<view class="outer">
				<view class="body">
					<comment-item :item="currentReply" :toplevel="true"></comment-item>
				</view>
				<view class="list">
					<view class="row" v-for="item in replyList" :key="item._id">
						<comment-item :item="item" :reply="true" @reply="clickComment"></comment-item>
					</view>
				</view>	
			</view>
			<template #bottom>
				<view class="replyBar" @click="clickReply">
					<view class="out">
						<view class="left">发一条友好的评论吧</view>
						<view class="right">
							<uni-icons type="paperplane" size="26" color="#333"></uni-icons>
						</view>
					</view>
					<view class="safe-area-bottom" :style="{background:'#fff'}"></view>
				</view>
			</template>
		</z-paging>
	</view>
	
	<uni-popup type="bottom" ref="commentPopup">
		<comment-reply ref="commentRef" :source="source" @success="replySuccess"></comment-reply>
	</uni-popup>
</template>

<script setup>
import { ref ,nextTick} from 'vue';
import { showToast } from '../../utils/common';
const currentReply=ref(uni.getStorageSync("currentReply")||{}) 
const commentPopup = ref(null);
import {onUnload} from "@dcloudio/uni-app"
const paging = ref(null);
const db = uniCloud.database();
const dbCmd = db.command;
const current_id=uniCloud.getCurrentUserInfo().uid
const $ = dbCmd.aggregate;
const replyList = ref([]);
const source =ref({
	soup_id:currentReply.value.soup_id,
	comment_type:1,
	reply_parent_id:currentReply.value._id,
	reply_user_id:currentReply.value.userInfo._id,
	reply_comment_id:currentReply.value._id,
	reply_user_name:currentReply.value.userInfo.username
})
const commentRef = ref(null);
const clickReply = ()=>{
	commentPopup.value.open();
	commentRef.value.focuFn()
}
//删除内容的监听
uni.$on("commentRemove",()=>{
		nextTick(()=>{
			paging.value.refresh();
		})		
	})
//点击二级回复
const clickComment=(e)=>{
	clickReply()
	source.value={
		...source.value,
		reply_user_id:e.userInfo._id,
		reply_comment_id:e._id,
		reply_user_name:e.userInfo.username
	}
}
onUnload(()=>{
	uni.removeStorageSync("currentReply")
})
const queryList =(pageNo, pageSize)=>{
	getReply(pageNo, pageSize)
}
const getReply =async (pageNo, pageSize)=>{
	let skip = (pageNo - 1) * pageSize;
	let {result:{errCode,data}}=await db.collection("soup-comments").aggregate()
	.match({soup_id:currentReply.value.soup_id,comment_type:1,reply_parent_id:currentReply.value._id})
	.lookup({
				from: "uni-id-users",
				let: {
					uid: '$user_id'
				},
				pipeline: $.pipeline().match(dbCmd.expr($.eq(['$_id', '$$uid']))).project({
					username: 1,
					avatar: 1
				}).done(),
				as: "userInfo"
			})
	.lookup({
				from:"soup-comments",
				let: {
					reply_comment_id: '$reply_comment_id',
					reply_parent_id:'$reply_parent_id'
				},
				pipeline: $.pipeline().match(dbCmd.
				expr(
					$.and([
							$.neq(["$$reply_comment_id","$$reply_parent_id"]),
							$.eq(['$_id', '$$reply_comment_id'])
						])	
					))
				// 寻找要回复id的用户名
				.lookup({
					from: "uni-id-users",
					let: {
						uid: '$user_id'
					},
					pipeline: $.pipeline().match(dbCmd.expr($.eq(['$_id', '$$uid']))).project({
						username: 1,
					}).done(),
					as: "userInfo"
				})
				.project({
					comment_content: $.cond({
						if:$.eq(['$is_delete',true]),
						then:"已被删除",
						else:'$comment_content'
					}),
					userInfo: $.arrayElemAt(['$userInfo', 0])
				}).done(),
				as: "replyInfo"
			})	
			.lookup({
						from: "soup-like",
						let: {
							commentID: '$_id'
						},
						pipeline: $.pipeline().match(				
						dbCmd.expr(
							$.and([					
								$.eq([currentReply.value.soup_id,'$soup_id']),
								$.eq(['$$commentID','$comment_id']),
								$.eq(['$user_id',current_id])
							])
						)).count('length')
						.done(),
						as: "likeState"
					})
	.sort({comment_date:-1})
	.skip(skip).limit(pageSize)
	.project({
			is_delete:1,
			like_count: 1,
			comment_count: 1,
			comment_type: 1,
			comment_content: $.cond({
				if:$.eq(['$is_delete',true]),
				then:"已被删除",
				else:'$comment_content'
			}),
			soup_id: 1,
			comment_date: 1,
			userInfo: $.arrayElemAt(['$userInfo', 0]),
			replyInfo:$.arrayElemAt(['$replyInfo', 0]),
			isLike:$.cond({
							if:$.gt([$.arrayElemAt(['$likeState.length',0]),0]),
							then:true,
							else:false
						})
		}).end()
	paging.value.complete(data);
	}
//发布成功之后的回调
const replySuccess=()=>{
	showToast("发布成功")
	commentPopup.value.close();
	paging.value.refresh();
	source.value={
		...source.value,
		reply_user_id:currentReply.value.userInfo._id,
		reply_comment_id:currentReply.value._id,
		reply_user_name:currentReply.value.userInfo.username
	}
}
</script>

<style lang="scss" scoped>
.replyLayout{
	.body{
		padding:30rpx 0;
		border-bottom:12rpx solid #F7F7F7;
	}
	.list{
		.row{
			border-bottom:1px solid #F7F7F7;
		}
	}
	.replyBar{
		padding:30rpx;
		border-top: 2rpx solid #e4e4e4;
		background: #fff;
		.out{
			display: flex;
			justify-content: space-between;
			align-items: center;
			.left{
				flex:1;
				height: 70rpx;
				background: #f7f7f7;
				border-radius: 70rpx;
				padding:0 20rpx;
				display: flex;
				align-items: center;
				color:#999;
				margin-right:30rpx;
			}
		}
	}
}
</style>
