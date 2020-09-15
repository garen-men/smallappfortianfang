// 获得所有评论
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})
// 云函数入口函数
exports.main = async (event, context) => {
  const db = cloud.database();
  const { limit, offset, label, login } = event;
  const wxCtx = cloud.getWXContext();
  let data;
  if (label) {
    data = await db.collection('suggestions').where({
      label
    }).orderBy('date', 'desc').get()
  } else {
    if (login && wxCtx.OPENID !== "ozttr5ZVt9086MKIFL_IxLL_F6ls") {
      const usual = await db.collection('usual').get();
      await db.collection('usual').doc(usual.data[0]['_id']).update({
        data: {
          loginDate: +new Date()
        }
      })
    }
    data = await db.collection('suggestions').orderBy('date', 'desc').get()

  }

  return data

  }
