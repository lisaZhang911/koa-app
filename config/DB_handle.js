import mongoose from 'mongoose'

const DB_URL = 'mongodb://test:123456abc@49.233.85.47:27017/testdb'

mongoose.connect(DB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})

mongoose.connection.on('connected',() => {
  console.log('连接成功。位置：'+ DB_URL);
})

mongoose.connection.on('error',(error) => {
  console.log('连接错误:'+error);
})

mongoose.connection.on('disconnected', () => {
  console.log('链接断开');
})

export default mongoose
