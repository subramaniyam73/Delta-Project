const socket=io();

const userid=document.querySelector("#userid").value;
const groupid=document.querySelector("#groupid").value;

const req=document.querySelector("#groupRequest");

req.addEventListener("click",(e)=>{
  socket.emit("groupInviteReq",{
    userid,
    groupid,
  });

  alert("Group Request sent !");
});
