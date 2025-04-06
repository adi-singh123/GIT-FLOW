const mongoose = require("mongoose");
const {Schema}= require("mongoose");


const RepositorySchema = new Schema({
  name:{
    type:String,
    required:true,
    unique:true,
  },
  description:{
    type:String,

  },
  content:{
    type:String,
  },
  visibility:{
    type:Boolean,
  },
  owner:{
    type:Schema.Types.ObjectId,
    ref:"User",
    required:true,
  },
  issues:[{
    type:Schema.Types.ObjectId,
    ref:"Issued",
  }]
});

const Respository = mongoose.model("Repository",RepositorySchema);

export default Respository;