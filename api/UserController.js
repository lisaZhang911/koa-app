import { getJWT_token } from '../utils/common.js'
import { setValue,getValue } from '../config/RedisConfig.js'
import User_model from '../model/User.js'
import send from '../config/mailconfig'
import moment from 'moment'
import { v4 as uuidv4 } from 'uuid'
import jwt from 'jsonwebtoken'

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
          let count = user.count + 1
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
            await User_model.updateOne({_id:obj._id},{$set:{last_sign:moment().format("YYYY-MM-DD HH:mm:ss")},$inc:{score:score, count:1}})
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
            await User_model.updateOne(
                    {_id:obj._id},
                    {
                      $set:{count:1,last_sign:moment().format("YYYY-MM-DD HH:mm:ss")},
                      $inc:{score:5}
                    }
                  )
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

  async baseInfo_update(ctx){
    const {body} = ctx.request
    const obj = getJWT_token(ctx.header.authorization)

    const update_r = await User_model.updateOne({_id:obj._id},{$set:body})
    const user = await User_model.findById(obj._id)

    ctx.body = {
      code:200,
      err_msg:'',
      data:{
        result:'更新成功',
        data:{
          name:user.name,
          location:user.location,
          mark:user.mark,
          avar:user.avar
        }
      }
    }
  }

  async verify_mail(ctx){
    const obj = getJWT_token(ctx.header.authorization)
    const user = await User_model.findById(obj._id)
    const key = uuidv4()
    const {body} = ctx.request
    setValue(key,jwt.sign({_id:obj._id},'abcd',{expiresIn:'30m'}),3000)

    let result = await send({
        type:'email',
        key:key,
        code:'',
        expire: moment().add(30,'minutes').format('YYYY-MM-DD HH:mm:ss'),
        email: body.email,
        user: user.name
    })
    ctx.body = {
      code:200,
      err_msg:'',
      data:{ result:'邮寄发送成功' }
    }
  }

  async mail_update(ctx){
    const {body} = ctx.request
    const token = await getValue(body.key)
    const obj = getJWT_token('Bearer '+token)
    const confirm_exist = await User_model.findOne({email:body.email})

    if(confirm_exist == null){
      const result = await User_model.updateOne({_id:obj._id},{email:body.email})

      if(result.n == 1 && result.ok == 1){
        ctx.body = {
          code:200,
          err_msg:'',
          data:{result:'更新邮箱成功'}
        }
      } else {
        ctx.body = {
          code:200,
          err_msg:'',
          data:{result:'更新邮箱失败，稍后再试'}
        }
      }
    } else {
      ctx.body = {
        code:200,
        err_msg:'',
        data:{result:'该邮箱已注册'}
      }
    }
  }
}

export default new UserController()
