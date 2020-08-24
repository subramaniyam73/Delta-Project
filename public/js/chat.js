const socket=io();

const chatid=document.querySelector("#chatid").value;
const sender=document.querySelector("#sender").value;
const personid=document.querySelector("#personid").value;

socket.emit("join",{
  chatid:chatid
});


document.querySelector("#chatForm").addEventListener("submit",(e)=>{
  e.preventDefault();
  let msg=e.target.elements.message.value;
  let time=new Date().toLocaleString();
  console.log(sender);
  socket.emit("message",{
    chatid:chatid,
    sender:sender,
    msg,
    time,
  });

});

socket.on("message",({msg,time,sender})=>{
  outputMessage1({
    msg,
    time,
    sender
  });
});

function outputMessage1({msg,time,sender}){
  let messageElem=document.createElement("div");
  // messageElem.style.class="userMessage";
  messageElem.innerHTML=`${msg}<br>${time}<br>    ${sender}`;
  document.querySelector(".messages").appendChild(messageElem);
}
