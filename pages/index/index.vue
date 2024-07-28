<template>
	<view class="homeLayout">
		<view class="head" >
			<home-head></home-head>
		</view>
		<view class="body">
			<view class="swiperOut">
				
				<view class="noData" v-if="!listData.length">
					<uni-load-more status="loading" :showText="false"></uni-load-more>
				</view>
				<swiper vertical @change="swiperChange" :duration="260" v-else>
					<swiper-item v-for="(item,index) in listData" :key="index" >
						<navigator :url="`/pages/detail/detail?id=${item._id}`" class="content">
							<soup-tab-group :type="item.soup_type"></soup-tab-group>
							
							<soup-text-content  :item="item" maxline="5"></soup-text-content>
							
						</navigator>
						<interactive-bar :item="item" @share="clickShare(index)"></interactive-bar>
					</swiper-item>
					
					
					<swiper-item class="ad">
						<view class="message">
							<view class="title">小主，今日鸡汤已干完！</view>
							<text class="des">每日5碗鸡汤，如果想要加餐，\n点击下方按钮，可继续推送5碗，\n每日最多加餐5次。</text>
						</view>
						<view class="btnGroup">
							<view class="btn" @click="clickAdSoup"> 点击刷新</view>
							<view class="text">今日还有{{readNumber}}次机会</view>
						</view>
					</swiper-item>
					
				</swiper>
			</view>
			<view class="progress">
				<view class="line" :style="{width:lineWidth+'%'}"></view>
			</view>
		</view>
		
	<uni-popup ref="usePopup" type="center" @maskClick="closeUsePopup" @touchmove="closeUsePopup">
			<view class="usePopup">
				<image src="../../static/images/upward.png" mode="heightFix" @click="closeUsePopup"></image>
			</view>
		</uni-popup>
		<share-posters ref="shareRef" :info="shareInfo" ></share-posters>
	</view>
</template>

<script setup>
import { computed, nextTick, ref } from 'vue';
import {onReady} from "@dcloudio/uni-app"
import { showToast } from '../../utils/common';
const listData = ref([]);
const currentIndex = ref(0);
const usePopup =ref(null);
const db=uniCloud.database()
const dbCmd=db.command
const $=dbCmd.aggregate
const currentUser=uniCloud.getCurrentUserInfo().uid
const readNumber=ref(5)
const shareRef=ref(null)
const shareInfo=ref(null)
onReady(()=>{
	let useState = uni.getStorageSync("useState") || false;
	if(!useState) usePopup.value.open();
	
})

uni.$on('like',(e)=>{
	console.log(e);
	let index=listData.value.findIndex(item=>item._id==e._id)
	listData.value[index]={
		...listData.value[index],
		...e
	}
})
//轮播切换事件
const swiperChange = (e)=>{	
	currentIndex.value = e.detail.current
			if(listData.value[currentIndex.value]&&!listData.value[currentIndex.value].is_read){
			listData.value[currentIndex.value].is_read=true
			db.collection("soup-today").where(`user_id==$cloudEnv_uid`).update({
				soup_list:listData.value
			})
		}else{
			console.log("重复操作");
		}
}

//分享方法
const clickShare=(index)=>{
	shareInfo.value=listData.value[index]
	
	shareRef.value.handleShow()
	
}
//进度条的宽度
const lineWidth = computed(()=>currentIndex.value/listData.value.length*100)


