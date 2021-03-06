"use strict";
import nodemailer from "nodemailer";
import { baseUrl_page } from '../utils/common.js'
// async..await is not allowed in global scope, must use a wrapper
async function send(sendInfo) {
  // Generate test SMTP service account from ethereal.email
  // Only needed if you don't have a real mail account for testing
  // let testAccount = await nodemailer.createTestAccount();

  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    host: "smtp.qq.com",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: '549521498@qq.com', // generated ethereal user
      pass: 'cxssbqctkhevbdha' // generated ethereal password
    }
  });

  let route = sendInfo.type == 'email'?'/email':'/reset'
  // let url = 'http://www.baidu.com'
  let url = `${baseUrl_page}${route}?key=${sendInfo.key}`
  let email_html = `  <div style="border: 1px solid #dcdcdc;color: #676767;width: 600px; margin: 0 auto; padding-bottom: 50px;position: relative;">
        <div style="height: 60px; background: #393d49; line-height: 60px; color: #58a36f; font-size: 18px;padding-left: 10px;">XXX官方邮件</div>
        <div style="padding: 25px">
          <div>您好，${sendInfo.user}童鞋，验证链接有效时间30分钟，请在${sendInfo.expire}之前验证你的邮箱：</div>
          <a href="${url}" style="padding: 10px 20px; color: #fff; background: #009e94; display: inline-block;margin: 15px 0;">立即验证邮箱</a>
          <div style="padding: 5px; background: #f2f2f2;">如果该邮件不是由你本人操作，请勿进行操作！</div>
        </div>
        <div style="background: #fafafa; color: #b4b4b4;text-align: center; line-height: 45px; height: 45px; position: absolute; left: 0; bottom: 0;width: 100%;">系统邮件，请勿直接回复</div>
    </div>`
  let reset_html = `  <div style="border: 1px solid #dcdcdc;color: #676767;width: 600px; margin: 0 auto; padding-bottom: 50px;position: relative;">
        <div style="height: 60px; background: #393d49; line-height: 60px; color: #58a36f; font-size: 18px;padding-left: 10px;">重置密码</div>
        <div style="padding: 25px">
          <div>您好，${sendInfo.user}童鞋，重置链接有效时间30分钟，请在${sendInfo.expire}之前重置您的密码：</div>
          <a href="${url}" style="padding: 10px 20px; color: #fff; background: #009e94; display: inline-block;margin: 15px 0;">立即重置密码</a>
          <div style="padding: 5px; background: #f2f2f2;">如果该邮件不是由你本人操作，请勿进行激活！否则你的邮箱将会被他人绑定。</div>
        </div>
        <div style="background: #fafafa; color: #b4b4b4;text-align: center; line-height: 45px; height: 45px; position: absolute; left: 0; bottom: 0;width: 100%;">系统邮件，请勿直接回复</div>
    </div>`
  let html = sendInfo.type == 'email'?email_html:reset_html

  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: '"认证邮寄" <549521498@qq.com>', // sender address
    to: sendInfo.email, // list of receivers
    subject: sendInfo.user!=""?`你好${sendInfo.user},查收认证邮件`:"查收认证邮件", // Subject line
    text: `你的验证码是${sendInfo.code},过期时间${sendInfo.expire}`, // plain text body
    html: html
  });


  // console.log("Message sent: %s", info.messageId);
  return  info.messageId
  // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

  // Preview only available when sending through an Ethereal account
  // console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
  // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
}

// main().catch(console.error);
export default send
