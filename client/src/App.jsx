import React from 'react'
import {BrowserRouter,Routes,Route} from 'react-router-dom';
import Register from './Register';
import Main from './Main';
import Login from './Login';
import Error from './Error';

export default function App() {
  return (
    <BrowserRouter>
    <Routes>
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<Main />} />
      <Route path="*" element={<Error />} />
    </Routes>
    </BrowserRouter>
  )
}