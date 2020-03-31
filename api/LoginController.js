import send from '../config/mailconfig'
import moment from 'moment'

class LoginController {
  constructor(){}
  async forget(ctx){
    const { body } = ctx.request
    console.log(body);
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
}
// code:'1234',
// expire: '2020-10-01',
// email: '549521498@qq.com',
// user: 'myrcella'
export default new LoginController()
