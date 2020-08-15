// 计算总评分
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  // try{
  const db = cloud.database();
  const rateList = await db.collection('rates').orderBy('date', 'desc').get();
  const avarage = rateList.data.reduce((pre, cur) => {
    return pre + (cur.rate || 0)
  }, 0);
  
  const usual = await db.collection('usual').get();
  const count = await db.collection('suggestions').where({
    date: db.command.gt(usual.data[0]['loginDate'])
  }).count();
  const countall = await db.collection('suggestions').count();
  const countperson = await db.collection('rates').count();

  return {
    rate: (avarage / (rateList.data.length || 1) * 20).toFixed(2),
    count: count.total,
    countall: countall.total,
    countperson: countperson.total
  }
  // }catch(e){
  //   return {
  //     rate:0,
  //     msg:JSON.stringify(e)
  //   }
  // }
}
