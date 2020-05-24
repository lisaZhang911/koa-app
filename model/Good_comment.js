import mongoose from '../config/DB_handle.js'
import moment from 'moment'

const Schema = mongoose.Schema

const GoodSchema = new Schema({
  'uid':{type:String, ref:'users'},
  'cid':{type:String, ref:'comments'},
  'create_time':{type:Date}
})

GoodSchema.pre('save',function(next){
  this.create_time = moment().format('YYYY-MM-DD HH:mm:ss')
  next()
})


const GoodModel = mongoose.model('good_comments',GoodSchema)

export default GoodModel
