import send from '../config/mailconfig'
import moment from 'moment'
import jsonwebtoken from 'jsonwebtoken'
import { checkCode } from '../utils/common.js'
import UserModel from '../model/User.js'
import bcrypt from 'bcrypt'

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

      // 如果上一步正确，则验证该邮箱或昵称是否 存在
      let user = await UserModel.findOne({email:body.email})
      console.log(user);
      if(user==null){
        user = await UserModel.findOne({name:body.email})
        if(user==null){
          ctx.body = {
            code:200,
            msg:'该账号未注册'
          }
          return
        }
      }

      // 存在该账户，验证密码
      if(await bcrypt.compare(body.password,user.password)){
          checkUserDb = true
      }
      // 如果用户名、密码正确，则返回token
      if(checkUserDb){
        let userCopy = user.toJSON()

        // let token = jsonwebtoken.sign({_id:userCopy._id, exp:Math.floor(Date.now() / 1000) + 60 * 60 * 24},'abcd')
        let token = jsonwebtoken.sign({_id:userCopy._id}, 'abcd', { expiresIn: '1d' })

        const user_arr = ['password','reg_time','__v','_id']
        user_arr.map(i => {
          delete userCopy[i]
        })


        ctx.body = {
          code:200,
          data:{
            token:token,
            user:userCopy
          },
          err_msg:''
        }
      } else {
        ctx.body = {
          code: 404,
          data:{},
          err_msg: '用户名或密码错误'
        }
      }

    } else {
      // ctx.status =  401
      ctx.body = {
        code:401,
        data:{},
        err_msg:'验证码错误或过期'
      }
    }
  }

  async registry(ctx){
    // 获取前端传过来的数据
    const {body} = ctx.request
    // 使用checkCode验证图片验证码的准确性
    let sid = body.sid
    let code = body.code
    let checkCode_result = await checkCode(sid,code)

    // 验证邮箱/昵称有没有被使用过
    if(checkCode_result){
        let userEmail = await UserModel.findOne({email:body.email})
        if(userEmail != null){
          ctx.body = {
            code:200,
            errorMsg:'invalid email',
            msg: '邮箱已被注册'
          }
          return
        }

        let userName = await UserModel.findOne({name:body.name})
        if(userName != null){
          ctx.body = {
            code: 200,
            errorMsg:'invalid name',
            msg: '昵称已被使用'
          }
          return
        }

        // 将新数据写入数据库
        body.password = await bcrypt.hash(body.password,5)
        let newUser = new UserModel({
          email:body.email,
          name:body.name,
          password:body.password
        })
        let result = await newUser.save()
        ctx.body = {
          code:200,
          errorMsg:'',
          msg:'注册成功',
          data:result
        }
    } else {
      ctx.body = {
        code:401,
        msg: '验证码错误或过期'
      }
    }
}

}

export default new LoginController()
