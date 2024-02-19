import { useState } from 'react';
import React from 'react';
import Cookies from 'js-cookie'

import './Login.css';

function Login() {
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [token, setToken] = useState("")

    const handleLogin = () => {
        // Here you can perform login logic using username and password states
        const options = {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: `{"username":"${username}","password":"${password}"}`
          };
          
          fetch('http://localhost:8000/login', options)
            .then(response => response.json())
            .then(response => {
                console.log(response)
                if (response.token) {
                    document.cookie = `token=${response.token}; Secure`;
                }
            })
            .catch(err => console.error(err));
      };

    return (
        <div className="Login">

            <div className="mb-3">
                
                <label htmlFor="username" className="form-label">Username</label>
                <input type="text" className="form-control" id="username" placeholder="username" value={username}
                    onChange={(event) => setUsername(event.target.value)} />

                <label htmlFor="password" className="form-label">password</label>
                <input type="password" className="form-control" id="password" placeholder="password" value={password}
                    onChange={(event) => setPassword(event.target.value)} />
            
            </div>
            <button className="btn btn-primary" onClick={() => {console.log(username, password); handleLogin()}}>Login</button>
            {/* <button className="btn btn-primary" onClick={() => console.log(Cookies.get('token'))}>Cookie</button> */}
        </div>
    );
}

export default Login;
