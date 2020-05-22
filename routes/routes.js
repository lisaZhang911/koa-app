import combineRouter from 'koa-combine-routers'
import publicRouter from './publicRouter'
import loginRouter from './loginRouter'
import userRouter from './userRouter'
import postRouter from './articleRouter'

 export default combineRouter(publicRouter,loginRouter,userRouter,postRouter)
