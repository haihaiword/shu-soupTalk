<template>
	<view class="reviewed">
		<z-paging-swiper>
			<template #top>
				<z-tabs :current="current" ref="tabs" :list="tabList" @change="tabsChange"></z-tabs>
			</template>
			<swiper :current="current" @transition="swiperTransition" @animationfinish="swiperAnimationfinish">
				<swiper-item v-for="(item,index) in stateLists" :key="index">
					<soup-list :tabIndex="index" :currentIndex="current"></soup-list>
				</swiper-item>
			</swiper>
		</z-paging-swiper>
	</view>
</template>

<script setup>
import { computed, ref } from "vue";
import {isAdminRole,stateLists}from "@/utils/common.js"
const tabs =ref(null)
const current=ref(0)
const tabList=computed(()=>stateLists.map(item=>({...item,name:item.text})))
if(!isAdminRole()){
	uni.reLaunch({
		url:"/pages/index/index"
	})
	throw new Error('error')
}
//滑动光标颜色变化
const swiperAnimationfinish=(e)=>{
	current.value=e.detail.current
	tabs.value.unlockDx()
}
//滑动光标坐标变化
const swiperTransition=(e)=>{
	tabs.value.setDx(e.detail.dx)
	
}
const tabsChange=(e)=>{
	current.value=e
}
</script>

<style lang="scss" scoped>
.reviewed{
	swiper{
		height: 100%;
	}
}
</style>
