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


const app = new koa()
const isDevMode = process.env.NODE_ENV === 'production'?false:true

// app.use(helmet())
// app.use(statics(path.join(__dirname,'../public')))
//使用compse合并中间件，不然就要一个一个app.use()了，像上面那样
const middleware = compose([
  koaBody(),
  statics(path.join(__dirname,'../public')),
  cors(),
  jsonutil(),
  helmet()
])

if(!isDevMode){
  app.use(compress())
}
app.use(middleware)
app.use(router())


app.listen(3000)
