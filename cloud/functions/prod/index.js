// 是否管理员
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})
// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  if(wxContext.OPENID === "ozttr5ZVt9086MKIFL_IxLL_F6ls" || wxContext.OPENID === "ozttr5bMRMdPmCt7RfPQDOoMcKOQ" ){
    return {
      manager: true,
      env: wxContext.ENV,
    }
  }
  return {
    manager: false,
    env: wxContext.ENV,
  }
}
