import { useState , useEffect} from 'react';
import React from 'react';
import Cookies from 'js-cookie'

import './Header.css';

function Header() {
    const [description, setDescription] = useState("")
    const [amount, setAmount] = useState(1)
    
    const [userInfo, setUserInfo] = useState(null);

    useEffect(() => {
      const token = getTokenFromCookie();
  
      if (token) {
        getUserInfo(token);
      }
    }, []);
    
    const saveBottle = (BottlesSaved, description ) => {
        const options = {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              token: Cookies.get('token')
                        },
            body: `{"BottlesSaved": ${BottlesSaved} ,"description": "${description}"}`
          };
          
          fetch('http://localhost:8000/savebottle', options)
            .then(response => response.json())
            .then(response => console.log(response))
            .catch(err => console.error(err));
    }

    const getTokenFromCookie = () => {
        return Cookies.get('token');
      };
    const getUserInfo = () => {
        const options = {
            method: 'GET',
            headers: {'Content-Type': 'application/json', 'token': Cookies.get('token')},
          };
          
          fetch('http://localhost:8000/', options)
            .then(response => response.json())
            .then(response => {
                console.log(response)
                setUserInfo(response)
            })
            .catch(err => console.error(err));
      };

    return (
<nav className="navbar navbar-expand-lg navbar-dark bg-primary">
  <a className="navbar-brand" href="#">POP Bottle</a>
  <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarText" aria-controls="navbarText" aria-expanded="false" aria-label="Toggle navigation">
    <span className="navbar-toggler-icon"></span>
  </button>
  <div className="collapse navbar-collapse" id="navbarText">
    <ul className="navbar-nav mr-auto">
      <li className="nav-item active">
        <a className="nav-link" href="/">Home </a>
      </li>
      <li className="nav-item">
        <a className="nav-link" href="/dashboard">Dash</a>
      </li>
      <li className="nav-item">
        <a className="nav-link" href="/latest">Latest</a>
      </li>
      <li className="nav-item">
        <a className="nav-link" href="/login">Login</a>
      </li>      
      <li className="nav-item">
        <a className="nav-link" href="/register">Register</a>
      </li>      
    </ul>

  </div>
</nav>
    );
}

export default Header;
