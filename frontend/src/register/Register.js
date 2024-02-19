import { useState } from 'react';
import React from 'react';

import './Register.css';

function Register() {
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")

    const handleRegister = () => {
        // Here you can perform login logic using username and password states
        const options = {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: `{"username":"${username}","password":"${password}"}`
          };
          
          fetch('http://localhost:8000/register', options)
            .then(response => response.json())
            .then(response => console.log(response))
            .catch(err => console.error(err));
      };

    return (
        <div className="register">

            <div className="mb-3">
                
                <label htmlFor="username" className="form-label">Username</label>
                <input type="text" className="form-control" id="username" placeholder="username" value={username}
                    onChange={(event) => setUsername(event.target.value)} />

                <label htmlFor="password" className="form-label">password</label>
                <input type="password" className="form-control" id="password" placeholder="password" value={password}
                    onChange={(event) => setPassword(event.target.value)} />
            
            </div>
            <button  className="btn btn-primary" onClick={() => {console.log(username, password); handleRegister()}}>Register</button>
        </div>
    );
}

export default Register;
