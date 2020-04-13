import redis from 'redis'
const { promisify } = require('util')

const options = {
  host:'49.233.85.47',
  port:15001,
  password:'123456abc',
  detect_buffers:true,
  retry_strategy: function(options) {
    if (options.error && options.error.code === "ECONNREFUSED") {
      // End reconnecting on a specific error and flush all commands with
      // a individual error
      return new Error("The server refused the connection");
    }
    if (options.total_retry_time > 1000 * 60 * 60) {
      // End reconnecting after a specific timeout and flush all commands
      // with a individual error
      return new Error("Retry time exhausted");
    }
    if (options.attempt > 10) {
      // End reconnecting with built in error
      return undefined;
    }
    // reconnect after
    return Math.min(options.attempt * 100, 3000);
  }
}

const client = redis.createClient(options)

const setValue = (key,value,time) => {
  if(typeof value == undefined || value == null || value == ''){
    return
  }
  if(typeof value == 'string'){
    if(typeof time !== undefined){
      client.set(key, value, 'EX', time)
    } else {
      client.set(key,value)
    }
  } else if(typeof value == 'object'){
    Object.keys(value).forEach(i => {
      client.hset(key, i, value(i), redis.print)
    })
  }
}

const getAsync = promisify(client.get).bind(client)

const getValue = (key) => {
  return getAsync(key)
}

export {
  client,
  getValue,
  setValue
}
