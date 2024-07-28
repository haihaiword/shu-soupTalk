// 云对象教程: https://uniapp.dcloud.net.cn/uniCloud/cloud-obj
// jsdoc语法提示教程：https://ask.dcloud.net.cn/docs/#//ask.dcloud.net.cn/article/129
const configCenter = require("uni-config-center/uni-id/config.json")
const {appid,appsecret} = configCenter['mp-weixin']['oauth']['weixin'];
module.exports = {
	_before: async function () { // 通用预处理器
		let {data:{access_token}}= await uniCloud.httpclient.request("https://api.weixin.qq.com/cgi-bin/token",{
			method:"get",
			dataType:"json",
			data:{
				grant_type:"client_credential",
				appid,
				secret:appsecret
			}
		})
		this.access_token = access_token
	},
	 async getUnlimited(opts={}){
	let {scene=1,page="pages/index/index",width=200,line_color={"r":0,"g":0,"b":0}} = opts
			let {data} =await uniCloud.httpclient.request("https://api.weixin.qq.com/wxa/getwxacodeunlimit?access_token="+this.access_token,{
				method:"POST",
				dataType:"buffer",
				contentType:"json",
				data:{
					scene,
					page,
					width,
					line_color,
					
				}
			})
			
			 return "data:image/jpeg;base64,"+data.toString('base64');
			 // return  data.toString('base64')
			// return res
		}
	
	
}
