import send from '../config/mailconfig'
import moment from 'moment'
import jsonwebtoken from 'jsonwebtoken'
import { checkCode } from '../utils/common.js'
import UserModel from '../model/User.js'

class LoginController {
  constructor(){}
  async forget(ctx){
    const { body } = ctx.request
    let result = await send({
        code:'1234',
        expire: moment().add(5,'minutes').format('YYYY-MM-DD HH:mm:ss'),
        email: body.name,
        user: 'myrcella'
    })
    ctx.body = {
      code: 200,
      data: result,
      msg: '邮件发送成功'
    }
  }

  async login(ctx){
    // 获取前端传过来的数据
    const {body} = ctx.request
    let sid = body.sid
    let code = body.code
    let checkCode_result = await checkCode(sid,code)

    // 使用checkCode验证图片验证码的准确性
    if(checkCode_result){
      let checkUserDb = false

      // 如果上一步正确，则验证用户名、密码是否统一
      let user = await UserModel.findOne({name:body.username})
      if(user.password == body.password){
        checkUserDb = true
      }
      // 如果用户名、密码正确，则返回token
      if(checkUserDb){
        let token = jsonwebtoken.sign({_id:'lisa', exp:Math.floor(Date.now() / 1000) + 60 * 60 * 24},'abcd')
        ctx.body = {
          code:200,
          token: token
        }
      } else {
        ctx.body = {
          code: 404,
          msg: '用户名或密码错误'
        }
      }

    } else {
      ctx.status =  401
      ctx.body = {
        code:401,
        msg:'验证码错误'
      }
    }
  }
}

export default new LoginController()
