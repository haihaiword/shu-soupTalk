"use strict";const o=require("../common/vendor.js");const t=[{value:0,text:"审核中",color:"#F3A73F",bgColor:"#FDEDD9"},{value:1,text:"审核通过",color:"#18BC37",bgColor:"#D1F2D7"},{value:2,text:"审核不通过",color:"#E43D33",bgColor:"#FAD8D6"}];exports.isAdminRole=function(){return!!o.Vs.getCurrentUserInfo().role.includes("admin")},exports.showToast=function(t="",e="none",n=!0){let r="none"==e?"bottom":"center";o.index.showToast({title:t,icon:e,mask:n,posttion:r})},exports.stateFormat=function(o){return t.find((t=>t.value==o))},exports.stateLists=t;
