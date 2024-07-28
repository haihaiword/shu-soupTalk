"use strict";const t=require("../../../../common/vendor.js"),e={name:"z-paging-swiper",mixins:[require("../z-paging/js/modules/common-layout.js").commonLayoutModule],data:()=>({swiperContentStyle:{}}),props:{fixed:{type:Boolean,default:!0},safeAreaInsetBottom:{type:Boolean,default:!1},swiperStyle:{type:Object,default:function(){return{}}}},mounted(){this.$nextTick((()=>{this.systemInfo=t.index.getSystemInfoSync(),setTimeout(this.updateFixedLayout,100)})),this._getCssSafeAreaInsetBottom(),this.updateLeftAndRightWidth(),this.swiperContentStyle={flex:"1"},this.swiperContentStyle={width:"100%",height:"100%"}},computed:{finalSwiperStyle(){const t=this.swiperStyle;if(!this.systemInfo)return t;const e=this.windowTop,s=this.systemInfo.windowBottom;if(this.fixed&&(e&&!t.top&&(t.top=e+"px"),!t.bottom)){let e=s||0;e+=this.safeAreaInsetBottom?this.safeAreaBottom:0,e>0&&(t.bottom=e+"px")}return t}},methods:{updateLeftAndRightWidth(){this.isOldWebView&&this.$nextTick((()=>this._updateLeftAndRightWidth(this.swiperContentStyle,"zp-swiper")))}}};const s=t._export_sfc(e,[["render",function(e,s,o,i,n,r){return t.e({a:-1===e.cssSafeAreaInsetBottom},(e.cssSafeAreaInsetBottom,{}),{b:e.zSlots.top},(e.zSlots.top,{}),{c:e.zSlots.left},e.zSlots.left?{d:e.isOldWebView?1:""}:{},{e:e.isOldWebView?1:"",f:t.s(n.swiperContentStyle),g:e.zSlots.right},e.zSlots.right?{h:e.isOldWebView?1:""}:{},{i:e.zSlots.bottom},(e.zSlots.bottom,{}),{j:t.n(o.fixed?"zp-swiper-container zp-swiper-container-fixed":"zp-swiper-container"),k:t.s(r.finalSwiperStyle)})}],["__scopeId","data-v-73900a4c"]]);wx.createComponent(s);
