import mongoose from '../config/DB_handle.js'
import moment from 'moment'

const Schema = mongoose.Schema

const SignSchema = new Schema({
  'uid':{type: String, ref:'users'},
  'created_time':{type:Date},
  'score':{type:Number},
  'last_sign':{type:Date}
})


SignSchema.pre('save', function(next){
  console.log('schemaThis',this);
  this.created_time = moment().format('YYYY-MM-DD HH:mm:ss')
  next()
})

SignSchema.statics = {
  findByUid: function(uid){
    return this.findOne({uid: uid}).sort({created_time:-1})
  }
}

const SignModel = mongoose.model('sign_record',SignSchema)



export default SignModel
