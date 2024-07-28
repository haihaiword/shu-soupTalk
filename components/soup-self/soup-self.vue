<template>
	<view class="pages">
		<z-paging ref="paging" safe-area-inset-bottom v-model="soupData" @query="queryList">
			<template #loading>
				<uni-load-more status="loading"></uni-load-more>
			</template>
						
			<view class="list">
				<view class="item" v-for="item in soupData" :key="item._id">
					<soup-item :item="item" :isEdit="false" v-if="!item.ad"></soup-item>
					<view v-else class="wxAd">
						<!-- #ifdef MP-WEIXIN -->						
						<ad unit-id="adunit-3e2ae9dacbcb600d" ad-type="video" ad-theme="white"></ad>
						<!-- #endif -->					
					</view>
				</view>
			</view>
		</z-paging>
	</view>
</template>

<script setup>
import { ref } from 'vue';
import { showToast } from '../../utils/common';
const soupData = ref([]);
const paging = ref(null);
const db = uniCloud.database();
const props= defineProps({
	type:{
		type:Number,
		default:0
	}})
const newItem=ref(props.type)
const queryList = (pageNo, pageSize)=>{
	getSoupList(pageNo, pageSize);
}

const getSoupList =async (pageNo, pageSize)=>{
	if(newItem.value==1){
		let likeTemp = db.collection("soup-like").where(`user_id == $cloudEnv_uid`).getTemp();
		let soupTemp = db.collection("soup-chicken").field("_id,content,like_count,collect_count,comment_count,soup_type,status").getTemp();
		let {result:{errCode,data}}= await db.collection(likeTemp,soupTemp).field(`		
			create_date as publish_date,
			arrayElemAt(soup_id._id, 0) as _id,
			arrayElemAt(soup_id.content, 0) as content,
			arrayElemAt(soup_id.like_count, 0) as like_count,
			arrayElemAt(soup_id.collect_count, 0) as collect_count,
			arrayElemAt(soup_id.comment_count, 0) as comment_count,
			arrayElemAt(soup_id.soup_type, 0) as soup_type,
			arrayElemAt(soup_id.status, 0) as status
		`).orderBy("publish_date","desc").get();
		if(errCode!=0) return showToast("操作有误");
		
		if(data.length>3) data.splice(3,0,{ad:true});
		paging.value.complete(data);
	}
	if(newItem.value==2){
		let likeTemp = db.collection("soup-collection").where(`user_id == $cloudEnv_uid`).getTemp();
		let soupTemp = db.collection("soup-chicken").field("_id,content,like_count,collect_count,comment_count,soup_type,status").getTemp();
		let {result:{errCode,data}}= await db.collection(likeTemp,soupTemp).field(`		
			create_date as publish_date,
			arrayElemAt(soup_id._id, 0) as _id,
			arrayElemAt(soup_id.content, 0) as content,
			arrayElemAt(soup_id.like_count, 0) as like_count,
			arrayElemAt(soup_id.collect_count, 0) as collect_count,
			arrayElemAt(soup_id.comment_count, 0) as comment_count,
			arrayElemAt(soup_id.soup_type, 0) as soup_type,
			arrayElemAt(soup_id.status, 0) as status
		`).orderBy("publish_date","desc").get();
		if(errCode!=0) return showToast("操作有误");
		
		if(data.length>3) data.splice(3,0,{ad:true});
		paging.value.complete(data);
	}
}
</script>

<style lang="scss" scoped>
.pages{
	.list{
		padding:30rpx 30rpx 0;
	}
}
</style>