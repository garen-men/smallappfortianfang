// 得到通用信息
const cloud = require('./node_modules/wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  const db = cloud.database();
  const { id } = event;
  const idField = db.collection('suggestions').doc(id);
  try {
    await idField.get()
    await idField.remove();
    return {
      msg: '删除成功请刷新'
    }

  } catch{
    return {
      msg:'数据已经删除了'
    }
  }

  
}
