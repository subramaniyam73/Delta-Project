const mongoose = require('mongoose');
const Post=require("./post");
const postSchema=Post.schema;

const groupSchema=new mongoose.Schema({
  name:String,
  description:String,
  members:[String],
  posts:[postSchema],
  privacy:String,
  admin:String,
  adminName:String,
  image:Boolean
});


const Group=module.exports=new mongoose.model("group",groupSchema);
