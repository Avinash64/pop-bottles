import { useState, useEffect } from 'react';
import React from 'react';
import Cookies from 'js-cookie'

import './Dash.css';
import Latest from '../latest/Latest';

function Dash() {
    const [description, setDescription] = useState("")
    const [amount, setAmount] = useState(1)

    const [userInfo, setUserInfo] = useState(null);

    useEffect(() => {
        const token = getTokenFromCookie();

        if (token) {
            getUserInfo(token);
        }
    }, []);

    const saveBottle = (BottlesSaved, description) => {
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
            headers: { 'Content-Type': 'application/json', 'token': Cookies.get('token') },
        };

        fetch('http://localhost:8000/dashboard', options)
            .then(response => response.json())
            .then(response => {
                console.log(response)
                setUserInfo(response)
            })
            .catch(err => console.error(err));
    };

    return (
        <div className="dash">

            {/* <div>{`${JSON.stringify(userInfo)}`}</div> */}
            {userInfo ? <h1>Welcome {userInfo.username}!</h1> : <div>Loading</div>}
            {userInfo ?
                <div className="card .d-flex align-self-center text-center" style={{width : "18rem"}}>
                    <div className="card-header">
                        Bottles Saved
                    </div>
                <h5 className="card-title">{userInfo.bottles_saved}</h5>
                     </div>: <div>Loading</div> 
                }

                <div className='saveBottleForm'>
                    <label htmlFor="description" className="form-label">Record Here Everytime You Save A Bottle!</label>
                    <input type="text" className="form-control text-center" id="description" placeholder="description (optional)" value={description}
                        onChange={(event) => setDescription(event.target.value)} />
                    <input type="number" className="form-control text-center" id="amount" placeholder="1" value={amount}
                        onChange={(event) => setAmount(event.target.value)} />
                    <button className="btn btn-primary" onClick={() => { saveBottle(amount, description); getUserInfo(getTokenFromCookie()) }}>Save Bottle</button>
                </div>
                {/* <Latest></Latest> */}
                </div>
    );
}

            export default Dash;
