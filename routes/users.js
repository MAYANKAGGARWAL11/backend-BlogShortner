const mongoose = require('mongoose')
mongoose.connect("mongodb://127.0.0.1:27017/logic-url");

const userSchema = new mongoose.Schema({
    shortID:{
        type:String,
        required:true,
    
    },
    redirectURL:{
        type:String,
        require:true,
    },
 });

 module.exports = mongoose.model("user", userSchema);