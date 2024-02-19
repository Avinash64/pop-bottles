import { useState , useEffect} from 'react';
import React from 'react';
import Cookies from 'js-cookie'

import './Latest.css';

function Latest() {
    const [description, setDescription] = useState("")
    const [amount, setAmount] = useState(1)
    
    const [latest, setLatest] = useState(null);

    useEffect(() => {
      const token = getTokenFromCookie();
  
      if (token) {
        getLatest(token);
      }
    }, []);

    const getTokenFromCookie = () => {
        return Cookies.get('token');
      };
    const getLatest = () => {
        const options = {
            method: 'GET',
            headers: {'Content-Type': 'application/json', 'token': Cookies.get('token')},
          };
          
          fetch('http://localhost:8000/savebottle', options)
            .then(response => response.json())
            .then(response => {
                console.log(response)
                setLatest(response)
            })
            .catch(err => console.error(err));
      };
      const table = []

    return (
        <div className="Latest">
          <table className="table table-bordered">
  <thead>
    <tr>
      <th scope="col">Date</th>
      <th scope="col">User</th>
      <th scope="col">BottlesSaved</th>
      <th scope="col">Info</th>
    </tr>
  </thead>
  <tbody>
    {/* <div>{`${JSON.stringify(latest)}`}</div> */}
    {latest ? latest.map((user,index) =>
                <tr key={index}>
                <th scope="row">{user[3]}</th>
                <td>{user[0]}</td>
                <td>{user[1]}</td>
                <td>{user[2]}</td>
                {/* <li key={index}>{user[0]}</li> */}
              </tr>
        ) : <tr>Loading</tr>}

  </tbody>
</table>
        </div>
    );
}

export default Latest;
