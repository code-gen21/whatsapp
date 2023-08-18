import './App.css'
import React, { useState, useEffect } from "react"
import axios from "axios"
import DateTimePicker from "react-datetime-picker"
import {useNavigate} from 'react-router-dom';
import {BiPowerOff} from 'react-icons/bi';

function App() {
  const navigate=useNavigate();
  const [ reminderMsg, setReminderMsg ] = useState("")
  const [ remindAt, setRemindAt ] = useState()
  const [ reminderList, setReminderList ] = useState([])

  useEffect(() => {
    if(localStorage.getItem("reminder-app-user")){
      const user=JSON.parse(localStorage.getItem("reminder-app-user"));
      // console.log(user);
      const phone=user.phone;
      // console.log(phone);
      axios.post("http://localhost:9000/getAllReminder",{phone}).then( res =>{
      // console.log(res.data);  
      setReminderList(res.data.msg)})
      // console.log(reminderList);
    }
    else{
      navigate('/login');
    }
  }, [])

  const handleLogout=async()=>{
    localStorage.clear();
    navigate('/register');
}
  const addReminder = () => {
    const user=JSON.parse(localStorage.getItem("reminder-app-user"));
    const phone=user.phone;
      axios.post("http://localhost:9000/addReminder", { reminderMsg, remindAt,phone})
      .then( res =>setReminderList(res.data.msg))
      setReminderMsg("")
      setRemindAt()
  }

  const deleteReminder = (id) => {
    const user=JSON.parse(localStorage.getItem("reminder-app-user"));
    const phone=user.phone;
    axios.post("http://localhost:9000/deleteReminder", {id,phone})
    .then( res => setReminderList(res.data))
  }

  return (
    <div className="App">
      <div className="homepage">

        <div className="homepage_header">
          <h1>Remind Me 🙋‍♂️</h1>
          <input type="text" placeholder="Reminder notes here..." value={reminderMsg} onChange={e => setReminderMsg(e.target.value)} />
          <DateTimePicker 
            value={remindAt}
            onChange={setRemindAt}
            minDate={new Date()}
            minutePlaceholder="mm"
            hourPlaceholder="hh"
            dayPlaceholder="DD"
            monthPlaceholder="MM"
            yearPlaceholder="YYYY"
          />
          <div className="button" onClick={addReminder}>Add Reminder</div>
          <div className='logout-container'>
            <div className='logout' onClick={handleLogout}><BiPowerOff /></div></div>
         
        </div>


        <div className="homepage_body">
          {
            
            reminderList.map((reminder)=> (
              <div className="reminder_card" key={reminder._id}>
                <h2>{reminder.reminderMsg}</h2>
                <h3>Remind Me at:</h3>
                <p>{String(new Date(reminder.remindAt.toLocaleString(undefined, {timezone:"Asia/Kolkata"})))}</p>
                <div className="button" onClick={() => deleteReminder(reminder._id)}>Delete</div>
              </div>
            ))
          }
          

          
        </div>

      </div>
    </div>
  )
}

export default App;
