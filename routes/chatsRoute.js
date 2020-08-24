const express= require('express');
const router = express.Router();
const Post=require('../models/post');
const User=require('../models/user');
const Chat=require("../models/chat");
const Message=require("../models/chat");

router.get("/:id",(req,res)=>{
  if(req.isAuthenticated()){
    Chat.findById(req.params.id,(err,chat)=>{
      if(chat.members.includes(req.user._id)){
        Chat.findById(req.params.id,(err,result)=>{
          console.log(result);
          let members=result.members;let personId;
          members.forEach((member)=>{
            if(member!==req.user._id){
              personId=member;
            }
          });
          User.findById(personId,(err,person)=>{
            User.findById(req.user._id,(err,user)=>{
              res.render("chatPage",{person:person,chat:result,user:user});
            });
          });
        });
      }
      else{
        res.redirect("/dashBoard");
      }
    });
  }
  else{
    res.redirect("../");
  }
});

router.get("/",(req,res)=>{
  if(req.isAuthenticated()){
    Chat.find({members:{$in:req.user._id}}).sort({time:-1}).exec((err,chats)=>{
      User.findById(req.user._id,(err,foundUser)=>{
        res.render("allChats",{chats:chats,user:foundUser});

      });
    });
  }
  else{
    res.redirect("/");
  }
});

router.post("/createChat",(req,res)=>{
  if(req.isAuthenticated()){

    Chat.findOne({members:{$all:[req.user._id,req.body.to]}},(err,foundChat)=>{
      if(!foundChat){
        let chat=new Chat({
          members:[req.body.logged,req.body.to],
          membersName:[req.user.name,req.body.toName],
          time:new Date().toLocaleString()
        });

        chat.save();

        res.redirect(`/chats/${chat.id}`);
      }else{
        res.redirect(`/chats/${foundChat.id}`)
      }
    });

  }else{
    res.redirect("/");
  }
});


module.exports = router;
