import mongoose from '../config/DB_handle.js'
import moment from 'moment'

const Schema = mongoose.Schema

const UserSchema = new Schema({
  'email':{type:String},
  'name':{type: String},
  'password':{type:String},
  'reg_time':{type:Date},
  'score':{type:Number, default:0},
  'gender':{type:String},
  'roles':{type:Array, default:[1]},
  'avar':{type:String, default:'/img/header.jpeg'},
  'mobile':{type:String, match:/^1[3,5,7,8,9](\d{9})$/},
  'status':{type:String, default:'1'},
  'mark':{type:String},
  'last_sign':{type:Date},
  'location':{type:String},
  'isVip':{type:Number, default:0},
  'count':{type:Number, default:0}
})

UserSchema.pre('save', function(next){
  this.reg_time = moment().format('YYYY-MM-DD hh:mm:ss')
  next()
})
UserSchema.static('findById',function(id){
  // console.log(this);
  return this.findOne({_id:id},{
    password:0,
    email:0,
    mobile:0
  })
})

const UserModel = mongoose.model('users',UserSchema)

export default UserModel
