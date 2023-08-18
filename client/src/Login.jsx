import React,{useState,useEffect} from 'react';
import styled from 'styled-components';
import { Link,useNavigate } from 'react-router-dom';
import {ToastContainer,toast} from 'react-toastify';
import "react-toastify/dist/ReactToastify.css"
import axios from 'axios';
import { loginRoute } from './utils/APIRoutes';

function Login() {
    const navigate=useNavigate();
    const [values,setValues]=useState({
        username:"",
        password:"",
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
            const user=JSON.parse(localStorage.getItem("reminder-app-user"));
        // console.log(user);
                navigate('/');
      }
    },[])

    const handleSubmit=async (event)=>{
        event.preventDefault();
        if(handleValidation()){
        const {password,username}=values;
            const {data}=await axios.post(loginRoute,{
                username,password
            });
            if(data.status===false){
                toast.error(data.msg,toastOptions);
            }
            if(data.status===true){
                localStorage.setItem('reminder-app-user',JSON.stringify(data.user));
                navigate('/');
            }
        }
       
    }
    const handleValidation=()=>{
        const {password,username}=values;
        if(password===""){
            toast.error("Phone and Password is required",toastOptions);
            return false;
        }
        else if(username===""){
            toast.error("Phone and Password is required",toastOptions);
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
                <h1>Login</h1>
            </div>
            <input type="text" placeholder="Phone" name="username" onChange={(e)=>handleChange(e)} min="10" max="10"/>
            <input type="password" placeholder="Password" name="password" onChange={(e)=>handleChange(e)} />
            <button type="submit">Login</button>
            <span>Don't have an account? <Link to="/register">Register</Link></span>
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
        background-color:white;
        border-radius:2rem;
        padding: 3rem 5rem;
        input{
            background-color:white;
            padding:1rem;
            border:0.1rem solid black;
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
                color:red;
                text-decoration:none;
                font-weight:bold;
            }
        }
    }
`;

export default Login;