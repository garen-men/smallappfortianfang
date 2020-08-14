// 获得所有评论
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  const db = cloud.database();
  return await db.collection('suggestions').orderBy('date', 'desc').get()

  }
