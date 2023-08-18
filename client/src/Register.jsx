import React,{useState,useEffect} from 'react';
import styled from 'styled-components';
import { Link,useNavigate } from 'react-router-dom';
import {ToastContainer,toast} from 'react-toastify';
import "react-toastify/dist/ReactToastify.css"
import axios from 'axios';
import { registerRoute } from './utils/APIRoutes';
import signup from './assets/signup.jpg';

function Register() {
    const navigate=useNavigate();
    const [values,setValues]=useState({
        username:"",
        phone:"",
        password:"",
        confirmPassword:""
    });
    const toastOptions={
        position:"top-center",
        autoClose:8000,
        pauseOnHover:true,
        draggable:true,
        theme:"dark"
    }
    useEffect(()=>{
      if(localStorage.getItem("reminder-app-user")){
        navigate('/');
      }
    },[])
    const handleSubmit=async (event)=>{
        event.preventDefault();
        if(handleValidation()){
            // console.log("In validation",registerRoute);
        const {password,username,phone}=values;
            const {data}=await axios.post(registerRoute,{
                username,password,phone
            });
            if(data.status===false){
                toast.error(data.msg,toastOptions);
            }
            if(data.status===true){
                localStorage.setItem('reminder-app-user',JSON.stringify(data.user));
                navigate('/login');
            }
        }
       
    }
    const handleValidation=()=>{
        const {password,phone,username,confirmPassword}=values;
        if(password!==confirmPassword){
            toast.error("Password and confirm password should be same",toastOptions);
            return false;
        }
        else if(username.length<3){
            toast.error("Username should be greater than 3 characters",toastOptions);
            return false;
        }
        else if(phone.length!=10){
            toast.error("Enter valid phone number",toastOptions);
            return false;
        }
        else if(password.length<8){
            toast.error("Password should be equal or greater than 8 characters",toastOptions);
            return false;
        }
        return true;
    }
    const handleChange=(event)=>{
         setValues({...values,[event.target.name]:event.target.value});
    }
  return<>
    <FormContainer>
        <form onSubmit={(event)=>handleSubmit(event)}>
            <div className="brand">
               
                <h1>Register here</h1>
            </div>
            <input type="text" placeholder="Username" name="username" onChange={(e)=>handleChange(e)} />
            <input type="text" placeholder="Phone" name="phone" onChange={(e)=>handleChange(e)} />
            <input type="password" placeholder="Password" name="password" onChange={(e)=>handleChange(e)} />
            <input type="password" placeholder="Confirm Password" name="confirmPassword" onChange={(e)=>handleChange(e)} />
            <button type="submit">Create User</button>
            <span>Already have an account? <Link to="/login">Login</Link></span>
        </form>
    </FormContainer>
    <ToastContainer />
  </>
}

const FormContainer=styled.div`
    height:100vh;
    width:100vw;
    display:flex;
    flex-direction:column;
    justify-content:center;
    align-items:center;
    // background:url(${signup});
    background-color:#27251F;
    .brand{
        display:flex;
        align-items:center;
        justify-content:center;
        img{
            height:5rem;
        }
        h1{
            color:black;
            text-transform:uppercase;
        }
    }
    form{
        display:flex;
        flex-direction:column;
        gap:2rem;
        // background:url(${signup});
        background-color:white;
        border-radius:2rem;
        padding: 3rem 5rem;
        input{
            background-color:white;
            padding:1rem;
            border:0.2rem solid black;
            border-radius: 0.4rem;
            color:black;
            width:100%;
            font-size:1rem;
            &:focus{
                border:0.1rem solid black;
                outline:none;
            }
        }
        button{
            background-color:black;
            color:white;
            padding:1rem 2rem;
            border:none;
            font-weight:bold;
            cursor:pointer;
            border-radius:0.4rem;
            font-size:1rem;
            text-transform:uppercase;
            transition:.5s ease-in-out;
            &:hover{
                background-color:#434343 ;
            }
        }
        span{
            color:black;
            text-transform:uppercase;
            a{
                color:#40826d;
                text-decoration:none;
                font-weight:bold;
            }
        }
    }
`;

export default Register