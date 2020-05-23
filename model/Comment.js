import mongoose from '../config/DB_handle.js'
import moment from 'moment'

const Schema = mongoose.Schema

const CommentSchema = new Schema({
  'uid':{type:String, ref:'users'},
  'tid':{type:String, ref:'articles'},
  'content':{type:String},
  'create_time':{type:Date},
  'good_count':{type:Number,default:0},
  'isBest':{type:String,default:'0'},
  'create_time':{type:Date}
})

CommentSchema.pre('save',function(next){
  this.create_time = moment().format('YYYY-MM-DD HH:mm:ss')
  next()
})

CommentSchema.static('getCommentList',function(option,page,limit){
  return this.find(option)
             .skip(page*limit)
             .limit(limit)
             .populate({
               path:'uid',
               select:'name isVip avar'
             })
})

CommentSchema.static('comment_list_quality',function(tid){
  return this.find({tid:tid}).countDocuments()
})

const CommentModel = mongoose.model('comments',CommentSchema)

export default CommentModel
