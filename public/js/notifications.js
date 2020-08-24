const socket=io();


$(".deleteForm").on("submit",(e)=>{
  console.log(e.target.elements.noti.value);
  e.preventDefault();
  socket.emit("deleteItem",{
    user:e.target.elements.user.value,
    noti:e.target.elements.noti.value
  });
  $(e.target).parents(".notificationBox").toggle();
  let notNumber=Number($(".notificationLi").text());
  $(".notificationLi").text(notNumber-1);

});
