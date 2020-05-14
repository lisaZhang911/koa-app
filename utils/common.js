import { getValue } from '../config/RedisConfig.js'
import jwt from 'jsonwebtoken'

const checkCode = async (key,value) => {
  const redisData = await getValue(key)
  if(redisData != null){
    if(redisData.toLowerCase() == value.toLowerCase()){
      return true
    } else {
      return false
    }
  } else {
    return false
  }
}

const getJWT_token = (token) => {
  return jwt.verify(token.split(' ')[1], 'abcd')
}

const baseUrl = process.env.NODE_ENV == 'production' ? 'http://www.imooc.com':'http://localhost:3000'
const baseUrl_page = process.env.NODE_ENV == 'production' ? 'http://www.imooc.com':'http://localhost:8080/#'


export {
  checkCode,
  getJWT_token,
  baseUrl,
  baseUrl_page
}
