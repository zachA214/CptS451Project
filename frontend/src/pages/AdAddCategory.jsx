import { useState, useEffect } from 'react'
import axios from 'axios';
import Table from '../components/Table';

export default function AdAddCategory(){

    const [categories, setCategories] = useState([]);

    useEffect(()=> {
        
    //     const fetchMessages = async () =>{
    //     const response = await fetch('http://localhost:8000/api/categories/')
    //     const json = await response.json();

    //     if(response.ok){
    //         setCategories(json);
    //         console.log(json);
    //         console.log(categories);
    //     }
    // }
    axios.get('http://localhost:8000/api/categories/')
      .then(res => {
        console.log(res.data);
        setCategories(res.data);
      }).catch(err => console.error(err));

    
    },[]);



    return(
        <div className="container shadow-xl">
            <div className="flex justify-center">
                <Table dictList = {categories}/>
            </div>
        </div>


    );
}