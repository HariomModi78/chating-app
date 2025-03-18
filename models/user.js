const mongoose = require("mongoose");
const order = require("./message.js");

const uri = "mongodb+srv://HariomModi78:HARIOMMODI99@cluster0.wv1zs.mongodb.net/?retryWrites=true&w=majority";

// Connect Mongoose properly
mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 30000, // Increase timeout in case of connection issues
});
const userSchema = mongoose.Schema({
    username:{
        type:String,
        require:true
    },
    password:{
        type:String,
        require:true
    },
    email:{
        type:String,
        require:true
    },
    profilePicture:{
        type:String,
    },
    status:{
        type:String,
    },
    lastSeen:{
        type:String,
    },
    socketId:String
})

module.exports = mongoose.model("user",userSchema);