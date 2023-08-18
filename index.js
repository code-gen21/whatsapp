require('dotenv').config()
const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
const userRoutes=require("./routes/userRoutes");
const User=require("./model/userModel");

//APP config
const app = express()
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(cors())

app.use("/api/auth",userRoutes);

const path=require("path");

//DB config
mongoose.connect('mongodb+srv://deploy:deploy@cluster0.l27jlvp.mongodb.net/reminderApp', {
    useNewUrlParser: true, 
    useUnifiedTopology: true,
    useFindAndModify: false
}, () => console.log("DB connected"))
let serverPhone="";
let serverId="";
let allReminders=[];


//Whatsapp reminding functionality

setInterval(()=>{
    allReminders.forEach(reminder=>{
        if(!reminder.isReminded && serverPhone.length>0){
            const now=new Date();
            if(new Date(reminder.remindAt)-now<0){
                const accountSid = process.env.ACOOUNT_SID;
                const authToken = process.env.AUTH_TOKEN;
                const client = require('twilio')(accountSid, authToken); 
                const contact='whatsapp:+91';
                const toMsg=contact.concat(serverPhone);
                client.messages 
                    .create({ 
                        body: reminder.reminderMsg, 
                        from: 'whatsapp:+14155238886',       
                        to: toMsg
                    }) 
                    .then(message => console.log(message.sid)) 
                    .done()
            }
        }
    })
    for(let i=0;i<allReminders.length;i++){
        const now=new Date();
        if(new Date(allReminders[i].remindAt)-now<0){
            allReminders[i].isReminded=true;

        }
    }

    if(serverPhone.length>0){
        const ans=User.findOneAndUpdate({_id:serverId},
        {Reminder:allReminders}, null, function (err, docs) {
            if (err){
                console.log(err)
            }
        });
        // console.log(ans);
    }
},1000)



//API routes
app.post("/getAllReminder", async(req, res) => {
    const {phone}=req.body;
    console.log(phone);
    const messages=await User.find({phone});
    // console.log(messages);
    const reminders=messages[0].Reminder;
    serverPhone=phone;
    serverId=messages[0].id;
    // console.log(messages[0].Reminder);
    allReminders=reminders;
    // console.log(allReminders);
    res.send({msg:reminders});
})

app.post("/addReminder", async(req, res) => {
    const { reminderMsg, remindAt,phone } = req.body;
    const doc = await User.find({phone});
    doc[0].Reminder.push({reminderMsg,remindAt,isReminded:false});
    const userData=await User.findOneAndUpdate({phone},{
       Reminder:doc[0].Reminder
    }); 
    allReminders=doc[0].Reminder;
    res.send({msg:doc[0].Reminder});
})

app.post("/deleteReminder",async(req, res) => {
    const {id,phone}=req.body;
    const document=await User.find({phone});
    let remaining=[];
    for(let i=0;i<document[0].Reminder.length;i++){
        if(document[0].Reminder[i].id!==id){
            remaining.push(document[0].Reminder[i]);
        }
    }
    const userData=await User.findOneAndUpdate({phone},{
        Reminder:remaining
     }); 
     allReminders=remaining;
    res.json(remaining);

})

app.listen(9000, () => console.log("Be started"))


app.use(express.static(path.join(__dirname,"./client/build")));
app.get("*",function(_,res){
  res.sendFile(
    path.join(__dirname,"./client/build/index.html"),
    function(err){
      res.status(500).send(err);
        }
        );
});