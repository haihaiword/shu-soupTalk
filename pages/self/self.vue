<template>
	<view class="self">
		<view :style="{height:getNavBarHeight()+'px'}"></view>
		<view class="userinfo">
			<view class="left">
				<view class="avatar">
					<image v-if="userStore.userInfo.avatar" :src="userStore.userInfo.avatar" mode="aspectFill"></image>
					<image v-else src="../../static/logo.png" mode=""></image>
				</view>
				<view class="info">
					<view class="username">{{truncateString(userStore.userInfo.username,7)}}</view>
					<view class="text">使用了{{daysFromTimestamp(userStore.userInfo.register_date) }}天</view>
				</view>
			</view>
			<navigator url="/pages_self/user/edit" class="right">
				<view class="text">编辑资料</view>
				<view class="icon">
					<uni-icons type="right" size="18" color="#999"></uni-icons>
				</view>
			</navigator>
		</view>
	
		<view class="cardLayout">
			<view class="list">				
				<navigator url="/pages_self/soup/list" class="item">
					<view class="left">
						<view class="icon" 
						style="background-image: linear-gradient(to right,rgba(111,207,151,1),rgba(111,207,151,0.5))">
							<uni-icons 
							custom-prefix="iconfont" 
							type="xxm-highlight-fill" size="18" color="#fff"></uni-icons>
						</view>
						<view class="name">熬制鸡汤</view>
					</view>
					<view class="right">
						<view class="text">{{dataset.soup}}</view>
						<uni-icons type="right" size="18" color="#999"></uni-icons>
					</view>
				</navigator>
				
				
				<navigator url="/pages_self/reviewed/list" class="item" v-if="isAdminRole()">
					<view class="left">
						<view class="icon" style="background-image: linear-gradient(to right,rgba(156,77,204,1),rgba(156,77,204,0.5))">
							<uni-icons
							custom-prefix="iconfont" 
							type="xxm-edit-fill" size="18" color="#fff"></uni-icons>
						</view>
						<view class="name">审核鸡汤</view>
					</view>
					<view class="right">
						<view class="text">进入</view>
						<uni-icons type="right" size="18" color="#999"></uni-icons>
					</view>
				</navigator>
				
				
				
				
				<navigator url="/pages_self/like/list" class="item">
					<view class="left">
						<view class="icon" style="background-image: linear-gradient(to right,rgba(255,200,87,1),rgba(255,200,87,0.5))">
							<uni-icons
							custom-prefix="iconfont" 
							type="xxm-star-fill" size="18" color="#fff"></uni-icons>
						</view>
						<view class="name">我的喜欢</view>
					</view>
					<view class="right">
						<view class="text">{{dataset.like}}</view>
						<uni-icons type="right" size="18" color="#999"></uni-icons>
					</view>
				</navigator>
				
				<navigator url="/pages_self/soup-collection/soup-collection" class="item">
					<view class="left">
						<view class="icon" style="background-image: linear-gradient(to right,rgba(59,59,152,1),rgba(59,59,152,0.5))">
							<uni-icons type="pyq" color="#fff" size="18"></uni-icons>
						</view>
						<view class="name">我的收藏</view>
					</view>
					<view class="right">
						<view class="text">进入</view>
						<uni-icons type="right" size="22" color="#999"></uni-icons>
					</view>
				</navigator>
				
				
				<navigator url="/pages_self/score/list" class="item">
					<view class="left">
						<view class="icon" style="background-image: linear-gradient(to right,rgba(75,228,197,1),rgba(75,228,197,0.5))">
							<uni-icons
							custom-prefix="iconfont" 
							type="xxm-hourglass-fill" size="18" color="#fff"></uni-icons>
						</view>
						<view class="name">我的积分</view>
					</view>
					<view class="right">
						<view class="text">{{dataset.scores}}</view>
						<uni-icons type="right" size="22" color="#999"></uni-icons>
					</view>
				</navigator>
				
				
				
				
				
				
				<view class="item">
					<view class="left">
						<view class="icon" style="background-image: linear-gradient(to right,rgba(255,112,52,1),rgba(255,112,52,0.5))">
							<uni-icons
							custom-prefix="iconfont" 
							type="xxm-message-fill" size="18" color="#fff"></uni-icons>
						</view>
						<view class="name">联系我们</view>
					</view>
					<view class="right">
						<view class="text">在线客服</view>
						<uni-icons type="right" size="22" color="#999"></uni-icons>
					</view>
					<button open-type="contact" class="contactBtn" style="width: 100%;">联系</button>
				</view>
				
				
				
			</view>
		</view>
		
		
		
		<!-- <view class="cardLayout">
			<view class="list">
				<view class="item">
					<view class="left">
						<view class="icon" style="background-image: linear-gradient(to right,rgba(181,207,216,1),rgba(181,207,216,0.5))">
							<uni-icons
							custom-prefix="iconfont" 
							type="xxm-pushpin-fill" size="18" color="#fff"></uni-icons>
						</view>
						<view class="name">偏好设置</view>
					</view>
					<view class="right">
						<view class="text">默认</view>
						<uni-icons type="right" size="22" color="#999"></uni-icons>
					</view>
				</view>
				
				
				<view class="item">
					<view class="left">
						<view class="icon" style="background-image: linear-gradient(to right,rgba(181,207,216,1),rgba(181,207,216,0.5))">
							<uni-icons
							custom-prefix="iconfont" 
							type="xxm-api-fill" size="18" color="#fff"></uni-icons>
						</view>
						<view class="name">退出登录</view>
					</view>
					<view class="right">
						<view class="text"></view>
						<uni-icons type="right" size="22" color="#999"></uni-icons>
					</view>
				</view>
				
			</view>
		</view> -->
		
		
		
	</view>
