import { useState, useEffect } from 'react'
import Table from '../components/Table';
import Modal from '../components/Modal';

export default function AdAddCategory(){

    const [categories, setCategories] = useState([]);
    //Modals
    const [open, setOpen] = useState(false);
    const [openDelCatModal, setopenDelCatModal] = useState(false);
    const [openUpdateModal, setopenUpdateModal] = useState(false);
    //Attributes in tables
    const [cName, setName] = useState("");
    const [category_id, setCategoryId] = useState("");

    //to rerender table after add, delete, or update
    const [refresh, setRefresh] = useState(false);

    //Triggered by submit button in add Modal, adds category to database and table is refreshed
    const AddCategory = async (e) => {
        if(cName === "") {
            alert("Please enter a category name.");
            return;
        }

        console.log("newCategory: ", cName);
        const detail = {cName};

        const response = await fetch('http://localhost:8000/api/categories/', {
            method: 'POST',
            body: JSON.stringify(detail),
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(response => response.json())
        .then(data => {
            console.log("Category added: ");
            setName("");
            setOpen(false);
            setRefresh(prev => !prev);
        })
        .catch(error => console.error(error));
    }

    const DeleteCategory = async (e) => {
        if(category_id === "") {
            alert("Please enter a category ID.");
            return;
        }

        console.log("Category ID to delete: ", category_id);

        const response = await fetch(`http://localhost:8000/api/categories/${category_id}/`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(response => response.json())
        .then(data => {
            console.log(data.message);
            setCategoryId("");
            setopenDelCatModal(false);
            setRefresh(prev => !prev);
        })
        .catch(error => console.error(error));
    }

    const retreiveCategory = async (e) => {
            //Keeps input hidden until id is entered and there is a response
            if(e === "") {
                document.getElementById("categoryInput").hidden = true;
                return;
            }
            
            console.log("Category ID to retreive: ", e);
    
            const response = await fetch(`http://localhost:8000/api/categories/${e}/`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            })

            if(response.ok)
            {
                const res = await response.json();
                console.log(res);
                const { name } = res;
                console.log("Category name: ", name);
                setName(name);
                document.getElementById("categoryInput").hidden = false;
            }
            else
            {
                console.error("Failed to retreive category: ", response.status);
            }
    }

    const UpdateCategory = async (e) => {
        if(category_id === "") {
            alert("Please enter a category ID.");
            return;
        }

        const response = await fetch(`http://localhost:8000/api/categories/${category_id}/`, {
            method: 'PATCH',
            body: JSON.stringify({cName: cName}),
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then (response => response.json())
        .then(data => {
            //const msg = data.message;
            console.log(data.message);
            setCategoryId("");
            setName("");
            setopenUpdateModal(false);
            document.getElementById("categoryInput").hidden = true;
            setRefresh(prev => !prev);
        })
        .catch(error => console.error(error));

    }

     // Open Modal when a add is clicked
    const OnAddClick = () =>{
        setOpen(true);
    }

    // Open Modal for delete when clicked
    const OnDeleteClick = () =>{
        setopenDelCatModal(true);
    }

    const OnUpdateClick = () => {
        setopenUpdateModal(true);
    }

    useEffect(()=> {

        fetch ('http://localhost:8000/api/categories/')
        .then(response => response.json())
        .then(data => setCategories(data))
        .catch(error => console.error(error));

    
    },[refresh]);


    return(
        <div className="container shadow-xl size-full">
            <div className="flex justify-center">
                <Table dictList = {categories}/>
            </div>
            <div className='flex justify-center gap-4 my-4'>
                <button className='btn-primary w-24' onClick={OnAddClick}>Add</button>
                <button className='btn-primary w-24' onClick={OnDeleteClick}>Delete</button>
                <button className='btn-primary w-24' onClick={OnUpdateClick}>Update</button>
            </div>
            {/* When user clicks to add a product */}
            <Modal open = {open} onClose={() => {
                setOpen(false)
                setName(""); //resets inputs when modal is closed
                }}>
                <div className='grid grid-cols-1 gap-2'>
                    <p className='text-xl font-bold underline'>New Category </p>
                    <input 
                        className='border p-2' 
                        placeholder='Category Name'
                        required={true}
                        onChange={(e)=>setName(e.target.value)} 
                        value={cName}>
                    </input>
                    <button className='btn-primary w-auto flex justify-self-center' onClick={AddCategory}>Submit</button>
                </div>
            </Modal>

            {/* When user clicks to delete a product */}
            <Modal open = {openDelCatModal} onClose={() => {
                setopenDelCatModal(false)
                setCategoryId(""); //resets inputs when modal is closed
                }}>
                <div className='grid grid-cols-1 gap-2'>
                    <p className='text-xl font-bold underline'>Delete Category </p>
                    <label>By ID</label>
                    {/* Input for id */}
                    <input 
                        className='border p-2' 
                        placeholder='Enter Category ID' 
                        required={true}
                        onChange={(e)=>setCategoryId(e.target.value)} 
                        value={category_id}>
                    </input>
                    <button className='btn-primary w-auto flex justify-self-center' onClick={DeleteCategory}>Submit</button>
                </div>
            </Modal>

            {/* When user clicks to Update */}
            <Modal open = {openUpdateModal} onClose={() => {
                setopenUpdateModal(false)
                setCategoryId(""); //resets inputs when modal is closed
                setName(""); //resets inputs when modal is closed
                document.getElementById("categoryInput").hidden = true;
                }}>
                <div className='grid grid-cols-1 gap-2'>
                    <p className='text-xl font-bold underline'>Update Category </p>
                    <label>Update a Category</label>
                    {/* Input for id */}
                    <input 
                        className='border p-2' 
                        placeholder='Enter Category ID to edit' 
                        required={true}
                        onChange={(e)=>
                            {
                                setCategoryId(e.target.value)
                                retreiveCategory(e.target.value);
                            }
                        } 
                        value={category_id}>
                    </input>
                    <input
                        id="categoryInput" 
                        className='border p-2' 
                        placeholder='Category Name'
                        required={true}
                        onChange={(e)=>setName(e.target.value)} 
                        value={cName}
                        hidden ={true}
                        >
                    </input>
                    <button className='btn-primary w-auto flex justify-self-center' onClick={UpdateCategory}>Submit</button>
                </div>
            </Modal>
        </div>


    );
}