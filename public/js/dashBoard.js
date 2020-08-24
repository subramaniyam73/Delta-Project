const socket=io();

$(".likeForm").on("submit",(e)=>{
  e.preventDefault();
  console.log(e.target);
  let {post,user,liked}=e.target.elements;
  post=post.value;
  user=user.value;
  liked=liked.value;
  if(liked=="false"){
    socket.emit("like",{
      post:post,
      user:user
    });
    console.log(e.target.elements.like);
    $(e.target.elements.like).addClass("liked");
    let likesSpan=$(e.target).parent().find(".likesNo");
    let likesNum=Number(likesSpan.text())+1;
    likesSpan.text(likesNum);
    e.target.elements.liked.value="true";
  }else{
    socket.emit("unLike",{
      post:post,
      user:user
    });
    $(e.target.elements.like).removeClass("liked");

    let likesSpan=$(e.target).parent().find(".likesNo");
    let likesNum=Number(likesSpan.text())-1;
    likesSpan.text(likesNum);
    e.target.elements.liked.value="false";
  }

});

$(".commentForm").on("submit",(e)=>{
  e.preventDefault();
  let {user,post,content,userName}=e.target.elements;
  user=user.value;
  post=post.value;
  content=content.value;
  userName=userName.value;

  let time=new Date().toLocaleString();

  socket.emit("addComment",{
    user,
    post,
    content,
    time,
    userName
  });

  let commentBox=`
  <div class="commentBox">
    <span>${userName}</span>-->
    <span>${content}</span>
    <span>   @${time}</span>
  </div>
  `;
  $(e.target).parent().find(".commentsBox").append(commentBox);

  let commentsSpan=$(e.target).parents(".postContainer").find(".commentsNo");
  let commentsNo=Number(commentsSpan.text())+1;
  commentsSpan.text(commentsNo);


});

$(".deleteComment").on("submit",(e)=>{
  e.preventDefault();
  socket.emit("deleteComment",{
    post:e.target.elements.post.value,
    comment:e.target.elements.comment.value
  });
  $(e.target).parent().toggle();

  let commentsSpan=$(e.target).parents(".postContainer").find(".commentsNo");
  let commentsNo=Number(commentsSpan.text())-1;
  commentsSpan.text(commentsNo);
});
