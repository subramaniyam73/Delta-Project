const mongoose = require('mongoose');
const passportLocalMongoose = require("passport-local-mongoose");
const findOrCreate=require("mongoose-findorcreate");
const Post=require("../models/post.js");
const postSchema=Post.schema;

const userSchema = new mongoose.Schema ({
  username: String,
  password: String,
  name:String,
  birthDay:String,
  posts:[postSchema],
  friends:[String],
  followers:[String],
  following:[String],
  groups:[String],
  googleId: String,
  refreshToken: String,
  accessToken: String,
  image:Boolean,
  privacy:String,
  sent:{
    groupRequests:[String],
    // groupInvites:[String],
    friendRequests:[String]
  },
  received:{
    groupRequests:[String],
    groupInvites:[String],
    friendRequests:[String]
  },
  notifications:[{
    message:String,
    link:String
  }],
  bio:String,
  relStatus:String,
  familyMembers:[String],
  work:{
    cur:Boolean,
    pos:String,
    org:String,
    from:String,
    to:String
  },
  college:{
    cur:Boolean,
    deg:String,
    org:String,
    from:String,
    to:String
  },
  school:{
    cur:Boolean,
    org:String,
    from:String,
    to:String,
  },
  contact:{
    website:String,
    email:String,
  },
  places:[String],
  interests:[String],
  profilePicture:String,
  coverPicture:String

  // friendRequests:[{
  //   from:String,
  //   fromName:String
  // }],
  // friendAccepts:[{
  //   from:String,
  //   fromName:String
  // }],
  // groupRequests:[{
  //   from:String,
  //   fromName:String,
  //   group:String,
  //   groupName:String
  // }],
  // groupInvites:[{
  //   from:String,
  //   fromName:String,
  //   group:String,
  //   groupName:String
  // }],
  // groupInviteAccepts:[{
  //   from:String,
  //   fromName:String,
  //   group:String,
  //   groupName:String
  // }],
  // groupRequestAccepts:[{
  //   from:String,
  //   fromName:String,
  //   group:String,
  //   groupName:String
  // }],
  // messages:[{
  //   from:String,
  //   fromName:String,
  //   msg:String,
  //   chatid:String
  // }],
  //
  // sentFR:[String],
  // recFR:[String],
  // sentGR:[String],
  // recGR:[String],

  // events:[eventSchema],
  // otherEvents:[eventSchema],
  // invitedEvents:[eventSchema],
  // notification:{
  //   status:Number,
  //   accepted:[{
  //     username:String,
  //     eventId:String
  //   }],
  //   requests:[{
  //     username:String,
  //     eventId:String
  //   }]
  // }
});
userSchema.plugin(passportLocalMongoose);
userSchema.plugin(findOrCreate);

const User=module.exports=new mongoose.model("user",userSchema);
