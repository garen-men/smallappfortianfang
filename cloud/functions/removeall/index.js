// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  const db = cloud.database();

  return await db.collection('suggestions').where({
    _openid: "ozttr5ZVt9086MKIFL_IxLL_F6ls"
  }).remove()
}
