const express= require('express');
const router = express.Router();
const Post=require('../models/post');
const User=require('../models/user');
const mongoose=require("mongoose");

const crypto = require("crypto");
const path = require("path");
const multer = require("multer");
const GridFsStorage = require("multer-gridfs-storage");
const mongoURI = "mongodb://localhost:27017/imagesDB";
const conn = mongoose.createConnection(mongoURI, {
  useUnifiedTopology: true,
  useNewUrlParser: true

});
var gfs;
conn.once("open", () => {
  gfs = new mongoose.mongo.GridFSBucket(conn.db, {
    bucketName: "uploads"
  });
});
const storage = new GridFsStorage({
  url: mongoURI,
  file: (req, file) => {
    return new Promise((resolve, reject) => {
      crypto.randomBytes(16, (err, buf) => {
        if (err) {
          return reject(err);
        }
        const filename = buf.toString("hex") + path.extname(file.originalname);
        const fileInfo = {
          filename: filename,
          bucketName: "uploads"
        };
        resolve(fileInfo);
      });
    });
  }
});
const upload = multer({
  storage
});


router.get("/",(req,res)=>{
  res.render("home");
});

router.get("/dashBoard", function(req, res){
    if (req.isAuthenticated()){
      // {$or:[{friends:{$in:req.user._id}},{creator:req.user._id}]}
      Post.find({friends:{$in:req.user._id}}).sort({_id:-1}).exec((err,result)=>{
        User.findById(req.user._id,(err,foundUser)=>{
          res.render("dashBoard",{posts:result,user:foundUser});
        });
      });
    }
    else {
      res.redirect("/");
    }
});

// router.get("/allUsers",(req,res)=>{
//   if(req.isAuthenticated()){
//     User.find({}).sort({name:-1}).exec((err,result)=>{
//       res.render("allUsers",{users:result});
//     });
//   }
//   else{
//     res.redirect("/");
//   }
// });

// router.get("/notifications",(req,res)=>{
//   if(req.isAuthenticated()){
//     User.findById(req.user._id,(err,userResult)=>{
//       res.render("notifications",{notifications:userResult.notifications});
//     });
//   }
//   else{
//     res.redirect("/");
//   }
// });

router.get("/addPost",(req,res)=>{
  if(req.isAuthenticated()){
    User.findById(req.user._id,(err,foundUser)=>{
      res.render("addPost",{user:foundUser});
    });
  }
  else{
    res.redirect("/");
  }
});

router.get("/notifications",(req,res)=>{
  if(req.isAuthenticated()){
    User.findById(req.user._id,(err,userResult)=>{
      res.render("notifications",{notifications:userResult.notifications.reverse(),user:userResult});
    });
  }
  else{
    res.redirect("/");
  }
});

router.post("/createPost",upload.single("file"),(req,res)=>{
  if(req.isAuthenticated()){
    console.log(req.body);

    User.findById(req.user._id,(err,foundUser)=>{
      let post=new Post({
        content:req.body.mytextarea,
        creator:req.user._id,
        creatorName:foundUser.name,
        time:new Date().toLocaleString(),
        friends:[],
        file:req.file.filename
      });
      console.log(foundUser.friends);
      foundUser.friends.forEach((friend)=>{
        post.friends.push(friend);
      });

      post.save();
    });


    res.redirect("/dashBoard");
  }else{
    res.status(400);
  }


});

// router.post("/imageMessage",upload.single("file"),(req,res)=>{
//   if(req.isAuthenticated()){
//     Chat.findById(req.body.chat,(err,resultChat)=>{
//       resultChat.messages.push({
//         file:req.file.filename,
//         user:req.body.user,
//         time:new Date().toLocaleString(),
//         content:""
//       });
//       resultChat.save();
//     });
//
//     res.redirect("/chats/"+req.body.chat);
//   }else{
//     res.redirect("/");
//   }
// });

router.post("/clearNotifications",(req,res)=>{
  if(req.isAuthenticated()){
    User.findById(req.user._id,(err,user)=>{
      user.notifications=[];
      user.received.friendRequests=[];
      user.sent.friendRequests=[];
      user.save();

      res.redirect("/notifications");
    })
  }
});


//all images are stored here and their filenames are stored in database for calling them
router.get("/images/:filename", (req, res) => {
  const file = gfs
    .find({
      filename: req.params.filename
    })
    .toArray((err, files) => {
      if (!files || files.length === 0) {
        return res.status(404).json({
          err: "no files exist"
        });
      }
        gfs.openDownloadStreamByName(req.params.filename).pipe(res);
    });
});

router.post("/images/profileImages/:id",upload.single("file"),(req,res)=>{
  if(req.isAuthenticated()&&req.user._id==req.params.id){
    User.findById(req.user._id,(err,resultUser)=>{
      if(req.body.type=="profile"){
        resultUser.profilePicture=req.file.filename;
        resultUser.save();
        res.render("message",{message:"Profile picture has been updated"});
      }else{
        resultUser.coverPicture=req.file.filename;
        resultUser.save();
        res.render("message",{message:"Cover picture has been updated"});

      }

    });

  }else{
    res.redirect("/");
  }
});


module.exports = router;
