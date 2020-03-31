import svgCap from 'svg-captcha'

class PublicController {
  constructor(){}
  async getCaptcha(ctx){
    const newCaptcha = svgCap.create({})
    ctx.body = {
      code:200,
      data:newCaptcha.data
    }
  }
}

export default new PublicController()
