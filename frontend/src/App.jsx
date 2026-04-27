import { useState, useEffect } from 'react'
import { Outlet, Link, useLocation } from 'react-router-dom'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import axios from 'axios';
import './App.css'
import Footer from './components/Footer';
import Navbar from './components/Navbar';

function App() {
  const [message, setMessage] = useState("");
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin");

  useEffect(() => {
    // axios.get('http://localhost:8000/api/hello/')
    //   .then(res => {
    //     console.log(res.data);
    //     setMessage(res.data.message);
    //   })
    //   .catch(err => {
    //     console.error(err);
    //   });
  }, []);

  return (
    <div>
      <nav>
        <Navbar bool={isAdminRoute} ></Navbar>
      </nav>
      <Outlet />
      <footer>
        <Footer></Footer>
      </footer>
    </div>
  );
}

export default App
