const socket = io();
let input = document.querySelector(".input");
let mic = document.querySelector(".ri-mic-fill");
let realMic = document.querySelector(".mic");
let loginButton = document.querySelector(".ri-login-box-line");
let contactBox = document.querySelector(".contactBox");
var pre = contactBox.innerHTML;
let a =  document.querySelector(".loginOptionPage");
let user = document.getElementsByClassName("user");
let profileImage = document.getElementsByClassName("profileImage");
let friendName = document.querySelector(".friendName p");
let send = document.querySelector(".mic i");
let time = document.querySelectorAll(".time p");
let messageHeader= document.querySelector(".messageHeader");
let messageBox = document.querySelector(".messageBox");
let messageFooter = document.querySelector(".messageFooter");


function scrollToBottom() {
    messageBox.scrollTop = messageBox.scrollHeight;
}
input.addEventListener("keydown",function(event){
    if(event.key =="Enter"){
        if(send.classList == "ri-send-plane-2-line"){
            socket.emit("clean");
    
            let one = contactBox.id + input.id; 
            var user = {
                senderId:contactBox.id,
                receiverId:input.id,
                content:input.value,
                commonId:one.split('').sort().join(''),
                socketId:realMic.id
            }
            socket.emit("message",user);
            let data = {
                commonId:one.split('').sort().join(''),
                receiverId:input.id,
                senderId:contactBox.id
            }
            console.log("real recever id ",data.receiverId)
            socket.emit("click",data);
            socket.emit("click",data);
            socket.emit("click",data);
            socket.emit("click",data);
        }
        input.value = "";
        send.classList = "ri-mic-fill"
    }
    
})

for(let i=0;i<user.length;i++){
    user[i].addEventListener("click",function(){
        messageHeader.style.cssText = "display:flex";
        messageFooter.style.cssText = "display:flex";
        socket.emit("clean");
        friendName.innerText = user[i].id;
        input.id = profileImage[i].id;
        let one = contactBox.id + input.id; 
        
        let data = {
            commonId:one.split('').sort().join(''),
            receiverId:input.id

        }
        socket.emit("clickOnUser",data);
        scrollToBottom()
    })
}


input.addEventListener("input",function(){
    mic.classList = "ri-send-plane-2-line";
    if(input.value==""){
    mic.classList = "ri-mic-fill";
    }
})
loginButton.addEventListener("click",function(){
    contactBox.innerHTML = loginOptionPage;
})
messageBox.innerHTML = ""
socket.on("displayOnUser",function(chat){
    messageBox.innerHTML = ""
        for(let i=0;i<chat.length;i++){
            console.log(chat[i].content)
            let div = document.createElement("div");
            div.innerText = chat[i].content;
            if(chat[i].senderId == contactBox.id){
                div.classList = "userMessage"
            }
            else{
                div.classList = "friendMessage"
    
            }
            
            messageBox.appendChild(div);
        }
        scrollToBottom();
    
    
})
socket.on("display",function(chat,message){
    console.log("message hai ye ",message);
    try{
        
         if(input.id ==message.senderId){
            messageBox.innerHTML = ""
            for(let i=0;i<chat.length;i++){
                // console.log(chat[i].content)
                let div = document.createElement("div");
                div.innerText = chat[i].content;
                if(chat[i].senderId == contactBox.id){
                    div.classList = "userMessage"
                }
                else{
                    div.classList = "friendMessage"
        
                }
                
                messageBox.appendChild(div);
            }
            scrollToBottom();
        }
    }catch(e){
        console.log("bhai tere pass nahe bheja hai ")
    }
   
    
    
    
})



socket.on("remove",function(){
    messageBox.innerHTML = ""
})

socket.on("give",function(socketId){
    realMic.id = socketId;
    socket.emit("ok",contactBox.id);
})


