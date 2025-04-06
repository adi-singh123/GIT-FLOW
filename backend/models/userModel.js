const mongoose = require("mongoose");
const {Schema}= require("mongoose");

const UserSchema = new Schema({
  username:{
    type:String,
    required:true,
    unique:true,
  },
  email:{
    type:String,
    required:true,
    unique:true,
  },
  password:{
    Type:String,
  },
  repositories:{
    default:[],
    type:Schema.Types.ObjectId,
    ref:"Repository",

  },
  followedUsers:[{
    default:[],
    type:Schema.Types.ObjectId,
    ref:"Users",
  }],
  stared:[{
    default:[],
    type:Schema.Types.ObjectId,
    ref:"Respository",
  }],
});

const User =mongoose.model("User",UserSchema);

export default User;