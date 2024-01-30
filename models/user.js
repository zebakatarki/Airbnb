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

userSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model('User',userSchema);