import koa from 'koa'
import path from 'path'
import helmet from 'koa-helmet'
import statics from 'koa-static'
import router from './routes/routes'
import koaBody from 'koa-body'
import jsonutil from 'koa-json'
import cors from '@koa/cors'
import compose from 'koa-compose'
import compress from 'koa-compress'
import koaJwt from 'koa-jwt'


const app = new koa()
const isDevMode = process.env.NODE_ENV === 'production'?false:true

const jwt = koaJwt({secret:'abcd'}).unless({path:[/^\/public/,/^\/login/,/^\/reg/,/^\/forget/]})

const errorHandle = (ctx, next) => {
  return next().catch((err) => {
    if (401 == err.status) {
      ctx.status = 401;
      ctx.body = {
        code:401,
        msg:'Protected resource, use Authorization header to get access\n'
      }
    } else {
      console.log('errorapp');
      ctx.status = err.status || 500
      ctx.body = {
        code:500,
        msg:err.message
      }
    }
  })
}
// app.use(helmet())
// app.use(statics(path.join(__dirname,'../public')))
//使用compse合并中间件，不然就要一个一个app.use()了，像上面那样
const middleware = compose([
  koaBody(),
  statics(path.join(__dirname,'../public')),
  cors(),
  jsonutil(),
  helmet(),
  errorHandle,
  jwt
])

if(!isDevMode){
  app.use(compress())
}
app.use(middleware)
app.use(router())


app.listen(3000)
