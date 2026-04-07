import { useState, useEffect } from 'react'
import axios from 'axios';
import Table from '../components/Table';
import Modal from '../components/Modal';

export default function AdAddCategory(){

    const [categories, setCategories] = useState([]);
    const [open, setOpen] = useState(false);
    const [cName, setName] = useState("");

    const AddCategory = async (e) => {
        console.log("newCategory: ", cName);
        const detail = {cName};

        const response = await fetch('http://localhost:8000/api/categories/', {
            method: 'POST',
            body: JSON.stringify(detail),
            headers: {
                'Content-Type': 'application/json'
            }
        });
        const json = await response.json()
        .then(data => {
            console.log("Category added: ");
            setName("");
            setOpen(false);
        })
        .catch(error => console.error(error));


    }

     // Open Modal when a message is clicked
    const OnMssgClick = () =>{
        setOpen(true);
    }

    useEffect(()=> {

        fetch ('http://localhost:8000/api/categories/')
        .then(response => response.json())
        .then(data => setCategories(data))
        .catch(error => console.error(error));

    
    },[<Table/>]);


    return(
        <div className="container shadow-xl size-full">
            <div className="flex justify-center">
                <Table dictList = {categories}/>
            </div>
            <div className='flex justify-center gap-4 my-4'>
                <button className='btn-primary w-24' onClick={OnMssgClick}>Add</button>
                <button className='btn-primary w-24'>Delete</button>
            </div>
            {/* When user clicks to add a product */}
            <Modal open = {open} onClose={() => setOpen(false)}>
                <div className='grid grid-cols-1 gap-2'>
                    <p className='text-xl font-bold underline'>New Category </p>
                    <input 
                        className='border p-2' 
                        placeholder='Category Name' 
                        onChange={(e)=>setName(e.target.value)} 
                        value={cName}>
                    </input>
                    <button className='border bg-gray-200' onClick={AddCategory}>Send</button>
                </div>
            </Modal>
        </div>


    );
}