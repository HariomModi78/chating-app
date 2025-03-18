const express = require("express");
const app = express();
const path = require("path");
const http = require("http");
const cookieParser = require("cookie-parser");
const socket = require("socket.io");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const server = http.createServer(app);
const io = socket(server)
const userDataBase = require("./models/user.js")
const messageDataBase = require("./models/message.js");
const user = require("./models/user.js");
app.set("view engine","ejs");
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({extended:true}))
app.use(express.static(path.join(__dirname,"public")));
server.listen(3000,function(){
    console.log("port is running on",3000,"port number");
})
app.get("/",async function(req,res){
    try{
        let data = jwt.verify(req.cookies.token,"hariom")
        console.log(data);
       let user =  await userDataBase.findOne({username:data.username});
       if(user){
        let allUser = await userDataBase.find();
        res.render("index",{allUser:allUser,user:user})
       }
       else{
        res.render("login")
        
       }
    
        }
        catch(e){
            // res.cookie("token","eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJtb2JpbGVOdW1iZXIiOiI3ODk4NDg4OTM1IiwiaWF0IjoxNzQwNjc3NDk4fQ.NO6OTqnX2Z6plSl1FWMLBXObPKObYpHCvRdNYjpGxrQ")
            res.render("login");
        }
        
    
    
    
})
app.get("/login",function(req,res){
    res.render("login");
})
app.post("/login",async function(req,res){
    let user = await userDataBase.findOne({username:req.body.username});
    if(user){
        let token = jwt.sign({username:req.body.username},"hariom");
        res.cookie("token",token);
        res.redirect("/")
    }
    else{
        res.send("usernot found")
    }
})
app.post("/create",async function(req,res){
    if(req.body.password == req.body.confirmPassword){
        bcrypt.genSalt(10, function(err,salt){
            bcrypt.hash(req.body.password,salt,async function(err,hash){
                
                await userDataBase.create({
                    username:req.body.username,
                    email:req.body.email,
                    password:hash,
                })
            })
        })
        
        res.redirect("/")
    }
    else{
        res.send("pass not match")
    }
   
})


io.on("connection",async function(socket){
    console.log("connected",socket.id)
    socket.emit("give",socket.id);
    let date = new Date().toLocaleString();
    socket.on("ok",async function(userid){
        let user = await userDataBase.findOneAndUpdate({_id:userid},{socketId:socket.id,lastSeen:date});
    })
    socket.on("disconnect",function(){
        console.log("disconnected");
    }) 
    socket.on("message",async function(message){
        console.log("mesage.receiver id = ",message.receiverId);
        let receiver = await userDataBase.findOne({_id:message.receiverId})
        await messageDataBase.create({
            senderId:message.senderId,
            receiverId:message.receiverId,
            content:message.content,
            commonId:message.commonId,
            receiverSocketId:receiver.socketId
        })
    })
    socket.on("clickOnUser",async function(message){
            console.log("message recever id",message.receiverId)
        // let receiver = await userDataBase.findOne({_id:message.receiverId});
       let chat =  await messageDataBase.find({
            commonId:message.commonId,
           
        })
        socket.emit("displayOnUser",chat);
        // try{
        //     if (receiver.socketId) {
        //         socket.to(receiver.socketId).emit("display", chat);
        //     }
        // }catch(e){
        //     console.log("user is not online")
        // }
        
        
    })
    socket.on("click",async function(message){
        try{
            console.log("message recever id",message.receiverId)
        let receiver = await userDataBase.findOne({_id:message.receiverId});
       let chat =  await messageDataBase.find({
            commonId:message.commonId,
           
        })
        socket.emit("display",chat);
        socket.emit("displayOnUser",chat);
        try{
            if (receiver.socketId) {
                socket.to(receiver.socketId).emit("display",chat,message); //////
            }
        }catch(e){
            console.log("user is not online")
        }
        }catch(e){
            console.log("user par click karo")
        }
        
        
    })
    socket.on("clean",function(){
        socket.emit("remove")
    })
})