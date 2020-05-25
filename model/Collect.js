import mongoose from '../config/DB_handle.js'
import moment from 'moment'

const Schema = mongoose.Schema

const CollectSchema = new Schema({
  'tid':{type:String, ref:'articles'},
  'uid':{type:String, ref:'users'},
  'create_time':{type:Date}
})

CollectSchema.pre('save',function(next){
  this.create_time = moment().format('YYYY-MM-DD HH:mm:ss')
  next()
})

CollectSchema.static('get_collect_list',function(options,sort,page,limit){
  return this.find(options)
             .sort({[sort]:-1})
             .skip(page*limit)
             .limit(limit)
             .populate({
               path:'tid'
             })
})

const CollectModel = mongoose.model('collections',CollectSchema)

export default CollectModel
