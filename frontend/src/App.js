import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Register from './register/Register';
import Login from './login/Login'
import Dash from './dash/Dash';
import Latest from './latest/Latest';
import Home from './home/Home';
import Header from './header/Header';
import './App.css'

function App() {
  return (
    <div className="App">
    <Router>
      <Header></Header>
      <Routes>
        <Route path="/" exact element={<Home/>} />
        <Route path="/login" element={<Login/>} />
        <Route path="/register" element={<Register/>} />
        <Route path="/dashboard" element={<Dash />} />
        <Route path="/latest" element={<Latest />} />
      </Routes>
    </Router>
    </div>
  );
}

export default App;