import { getJWT_token } from '../utils/common.js'
// import SignRecord_model from '../model/SignRecord.js'
import User_model from '../model/User.js'
import moment from 'moment'

class UserController {
  constructor(){}
  async sign(ctx){
    let last_sign = ''
    let today = moment().format("YYYY-MM-DD")
    let result = {}
    // 1、获取用户ID
    const obj = await getJWT_token(ctx.header.authorization)
    // 2、查询上一次签到时间
    const user = await User_model.findById(obj._id)
    last_sign = user.last_sign


    if(last_sign == undefined){
      // 第一次签到
       await User_model.updateOne({_id:obj._id},{$set:{last_sign:moment().format("YYYY-MM-DD HH:mm:ss")},$inc: {count:1,score:5}})
       ctx.body = {
         code:200,
         err_msg:'',
         data:{
           result:'签到成功',
           count:1,
           score:5
         }
       }
    } else {
      last_sign = moment(last_sign).format("YYYY-MM-DD")
      // 非第一次签到。判断是否连续签到，是否已签到
      console.log(last_sign == today);

      if(last_sign == today){
         //今天已签到
        ctx.body = {
          code:200,
          err_msg:'',
          data:{
            result:'重复签到',
            count:user.count,
            score:user.score
          }
        }
      } else if(last_sign == moment().subtract(1,'days').format('YYYY-MM-DD')){
        // 连续签到
          let count = user.count
          let score = 0

            if(count < 5){
              score = 5
            } else if(count >=5 && count <15){
              score = 10
            } else if(count >=15 && count <30){
              score = 15
            } else if(count >= 30 && count <100){
              score = 20
            } else if(count >= 100 && count <365){
              score = 30
            } else {
              score = 50
            }
            await User_model.updateOne({_id:obj._id},{$inc:{score:score, count:1}})
            ctx.body = {
              code:200,
              err_msg:'',
              data:{
                result:'签到成功',
                count:user.count,
                score:user.score
              }
            }
        } else {
            // 非连续签到
            await User_model.updateOne({_id:obj._id},{$set:{count:1},$inc:{score:5}})
            ctx.body = {
              code:200,
              err_msg:'',
              data:{
                result:'签到成功',
                count:user.count,
                score:user.score
              }
            }
          }
        }
    }
}

export default new UserController()
