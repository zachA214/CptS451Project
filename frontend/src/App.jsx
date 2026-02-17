import { useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import axios from 'axios';
import './App.css'

function App() {
  const [message, setMessage] = useState("");

  useEffect(() => {
    axios.get('http://localhost:8000/api/hello/')
      .then(res => {
        console.log(res.data);
        setMessage(res.data.message);
      })
      .catch(err => {
        console.error(err);
      });
  }, []);

  return (
    <div>
      <h1>React + Django</h1>
      <p>{message}</p>
    </div>
  );
}

export default App
