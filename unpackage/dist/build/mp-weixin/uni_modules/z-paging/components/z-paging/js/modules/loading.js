"use strict";const e=require("../../../../../../common/vendor.js"),i=require("../z-paging-utils.js"),o=require("../z-paging-enum.js"),t={props:{autoHideLoadingAfterFirstLoaded:{type:Boolean,default:i.u.gc("autoHideLoadingAfterFirstLoaded",!0)},loadingFullFixed:{type:Boolean,default:i.u.gc("loadingFullFixed",!1)},autoShowSystemLoading:{type:Boolean,default:i.u.gc("autoShowSystemLoading",!1)},systemLoadingMask:{type:Boolean,default:i.u.gc("systemLoadingMask",!0)},systemLoadingText:{type:[String,Object],default:i.u.gc("systemLoadingText",null)}},data:()=>({loading:!1,loadingForNow:!1}),watch:{loadingStatus(e){this.$emit("loadingStatusChange",e),this.$nextTick((()=>{this.loadingStatusAfterRender=e})),!this.useChatRecordMode||!this.isFirstPage||e!==o.Enum.More.NoMore&&e!==o.Enum.More.Fail?this.isFirstPageAndNoMore=!1:this.isFirstPageAndNoMore=!0},loading(e){e&&(this.loadingForNow=e)}},computed:{showLoading(){return!(this.firstPageLoaded||!this.loading||!this.loadingForNow)&&(this.finalShowSystemLoading&&e.index.showLoading({title:this.finalSystemLoadingText,mask:this.systemLoadingMask}),this.autoHideLoadingAfterFirstLoaded?!!this.fromEmptyViewReload||!this.pagingLoaded:this.loadingType===o.Enum.LoadingType.Refresher)},finalShowSystemLoading(){return this.autoShowSystemLoading&&this.loadingType===o.Enum.LoadingType.Refresher}},methods:{_startLoading(e=!1){(this.showLoadingMoreWhenReload&&!this.isUserPullDown||!e)&&(this.loadingStatus=o.Enum.More.Loading),this.loading=!0},_endSystemLoadingAndRefresh(){this.finalShowSystemLoading&&e.index.hideLoading(),!this.useCustomRefresher&&e.index.stopPullDownRefresh()}}};exports.loadingModule=t;
