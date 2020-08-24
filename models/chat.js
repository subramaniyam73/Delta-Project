const mongoose = require('mongoose');

const chatSchema=new mongoose.Schema({

  members:[String],
  membersName:[String],
  messages:[{
    user:String,
    time:String,
    content:String,
    file:String
  }],
  time:String
});


const Chat=module.exports=new mongoose.model("chat",chatSchema);
