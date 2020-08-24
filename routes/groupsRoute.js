const express= require('express');
const router = express.Router();
const Post=require('../models/post');
const User=require('../models/user');
const Chat=require("../models/chat");
const Group=require("../models/group");

router.get("/create",(req,res)=>{
  if(req.isAuthenticated()){
    User.find({}).sort({name:1}).exec((err,users)=>{
      User.findById(req.user._id,(err,foundUser)=>{
        res.render("createGroup",{users:users,logged:foundUser});

      });
    });
  }else{
    res.redirect("/");
  }
});



router.get("/",(req,res)=>{
  if(req.isAuthenticated()){
    Group.find({}).sort({time:-1}).exec((err,groups)=>{
      User.findById(req.user._id,(err,foundUser)=>{
        res.render("allGroups",{groups:groups,user:foundUser});

      });
    });
  }
  else{
    res.redirect("/");
  }
});

router.get("/myGroups",(req,res)=>{
  if(req.isAuthenticated()){
    Group.find({members:{$in:req.user._id}}).sort({name:1}).exec((err,groups)=>{
      User.findById(req.user._id,(err,foundUser)=>{
        Group.find({admin:req.user._id}).sort({name:1}).exec((err,myGroups)=>{
          console.log(myGroups);
          res.render("myGroups",{groups:groups,user:foundUser,myGroups:myGroups});
        });

      });
    });

  }else{
    res.redirect("/");
  }
});

// router.get("/allGroups",(req,res)=>{
//   if(req.isAuthenticated()){
//     Group.find({}).sort({name:-1}).exec((err,groups)=>{
//       res.render("allGroups",{groups:groups});
//     });
//   }else{
//     res.redirect("/");
//   }
// });

router.get("/:id",(req,res)=>{
  if(req.isAuthenticated()){
    console.log(req.params.id);
    Group.findById(req.params.id,(err,groupResult)=>{
      Post.find({group:req.params.id},(err,posts)=>{
        User.findById(req.user._id,(err,foundUser)=>{
          res.render("group",{posts:posts,group:groupResult,creator:req.user._id,user:foundUser});

        });
      });
    });
  }
  else{
    res.redirect("/");
  }
});


router.post("/createGroup",(req,res)=>{
  if(req.isAuthenticated()){
    let {name,description,members,privacy}=req.body;
    let group=new Group({
      name:name,
      description:description,
      privacy:privacy,
      admin:req.user._id,
      adminName:req.user.name,
      members:[]
    });
    group.save();

    members.forEach((member)=>{
      // User.findByIdAndUpdate(member,
      //   {$push:{groupInvites:{from:req.user._id,fromName:req.user.name,group:group._id,groupName:group.name}},$push:{recGR:group._id}},
      //   (err)=>{console.log(err);}
      // );
      User.findById(member,(err,user2)=>{
        user2.received.groupInvites.push(group._id);
        user2.notifications.push({
          message:`${req.user.name} invited you to his group`,
          link:`http://localhost:3000/groups/${group._id}`
        });
        user2.save();
      });
      User.findById(req.user._id,(err,user1)=>{
        user1.sent.groupInvites.push(group._id);
      });
      // User.findById(member,(err,foundUser)=>{
      //   foundUser.groupInvites.push({
      //     from:req.user._id,
      //     fromName:req.user.name,
      //     group:group._id,
      //     groupName:group.name
      //   });
      //   foundUser.save();
      // });
    });

    res.redirect("/groups/myGroups");
  }else{
    res.redirect("/");
  }
});


router.post("/createGroupPost",(req,res)=>{
  if(req.isAuthenticated()){
    let {mytextarea,groupid,creator}=req.body;
    let post=new Post({
      content:mytextarea,
      group:groupid,
      time:new Date().toLocaleString(),
      creator:creator
    });
    post.save().then(res.redirect("/groups/"+groupid)).catch(res.status(400));


  }else{
    res.redirect("/");
  }
});


router.post("/:id/request",(req,res)=>{
  if(req.isAuthenticted()){
    Group.findById(req.params.id,(err,group)=>{
      User.findById(req.user._id,(err,foundUser)=>{
        foundUser.sent.groupRequests.push(req.params.id);
        foundUser.save();
        User.findById(group.admin,(err,adminUser)=>{
          adminUser.received.groupRequests.push(req.params.id);
          adminUser.notifications.push({
            message:`${req.user.name} has requested to join your group`,
            link:`http://localhost:3000/users/${req.user._id}`
          });
          adminUser.save();
        });
      });
    });
    res.render("message",{message:"Group request sent successfully"});
  }else{
    res.redirect("/");
  }
});

router.post("/:id/accept",(req,res)=>{
  if(req.isAuthenticted()){
    Group.findById(req.params.id,(err,group)=>{
      group.members.push(req.user._id);
      group.save();
      User.findById(group.admin,(err,adminUser)=>{
        adminUser.notifications.push({
          message:`${req.user.name} accepted you group invite`,
          link:`http://localhost:3000/users/${req.user._id}`
        });
        adminUser.save();
      });
      User.findOneAndUpdate({_id:group.admin},
        {sent:{$pull:{groupInvites:group._id}}},
        ()=>{}
      });
      User.findOneAndUpdate({_id:req.user._id},
        {received:{$pull:{groupInvites:req.params.id}}},
        ()=>{}
      );
    });

    res.render("message",{message:"Group invite accepted successfully"});

  }else{
    res.redirect("/");
  }
});


router.post("/:id/reject",(req,res)=>{
  if(req.isAuthenticted()){
    Group.findById(req.params.id,(err,group)=>{

      User.findOneAndUpdate({_id:group.admin},
        {sent:{$pull:{groupInvites:group._id}}},
        ()=>{}
      });
      User.findOneAndUpdate({_id:req.user._id},
        {received:{$pull:{groupInvites:req.params.id}}},
        ()=>{}
      );
    });

    res.render("message",{message:"Group invite rejected successfully"});

  }else{
    res.redirect("/");
  }
});




module.exports = router;
