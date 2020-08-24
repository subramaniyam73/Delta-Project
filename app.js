//jshint esversion:6
const ejs=require("ejs");
const bodyParser=require("body-parser");
const express=require("express");
const mongoose=require("mongoose");
const session = require('express-session');
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");
const fs=require("fs");
const socket = require("socket.io");

const authenticationRoute=require("./routes/authentication.js");
const homeRoute=require("./routes/homeRoute.js");
const chatsRoute=require("./routes/chatsRoute.js");
const usersRoute=require("./routes/usersRoute.js");
// const groupsRoute=require("./routes/groupsRoute.js");
// const searchRoute=require("./routes/searchRoute.js");

const app=express();

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));
app.use(express.json());
app.set('view engine', 'ejs');

app.use(session({
  secret: "My little secret.This can be any string.Check documentation!",
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

mongoose.connect("mongodb://localhost:27017/facebookDB",{ useNewUrlParser: true,useUnifiedTopology: true });
mongoose.set("useCreateIndex", true);

const multer = require("multer");
const GridFsStorage = require("multer-gridfs-storage");
const mongoURI = "mongodb://localhost:27017/imagesDB";
const conn = mongoose.createConnection(mongoURI, {
  useUnifiedTopology: true,
  useNewUrlParser: true

});
let gfs;
conn.once("open", () => {
  gfs = new mongoose.mongo.GridFSBucket(conn.db, {
    bucketName: "uploads"
  });
});

app.use('/', homeRoute);
app.use('/auth', authenticationRoute);
app.use('/chats',chatsRoute);
app.use('/users',usersRoute);
// app.use('/groups', groupsRoute);
// app.use('/search',searchRoute);

const server=app.listen(3000,function(req,res){
  console.log("server started in port 3000!");
});

const io = socket(server);
require("./sockets")(io);
