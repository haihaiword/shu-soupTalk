<template>
	<view class="scorePage">
		<z-paging ref="paging" v-model="scoreData" @query="queryList" :default-page-size="10" empty-view-text="还没有积分">
			
			<template #loading>
				<uni-load-more status="loading"></uni-load-more>
			</template>
			
			<template >
				<view class="head">
					<view class="number">{{balance}}</view>
					<view class="text">当前积分</view>
				</view>
			</template>
			
			 <view class="list">
				<view class="item" v-for="item in scoreData" :key="item._id">				
					<view class="left">
						<view class="title">
							<template v-if="item.type==1">
								获得
							</template>
							<template v-if="item.type==2">
								消耗
							</template>
							({{item.comment}})
							</view>
						<view class="order">编号：{{item._id}}</view>
						<view class="time">{{formatDate(item.create_date)}}</view>
					</view>
					<view class="right">
						
							<template v-if="item.type==1">
								+
							</template>
						{{item.score}}
											
					</view>
				</view>
			 </view>			 
		</z-paging>		
	</view>
</template>

<script setup>
import {ref,computed} from "vue";
import {formatDate}from "@/utils/tools.js"
const paging = ref(null);
const scoreData = ref([]);
const db=uniCloud.database()

//滚动数据处理
const queryList = (pageNo, pageSize) => {	
	getScoreList(pageNo, pageSize);
}
const balance = computed(()=>scoreData.value.length?scoreData.value[0].balance :0);
//获取积分列表
async function getScoreList(pageNo, pageSize){
	let skip = (pageNo-1)*pageSize;
	try{
		let {result:{data,errCode}}=await db.collection("soup-scores")
		.where(`user_id==$cloudEnv_uid`)
		.orderBy("create_date","desc").skip(skip).limit(pageSize).get()
		if(errCode!=0)return
		paging.value.complete(data);
		console.log(res);
	}catch{
		paging.value.complete(false);
	}
	
}
</script>

<style lang="scss" scoped>
.scorePage{
	.head{
		background-image: linear-gradient(to right,rgba(75,228,197,1),rgba(75,228,197,0.5));
		width: 690rpx;
		margin:50rpx auto;
		border-radius: 10rpx;
		padding:30rpx;
		color:#fff;
		text-align: center;
		.number{
			font-size: 52rpx;
			font-weight: 600;
		}
		.text{
			font-size: 28rpx;
			opacity: 0.8;
		}
	}
	.list{
		padding:0rpx 30rpx 0;
		.item{
			padding: 40rpx 0;
			border-bottom:1px solid $border-color-light;
			display: flex;
			justify-content: space-between;
			align-items: center;
			.left{
				color:$text-font-color-3;
				font-size: 28rpx;		
				.title{
					font-size: 38rpx;
					color:$text-font-color-1;
					padding-bottom:10rpx;
				}
			}
			.right{
				color:$text-font-color-3;
				font-size: 34rpx;
			}
		}
	}	
}
</style>
