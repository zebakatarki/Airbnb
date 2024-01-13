const mongoose = require("mongoose");
const Schema = mongoose.Schema;
//Passport requiring
const passportLocalMongoose = require("passport-local-mongoose"); //passport mongoose

const userSchema = new Schema({
    email:{
        type:String,
        required:true
    },
});

//Used bcz it automatically implements the username,hashing,salting and hash password and add the multiple methods 
// User.plugin(passportLocalMongoose);
userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User',userSchema);