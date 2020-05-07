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


export {
  checkCode,
  getJWT_token
}