//点击操作的遮罩层
const closeUsePopup = ()=>{
	
	usePopup.value.close();
	uni.setStorageSync("useState",true);
}
//点击广告触发方法
const  clickAdSoup=async()=>{
	if(readNumber.value<=0)return showToast('今天的鸡汤已经没有了')
	readNumber.value--
	let res=await db.collection("soup-today").where(`user_id=="${currentUser}"`).update({
		number:readNumber.value
	})
	getSoup('ad')
}
//数据的渲染
const getSoup= async(type='get')=>{
	let {result:{data:todayData=[],errCode=-1}={}}=await db.collection("soup-today").where(`user_id==$cloudEnv_uid`).get()
	if(todayData.length &&type=='get'){
		if(errCode!=0) return showToast("信息错误，请重新刷新","none")
		listData.value=[...listData.value,...todayData[0].soup_list]
		readNumber.value=todayData[0].number
	}else{
	let {result:{errCode,data}}= await db.collection("soup-chicken")
	.aggregate()
	.lookup({
		from:"soup-user-read",let:{soupID:`$_id`},
	pipeline:$.pipeline().match(dbCmd.expr($.eq(['$user_id',currentUser])))
	.project({soup_id:1})
		.done(), as:"readSoup"
	}).addFields({
		readSoup:$.map({input:"$readSoup",in:"$$this.soup_id"})
	})
	// .match(`status==1&&is_delete!=true$$!(_id in ${})`)
	.match({status:1,is_delete:dbCmd.neq(true)})
	
	.match(dbCmd.expr(
	$.cond({ if:$.eq([type,'random']),
	then:$.in(["$_id",'$readSoup']),
	else:$.not($.in(["$_id",'$readSoup']))})
	))
	.lookup({from:"uni-id-users",let:{uid:`$user_id`},
	pipeline:$.pipeline().
	match(dbCmd.expr($.eq([`$_id`,`$$uid`])) )
	.project({username:1,avatar:1}).done(), as: "userInfo"})
	.sample({size:5})
	.limit(5)
	.project({
		collect_count:1,
		comment_count:1,
		content:1,
		from:1,
		like_count:1,
		soup_type:1,
		view_count:1,
		userInfo:$.arrayElemAt(['$userInfo',0])
	})
	.addFields({}).end()
	if(errCode!=0) return showToast("信息错误，请重新刷新","none")
	if(data.length==0) return getSoup1("random")
	data[0].is_read=true
	listData.value=[...listData.value,...data]
	if(type=='ad'){
		db.collection("soup-today").where(`user_id=="${currentUser}"`).update({
			soup_list:listData.value
		})
	}else{
		db.collection("soup-today").add({user_id:currentUser,soup_list:data})
	}
	
	console.log(data);
}
}
getSoup()
</script>

<style lang="scss" scoped>
.homeLayout{
	height: 100vh;
	background: #BDE1FB;
	display: flex;
	flex-direction: column;
	.head{
		
	}
	.body{
		flex:1;
		background: #fff;
		border-radius: 50rpx 50rpx 0 0;
		overflow: hidden;
		.swiperOut{
			height: calc(100% - 8rpx);
			.noData{
				height: 100%;
				display: flex;
				align-items: center;
				justify-content: center;
			}
			swiper{
				height: 100%;
				&-item{
					.content{
						height: calc(100% - 130rpx);						
						display: flex;
						justify-content: center;
						flex-direction: column;
						padding:0 30rpx;
						
						
						
						
						
					}
					
				}
				
				.ad{
					background: #F8F8F8;	
					padding:100rpx 30rpx;
					display: flex;
					flex-direction: column;
					justify-content: space-between;
					align-items: center;
					text-align: center;
					.message{
						background: #fff;
						border-radius: 30rpx;
						padding:40rpx;
						
						.title{
							font-size: 46rpx;
							padding-bottom:20rpx;
							border-bottom:1px solid #eee;
							margin-bottom: 20rpx;
						}
						.des{
							font-size: 32rpx;
							color:#555;
							line-height: 1.8em;
						}
					}
					
					.btnGroup{
						font-size: 30rpx;
						.btn{
							width: 400rpx;
							height: 100rpx;
							border-radius: 100rpx;
							background: linear-gradient(to top,#93c4ff,#b1e1ff);
							display: flex;
							justify-content: center;
							align-items: center;
							font-size: 38rpx;
							color:#203e5f;
							margin-bottom: 10rpx;
						}
						.text{
							padding:20rpx 0;
						}
					}
				}
				
			}
		}
		.progress{
			height: 8rpx;
			width: 100%;
			background: #eee;
			.line{
				height: 100%;
				width: 0%;
				background: linear-gradient(to right,#BCE0FD,#74dbef);
			}
		}
	}
}


.usePopup{	
	padding-top:15vh;
	image{
		height: 150rpx;
		transform: translateY(100rpx);
		opacity: 0;
		animation: useanimate 1.5s infinite;
	}
}

@keyframes useanimate{
	0%{
		transform: translateY(100rpx);
		opacity: 0;
	}
	100%{
		transform: translateY(-100rpx);
		opacity: 1;
	}
}
</style>
