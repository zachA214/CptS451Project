import { useState,useEffect } from "react";
import Table from '../components/Table';
import { sha256 } from "js-sha256";
import { Link, NavLink, Navigate, redirect, useNavigate } from 'react-router-dom';


export default function Login(){

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();
    

    const fetchUniqueUsers = async () => {
        try {
          const response = await fetch('http://localhost:8000/api/userauth/');
          if (response.ok) {
            const data = await response.json();
            console.log("Unique users: ", data);

            
            for (const dict of data)
            {
                if (dict["username"] === username && dict["password"] === sha256(password)){
                    
                    sessionStorage.setItem("isLoggedin", true);
                    sessionStorage.setItem("username", username);
                    
                    const userid = dict.user_id;
                    const res = await isAdmin(userid);
                    
                    sessionStorage.setItem("isAdmin", res);
                    
                    if (res) {
                        //navigate("/admin");
                        window.location.href = "/admin";
                    }
                    else
                    {
                        //navigate("/");
                        window.location.href = "/";
                    }

                }
            }
            

          } else {
            console.error("Failed to fetch unique users: ", response);
          }
        } catch (error) {
          console.error("Error fetching unique users: ", error);
        }

    }

    const isAdmin = async (user_id) => {
        try {
          const response = await fetch('http://localhost:8000/api/userrole/'+ user_id +'/');
          if (response.ok) {
            const data = await response.json();
            //console.log("Is admin: ", data);
            return data;
          } else {
            console.error("Failed to check admin status: ", response);
            return false;
          }
        } catch (error) {
          console.error("Error checking admin status: ", error);
          return false;
        }

    }

    return (

        <div className="container shadow-xl p-4 flex justify-center">

            <div className="border border-grey-200 p-4 fill-white drop-shadow-xl/25">
            
                <label className="text-2xl font-bold">Login</label>
                
                <div className="grid column-2 w-1/2 gap-2 p-15">
                        <label className="text-gray-700 font-bold mb-2" htmlFor="username">Username</label>
                        <input className="border border-gray-300 rounded-lg px-4 py-2 mb-4" type="text" value={username} onChange={e => setUsername(e.target.value)} placeholder="Enter your username"/>
                        <label className="text-gray-700 font-bold mb-2" htmlFor="password">Password</label>
                        <input className="border border-gray-300 rounded-lg px-4 py-2 mb-4" type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Enter your password"/>
                </div>

                <div>
                    <button className="btn-primary w-1/2" onClick={fetchUniqueUsers}>Login</button>
                </div>

           </div>

        </div>

    );
}
