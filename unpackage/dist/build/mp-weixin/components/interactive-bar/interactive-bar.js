"use strict";const e=require("../../common/vendor.js");if(!Array){e.resolveComponent("uni-icons")()}Math;const o={__name:"interactive-bar",props:{type:{type:Number,default:0},item:{type:Object,default:()=>({})}},emits:["comment","share"],setup(o,{emit:l}){const t=o,i=e.ref(t.item),c=l,u=e.Vs.getCurrentUserInfo().uid,a=e.Vs.database();e.watch((()=>t.item),(e=>{i.value=e}),{deep:!0,immediate:!0});const n=e.debounce((async function(){i.value.isLike?(i.value.like_count--,a.collection("soup-like").where({soup_id:i.value._id,user_id:u,like_type:0}).remove()):(i.value.like_count++,a.collection("soup-like").add({soup_id:i.value._id,like_type:0}));i.value.isLike=!i.value.isLike,e.index.$emit("like",{_id:i.value._id,isLike:i.value.isLike,like_count:i.value.like_count})}),1e3,{leading:!0,trailing:!1});const s=async()=>{console.log(i.value),console.log("收藏"),i.value.isCollection?(await a.collection("soup-collection").where({soup_id:i.value._id,user_id:u,collection_type:0}).remove(),i.value.isCollection=!i.value.isCollection):(await a.collection("soup-collection").add({soup_id:i.value._id,collection_type:0}),i.value.isCollection=!i.value.isCollection)},p=()=>{c("share")},r=()=>{console.log("交互子组件"),c("comment")};return(l,t)=>e.e({a:0==o.type},0==o.type?{b:e.p({type:"redo",size:"28",color:"#999"}),c:e.o(p)}:{},{d:1==o.type},1==o.type?{e:e.o(r)}:{},{f:!i.value.isLike},i.value.isLike?{h:e.p({type:"heart-filled",size:"28",color:"#dd524d"})}:{g:e.p({type:"heart",size:"28",color:"#999"})},{i:i.value.like_count},i.value.like_count?{j:e.t(i.value.like_count),k:i.value.isLike?"#dd524d":"#999"}:{},{l:e.o(((...o)=>e.unref(n)&&e.unref(n)(...o))),m:!i.value.isCollection&&1==o.type},i.value.isCollection||1!=o.type?{}:{n:e.p({type:"star",size:"28",color:"#999"})},{o:i.value.isCollection&&1==o.type},i.value.isCollection&&1==o.type?{p:e.p({type:"star-filled",size:"28",color:"#f0ad4e"})}:{},{q:e.o(s),r:1==o.type},1==o.type?e.e({s:e.p({type:"chatbubble",size:"28",color:"#999"}),t:i.value.comment_count},i.value.comment_count?{v:1==i.value.comment_count?"#dd524d":"#999"}:{},{w:e.o(r)}):{},{x:1==o.type},1==o.type?{y:e.p({type:"redo",size:"28",color:"#999"}),z:e.o(p)}:{})}},l=e._export_sfc(o,[["__scopeId","data-v-b434b934"]]);wx.createComponent(l);
