// 计算总评分
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  // try{
    const db = cloud.database();
    const rateList = await db.collection('rates').orderBy('date', 'desc').get();
    const avarage = rateList.data.reduce((pre,cur)=>{
      return pre+(cur.rate||0)
    },0)
    return {rate:(avarage/(rateList.data.length||1) * 20).toFixed(2)}
  // }catch(e){
  //   return {
  //     rate:0,
  //     msg:JSON.stringify(e)
  //   }
  // }
}
