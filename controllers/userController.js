const User=require("../model/userModel");
const bcrypt=require("bcrypt");

module.exports.register=async (req,res,next)=>{
    try{
        const {username,password,phone}=req.body;
        const phoneCheck=await User.findOne({phone});
        if(phoneCheck)
        return res.json({msg:"Phone number already used",status:false});
        const hashedPassword=await bcrypt.hash(password,10);
        const user=await User.create({
            phone,username,password:hashedPassword
    })
    console.log("Hello");
        delete user.password;
        return res.json({status:true,user});
    }catch(err){  
        next(err);
    }
}

module.exports.login=async (req,res,next)=>{
    try{
        const {username,password}=req.body;
        const phone=username;
        const user=await User.findOne({phone});
        if(!user)
        return res.json({msg:"Incorrect phone or password",status:false});
        const isPasswordValid=await bcrypt.compare(password,user.password);
        if(!isPasswordValid)
        return res.json({msg:"Incorrect phone or password",status:false});
        delete user.password;
        return res.json({status:true,user});
    }catch(err){
        next(err);
    }
}