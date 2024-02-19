import { useState , useEffect} from 'react';
import React from 'react';
import Cookies from 'js-cookie'

import './Home.css';

function Home() {
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
          
          fetch('http://localhost:8000/Homeboard', options)
            .then(response => response.json())
            .then(response => {
                console.log(response)
                setUserInfo(response)
            })
            .catch(err => console.error(err));
      };

    return (
        <div className="Home">

        <h1>Welcome</h1>
        </div>
    );
}

export default Home;
