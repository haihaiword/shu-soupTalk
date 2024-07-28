// schema扩展相关文档请参阅：https://uniapp.dcloud.net.cn/uniCloud/jql-schema-ext.html
const db=uniCloud.database()
const dbCmd=db.command

module.exports = {
		trigger: {
			afterRead: async function({
				collection,
				operation,
				where,
				field,
				result
			} = {}) {
					let ids=result.data.map(item=>item._id)
					 // let ids=result.data[0]._id
					// console.log("这是"+result.data);
					db.collection("soup-chicken")
					.where({_id:dbCmd.in(ids)})
					// .doc(ids)
					.update({
						view_count:dbCmd.inc(1)
					})
				  
			},
			// 注册数据表的read前事件
			beforeRead: async function(
				// 确定要监听的什么样的JQL指令
				{
					collection,
					operation,
					docId,
					updateData,
					clientInfo
				} = {}) {
				if (typeof doId === 'string') {
					updateData.last_modify_date = Date.now()
				}
				}
			}
		}