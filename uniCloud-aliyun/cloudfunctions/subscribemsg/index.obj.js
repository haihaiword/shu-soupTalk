// 云对象教程: https://uniapp.dcloud.net.cn/uniCloud/cloud-obj
// jsdoc语法提示教程：https://ask.dcloud.net.cn/docs/#//ask.dcloud.net.cn/article/129
const UniSubscribemsg = require('uni-subscribemsg');
module.exports = {
	_before: function () { // 通用预处理器

	},
	async sendSubscribeMessage(parmes){
		const dbJQL=uniCloud.databaseForJQL({
			clientInfo:this.getClientInfo()
		})
		let {data:{username,openid}}= dbJQL.collection("uni-id-user").where(`_id==${parmes.user_id}""`)
		.field("username,wx_openid.mp as openid").get({getOne:true})
		const UniSubscribemsg = require('uni-subscribemsg');
		// 初始化实例
		let uniSubscribemsg = new UniSubscribemsg({
			dcloudAppid: "_UNI_23B3761",
			provider: "weixin-mp",
		});
		// 发送订阅消息
		 await uniSubscribemsg.sendSubscribeMessage({
			touser: openid,
			template_id: "Fct-1k8MQNi2XDWEq2q7QfsrCp3gDU4L5hCxshb_LGQ",
			page: "pages_self/soup/list", // 小程序页面地址
			miniprogram_state: "formal", // 跳转小程序类型：developer为开发版；trial为体验版；formal为正式版；默认为正式版
			lang: "zh_CN",
			data: {
				thing1: {
					value: username
				},
				name2: {
					value:username
				},
				thing3: {
					value: parmes.thing1
				},
				time4: {
					value: parmes.time4
				},
				thing5: {
					value: parmes.thing5
				},
			}
		});
	}
}
