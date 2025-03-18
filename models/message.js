const mongoose = require("mongoose");

const messageSchema = mongoose.Schema({
    commonId:String,
    senderId:{
        type:String,
        require:true
    },
    receiverId:{
        type:String,
        require:true
    },
    receiverSocketId:String,
    content:{
        type:String,
        require:true
    },
    status:{
        type:String,
        require:true
    },
    time:{
        type:String,
        require:true,
        default:Date.now()
    }

})

module.exports = mongoose.model("message",messageSchema);
