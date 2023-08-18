const mongoose=require('mongoose');
const userSchema=new mongoose.Schema({
    username:{
        type:String,
        required:true,
        min:3,
    },
    phone:{
        type:{String},
        required:true,
        unique:true,
    },
    password:{
        type:String,
        required:true,
        min:8,
    },
    Reminder: [{reminderMsg: String,
        remindAt: String,
        isReminded: Boolean }]
});

module.exports=mongoose.model("Users",userSchema);