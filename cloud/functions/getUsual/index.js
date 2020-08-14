// 得到通用信息
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  const db = cloud.database();

  const usual = await db.collection('usual').get();
  return usual.data[0]
}
