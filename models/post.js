const mongoose = require('mongoose');

const postSchema=new mongoose.Schema({
  date:Date,
  time:String,
  dateTime:String,
  type:String,
  font:String,
  color:String,
  followers:[String],
  friends:[String],
  content:String,
  creator:String,
  creatorName:String,
  group:String,
  likes:[String],
  comments:[{
    userName:String,
    user:String,
    content:String,
    time:String,
    profilePicture:String
  }],

  file:String,

});

const Post=module.exports=new mongoose.model("post",postSchema);

// deadlineString:String,
// header:String,
// body:String,
// footer:String,
// filename:String,
// objectFit:String,
// members:[{
//   username:String,
//   extraNumber:Number,
//   foodPreferences:String,
//   comments:String
// }],
// membersList:[String],
// naList:[String],
// aList:[String],
// host:String,
// hostMail:String,
// colorValue:String,
// fontValue:String,
// private:String,
// authorized:[String],
// template:{
//   name:String,
//   name2:String,
//   address:String,
//   date2:Date,
//   date2String:String,
//   otherDetails:String
// },
// type:String


// const Event=module.exports=new mongoose.model("event",eventSchema);
