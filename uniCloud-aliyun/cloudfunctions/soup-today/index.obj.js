// 云对象教程: https://uniapp.dcloud.net.cn/uniCloud/cloud-obj
// jsdoc语法提示教程：https://ask.dcloud.net.cn/docs/#//ask.dcloud.net.cn/article/129
module.exports = {
	_before: function () { // 通用预处理器

	},
	async userRead(){
		const dbJQL=uniCloud.databaseForJQL({
			clientInfo:this.getClientInfo()
		})
		
	},
	_timing:async function(param){
		dbJQL.setUser({
			role:['admin']
		})
		let {data}= await dbJQL.collection("soup-today").get()
		let arrs=[]
		for(let i=0;i<data.length;i++){
			let item=data[i]
			let idList= item.soup_list
			.filter(soup=>soup.is_read==true)
			.map(soup=>({soup_id:soup._id,user_id:item.user_id}))
			arrs.push(dbJQL.collection("soup-user-read").add(idList))
			
		}
		let res=await Promise.all()
		let remove=await dbJQL.collection("soup-today").remove()
		return remove
	}
}
