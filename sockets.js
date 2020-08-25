const Post=require("./models/post");
const Chat=require("./models/chat");
const User = require("./models/user");
// const Group=require("./models/group");


//sockets code to get io and work with it
module.exports = function(io) {
  io.on("connection", (socket) => {

    socket.on("join",({chatid})=>{
      socket.join(chatid);
    });

    socket.on("message",({chatid,msg,time,sender})=>{

      Chat.findById(chatid,(err,resultChat)=>{
        resultChat.messages.push({
          user:sender,
          content:msg,
          time:time
        });
        resultChat.save();
      });

      io.to(chatid).emit("message",{
        msg,
        time,
        sender:sender
      });
    });

    socket.on("request",({from,to})=>{
      console.log(from);
      console.log(to);
      User.findById(from,(err,fromUser)=>{
        User.findById(to,(err,toUser)=>{
          toUser.notifications.push({
            message:`${fromUser.name} Sent you a Friend Request`,
            time:new Date().toLocaleString(),
            val1:from,
            val2:to,
            mode:"acceptFriendRequest"
          });
          toUser.save();
        });
      });
    });

    socket.on("like",({post,user})=>{
      Post.findById(post,(err,resultPost)=>{
        resultPost.likes.push(user);
        resultPost.save();

      });
    });

    socket.on("unLike",({post,user})=>{
      Post.findOneAndUpdate({_id:post},
        {$pull:{likes:user}},
        ()=>{}
      );
    });

    socket.on("addComment",({user,post,content,userName,profilePicture})=>{
      Post.findById(post,(err,resultPost)=>{
        resultPost.comments.push({
          user:user,
          userName:userName,
          content:content,
          time:new Date().toLocaleString(),
          profilePicture
        });
        resultPost.save();
      });
    });

    socket.on("deleteComment",({comment,post})=>{
      Post.findOneAndUpdate({_id:post},
        {$pull:{comments:{_id:comment}}},
        ()=>{}
      );
    });

    socket.on("deleteItem",({user,noti})=>{
      console.log(user,noti);
      User.findOneAndUpdate({_id:user},
        {$pull:{notifications:{_id:noti}}},
        ()=>{}
      );
    });


    // socket.on("acceptFriendRequest",({val1,val2,val3})=>{
    //   User.findById(val1,(err,user1)=>{
    //     user1.friends.push(val2);
    //     user1.save();
    //   });
    //   User.findById(val2,(err,user2)=>{
    //     user2.friends.push(val1);
    //     user2.save();
    //   });
    // });
    //
    // socket.on("acceptGroupInvite",({val1,val2,val3})=>{
    //   User.findById(val1,(err,user1)=>{
    //     user1.groups.push(val2);
    //     user1.save();
    //   });
    //   Group.findById(val2,(err,group)=>{
    //     group.members.push(val1);
    //     group.save();
    //   });
    // });
    //
    // socket.on("acceptGroupRequest",({val1,val2,val3})=>{
    //
    //   User.findById(val1,(err,user2)=>{
    //     user2.groups.push(val2);
    //     user2.save();
    //   });
    //   Group.findById(val2,(err,group)=>{
    //     group.members.push(val1);
    //     group.save();
    //   });
    //
    // });
    //
    // socket.on("groupInviteReq",({userid,groupid})=>{
    //   Group.findById(groupid,(err,foundGroup)=>{
    //     User.findById(foundGroup.admin,(err,foundUser)=>{
    //       User.findById(userid,(err,user2)=>{
    //         foundUser.notifications.push({
    //           mode:"acceptGroupRequest",
    //           val1:id,
    //           val2:groupid,
    //           message:`${foundUser.name} has Requested to join your Group !`,
    //           time:new Date().toLocaleString()
    //         });
    //         foundUser.save();
    //       });
    //     });
    //   });
    // });



  });

}
