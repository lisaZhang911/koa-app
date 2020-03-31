import combineRouter from 'koa-combine-routers'
import publicRouter from './publicRouter'
import loginRouter from './loginRouter'

 export default combineRouter(publicRouter,loginRouter)
