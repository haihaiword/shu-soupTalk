"use strict";const t=require("../../common/vendor.js"),e=require("../../utils/common.js");if(!Array){(t.resolveComponent("uni-load-more")+t.resolveComponent("soup-item")+t.resolveComponent("z-paging"))()}Math||((()=>"../../uni_modules/uni-load-more/components/uni-load-more/uni-load-more.js")+(()=>"../soup-item/soup-item.js")+(()=>"../../uni_modules/z-paging/components/z-paging/z-paging.js"))();const o={__name:"soup-self",props:{type:{type:Number,default:0}},setup(o){const a=t.ref([]),n=t.ref(null),s=t.Vs.database(),u=o,l=t.ref(u.type),c=(t,e)=>{i()},i=async(t,o)=>{if(1==l.value){let t=s.collection("soup-like").where("user_id == $cloudEnv_uid").getTemp(),o=s.collection("soup-chicken").field("_id,content,like_count,collect_count,comment_count,soup_type,status").getTemp(),{result:{errCode:a,data:u}}=await s.collection(t,o).field("\t\t\n\t\t\tcreate_date as publish_date,\n\t\t\tarrayElemAt(soup_id._id, 0) as _id,\n\t\t\tarrayElemAt(soup_id.content, 0) as content,\n\t\t\tarrayElemAt(soup_id.like_count, 0) as like_count,\n\t\t\tarrayElemAt(soup_id.collect_count, 0) as collect_count,\n\t\t\tarrayElemAt(soup_id.comment_count, 0) as comment_count,\n\t\t\tarrayElemAt(soup_id.soup_type, 0) as soup_type,\n\t\t\tarrayElemAt(soup_id.status, 0) as status\n\t\t").orderBy("publish_date","desc").get();if(0!=a)return e.showToast("操作有误");u.length>3&&u.splice(3,0,{ad:!0}),n.value.complete(u)}if(2==l.value){let t=s.collection("soup-collection").where("user_id == $cloudEnv_uid").getTemp(),o=s.collection("soup-chicken").field("_id,content,like_count,collect_count,comment_count,soup_type,status").getTemp(),{result:{errCode:a,data:u}}=await s.collection(t,o).field("\t\t\n\t\t\tcreate_date as publish_date,\n\t\t\tarrayElemAt(soup_id._id, 0) as _id,\n\t\t\tarrayElemAt(soup_id.content, 0) as content,\n\t\t\tarrayElemAt(soup_id.like_count, 0) as like_count,\n\t\t\tarrayElemAt(soup_id.collect_count, 0) as collect_count,\n\t\t\tarrayElemAt(soup_id.comment_count, 0) as comment_count,\n\t\t\tarrayElemAt(soup_id.soup_type, 0) as soup_type,\n\t\t\tarrayElemAt(soup_id.status, 0) as status\n\t\t").orderBy("publish_date","desc").get();if(0!=a)return e.showToast("操作有误");u.length>3&&u.splice(3,0,{ad:!0}),n.value.complete(u)}};return(e,o)=>({a:t.p({status:"loading"}),b:t.f(a.value,((e,o,a)=>t.e({a:!e.ad},e.ad?{}:{b:"5a64daef-2-"+a+",5a64daef-0",c:t.p({item:e,isEdit:!1})},{d:e._id}))),c:t.sr(n,"5a64daef-0",{k:"paging"}),d:t.o(c),e:t.o((t=>a.value=t)),f:t.p({"safe-area-inset-bottom":!0,modelValue:a.value})})}},a=t._export_sfc(o,[["__scopeId","data-v-5a64daef"]]);wx.createComponent(a);