</template>

<script setup>
import {ref} from "vue";
import {getNavBarHeight} from "@/utils/system.js"
import {useUserStore}from "@/stores/user.js"
import {daysFromTimestamp,truncateString} from "@/utils/tools.js"
import { isAdminRole}from "@/utils/common.js"
const userStore = useUserStore();
const db = uniCloud.database();
const dataset = ref({
	soup:0,
	like:0,
	scores:0
})
const getUserDataset = async()=>{
	let soup = db.collection("soup-chicken").where(`user_id == $cloudEnv_uid && status==1`).count();
	let like = db.collection("soup-like").where(`user_id == $cloudEnv_uid`).count();
	let scores = db.collection("soup-scores").where(`user_id ==  $cloudEnv_uid`).orderBy("create_date","desc").limit(1).get({getOne:true});

	Promise.all([soup,like,scores]).then(res=>{
		console.log(res);
		dataset.value.soup = res[0].result.total;
		dataset.value.like = res[1].result.total;
		dataset.value.scores = res[2].result?.data?.balance ?? 0;
	})
	  
}
getUserDataset();
</script>

<style lang="scss" scoped>
.self{
	background: $page-bg-color;
	min-height: 100vh;
	padding-bottom:30rpx;
	.userinfo{
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding:50rpx;
		.left{
			display: flex;
			align-items: center;
			.avatar{
				width: 120rpx;
				height: 120rpx;
				border:3px solid #fff;
				border-radius: 50%;
				overflow: hidden;
				image{
					width: 100%;
					height: 100%;
				}
			}
			.info{
				padding-left:20rpx;
				.username{
					font-size: 38rpx;
					font-weight: 600;
					color:#111;
				}
				.text{
					font-size: 26rpx;
					font-weight: 100;
					color:$text-font-color-3;
					padding-top:10rpx;
				}
				
				
			}
		}
		
		.right{
			display: flex;
			align-items: center;
			.text{
				font-size: 28rpx;
				color:#999;
			}
		}
	}

	.cardLayout{
		width: 690rpx;
		background: #fff;
		margin:30rpx auto;
		border-radius: 20rpx;
		.list{
			padding:30rpx;
			.item{
				display: flex;
				align-items: center;
				justify-content: space-between;
				padding:34rpx 0;
				border-bottom: 1px solid $border-color-light;
				position: relative;
				&:last-child{
					border:none;
				}
				.left{
					display: flex;
					.icon{
						width: 50rpx;
						height: 50rpx;
						background: #fff;
						border-radius: 50%;
						overflow: hidden;
						display: flex;
						align-items: center;
						justify-content: center;
					}
					.name{
						font-size: 38rpx;
						padding-left:20rpx;
					}
				}
				.right{
					display: flex;
					align-items: center;
					font-size: 26rpx;
					color:#999;
				}
				.contactBtn{
					position: absolute;
					top: 0;
					left: 0;
					opacity: 0;
				}
			}
		}
	}
}
</style>
