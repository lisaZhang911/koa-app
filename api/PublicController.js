import svgCap from 'svg-captcha'
import { setValue } from '../config/RedisConfig.js'

class PublicController {
  constructor(){}
  async getCaptcha(ctx){
    const body = ctx.request.query
    const newCaptcha = svgCap.create({})
    ctx.body = {
      code:200,
      data:newCaptcha.data,
      err_msg:''
    }
    setValue(body.sid, newCaptcha.text, 300)
  }
}

export default new PublicController()
