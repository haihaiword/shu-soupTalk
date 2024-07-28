<template>
	<view class="detailLayout" v-if="item">
		<z-paging ref="paging" v-model="commentList" @query="queryList" empty-view-text="抢先回复"
		 empty-view-img="http://cdn.uviewui.com/uview/empty/comment.png">
			<view class="soupDetail">
				<soup-tab-group :type="item.soup_type"></soup-tab-group>
				<soup-text-content :lookState="true" :item="item"></soup-text-content>
			</view>
			
			<view class="comment">
				<view class="list" v-if="commentList.length">
					<view class="row" v-for="item in commentList" :key="item._id">
						<comment-item :item="item" :subReply="true"></comment-item>
					</view>
				</view>
				<view  v-if="!commentList.length && !noData" style="padding: 60rpx;">
					<uni-load-more status="loading" :showText="false"></uni-load-more>
				</view>
			</view>
			<template #bottom>
			<view class="interactive">
				<interactive-bar :item="item" :type="1" @comment="handelComment" @share="clickShare"></interactive-bar>
				<view class="safe-area-bottom"></view>
			</view>
			</template>
		</z-paging>
	</view>
	
	<uni-popup type="bottom" ref="commentPopup" >		
		<comment-reply ref="commentRef" :source="source" @success="replySuccess"></comment-reply>
	</uni-popup>
	<share-posters ref="shareRef" :info="shareInfo" ></share-posters>
</template>

<script setup>
import { ref ,nextTick} from 'vue';
import {onLoad}from "@dcloudio/uni-app"
import { showToast } from '../../utils/common';
let id
const commentPopup = ref(null);
const db=uniCloud.database()
const dbCmd=db.command
const $=dbCmd.aggregate
const item =ref({})
const current_id=uniCloud.getCurrentUserInfo().uid
const shareRef=ref(null)
const shareInfo=ref(null)
const source=ref({})
const commentRef=ref(null)
const commentList=ref([])
const paging=ref(null)
const noData=ref(false)
onLoad((e)=>{
	 e.scene ? id = e.scene :id = e.id
	// id=e.id
	console.log(e);
	getDetail()
})
const handelComment = ()=>{
	commentPopup.value.open();
	commentRef.value.focuFn()
}
//点赞监听
uni.$on('commentLike',(e)=>{
		let index = commentList.value.findIndex(item=>item._id == e._id);
		commentList.value[index] = {
			...commentList.value[index],
			...e
		}
	})
//获取数据
const getDetail = async () => {
		let {
			result: {
				errCode,
				data
			}
		} = await db.collection("soup-chicken").aggregate()
			.match({
				status: 1,
				is_delete: dbCmd.neq(true),
				_id:id
			})			
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
				from: "soup-like",
				let: {
					soupID: '$_id'
				},
				pipeline: $.pipeline().match(				
				dbCmd.expr(
					$.and([
						$.eq(['$like_type', 0]),
						$.eq(['$$soupID','$soup_id']),
						$.eq(['$user_id',current_id])
					])
				)).count('length')
				.done(),
				as: "likeState"
			})
			.lookup({
				from: "soup-collection",
				let: {
					soupID: '$_id'
				},
				pipeline: $.pipeline().match(				
				dbCmd.expr(
					$.and([
						$.eq(['$$soupID','$soup_id']),
						$.eq(['$user_id',current_id])
					])
				)).count('length')
				.done(),
				as: "collectionState"
			})
			.project({
				isLike:$.cond({
					if:$.gt([$.arrayElemAt(['$likeState.length',0]),0]),
					then:true,
					else:false
				}),
				collect_count: 1,
				comment_count: 1,
				isCollection:$.cond({
					if:$.gt([$.arrayElemAt(['$collectionState.length',0]),0]),
					then:true,
					else:false
				}),
				content: 1,
				from: 1,
				like_count: 1,
				soup_type: 1,
				view_count: 1,
				userInfo: $.arrayElemAt(['$userInfo', 0])
			})
			.end()

		if (errCode != 0) return showToast("信息有误，请重新刷新", "none");
		console.log(data);
		item.value = data[0];
		source.value = {
			soup_id:item.value._id,
			comment_type:0
		}
	}
//分享方法
const clickShare=(index)=>{
	shareInfo.value=item.value
	
	shareRef.value.handleShow()
	
}
//删除内容的监听
uni.$on("commentRemove",()=>{
		nextTick(()=>{
			paging.value.refresh();
		})		
	})
const queryList=(pageNo,pageSize)=>{
	getComment(pageNo,pageSize)
}
const getComment=async(pageNo,pageSize)=>{
	let skip=(pageNo-1)*pageSize
	let {result:{errCode,data}}=await db.collection("soup-comments").aggregate()
	.match({soup_id:id,comment_type:0})
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
						from: "soup-comments",
						let: {
							id: '$_id'
						},
						pipeline: $.pipeline().match(dbCmd.expr($.eq(['$reply_parent_id', '$$id'])))
						.count('length')
						.done(),
						as: "childCount"
					})
			.lookup({
						from: "soup-comments",
						let: {
							id: '$_id'
						},
						pipeline: $.pipeline().match(dbCmd.expr($.eq(['$reply_parent_id', '$$id'])))
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
					}).sort({like_count:-1}).limit(2)
					.done(),
					as: "child"
				})
				.lookup({
							from: "soup-like",
							let: {
								commentID: '$_id'
							},
							pipeline: $.pipeline().match(				
							dbCmd.expr(
								$.and([					
									$.eq([id,'$soup_id']),
									$.eq(['$$commentID','$comment_id']),
									$.eq(['$user_id',current_id])
								])
							)).count('length')
							.done(),
							as: "likeState"
						})
	.sort("comment_date desc").skip(skip).limit(pageSize).project({
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
			child:1,
			comment_date: 1,
			childCount:$.arrayElemAt(['$childCount.length', 0]),
			userInfo: $.arrayElemAt(['$userInfo', 0]),
			isLike:$.cond({
							if:$.gt([$.arrayElemAt(['$likeState.length',0]),0]),
							then:true,
							else:false
						})
		}).end()
	// paging.value.complete(data)
	paging.value.complete(data)
	if(data.length==0){
		noData.value=true
	}
	console.log(data);
}
//评论更新 
const replySuccess=()=>{
	showToast("发布成功");
	commentPopup.value.close();
	paging.value.refresh();
}
</script>

<style lang="scss" scoped>
.soupDetail{
	padding:50rpx 30rpx;
	border-bottom:12rpx solid #F7F7F7;
}
.comment{
	
}
.interactive{	
	
	width: 100%;
	
	background: #fff;
	border-top:1px solid #e4e4e4;
}



</style>
