import { useState, useEffect } from 'react'
import Table from '../components/Table';
import Modal from '../components/Modal';

export default function AdAddProducts(){
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);

    //Attributes for new product
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState("");
    const [category_id, setCategoryId] = useState("");
    const [inventory, setInventory] = useState("");
    const [img_val, setImgVal] = useState("");

    //Modals
    const [open, setOpen] = useState(false);

     //to rerender table after add, delete, or update
     const [refresh, setRefresh] = useState(false);

    // Open Modal when a add is clicked
    const OnAddClick = () =>{
        setOpen(true);
    }

    const AddProduct = async (e) => {
    
        if(name === "" || description === "" || price === "" || category_id === "" || inventory === "" || img_val === "") {
            alert("Please fill in all fields.");
            return;
        }

        console.log("newProduct: ", {name, description, price, category_id, inventory, img_val});
        const detail = {name, description, price, category_id, inventory, img_val};

        const response = await fetch('http://localhost:8000/api/products/', {
            method: 'POST',
            body: JSON.stringify(detail),
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(response => response.json())
        .then(data => {
            console.log("Product added: ", data);
            setName("");
            setDescription("");
            setPrice("");
            setCategoryId("");
            setInventory("");
            setImgVal("");
            setOpen(false);
            setRefresh(prev => !prev);
        })
        .catch(error => console.error(error));

    }

    const FileProcessing = async (e) => {
        const file = e.target.files[0];
        if (!file) {
            alert("No file selected. Please select a file.");
            return;
        }
        const encoding = await ConvertToBase64(file).then(encoded => {return encoded.split(",")[1]});

        console.log("Encoding: ", encoding);
        setImgVal(encoding);
    }

    const ConvertToBase64 = async (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = error => reject(error);
        });
    }

     useEffect(()=> {

        fetch ('http://localhost:8000/api/products/')
        .then(response => response.json())
        .then(data => setProducts(data))
        .catch(error => console.error(error));

        console.log("Products: ", products);

        fetch ('http://localhost:8000/api/categories/')
        .then(response => response.json())
        .then(data => setCategories(data))
        .catch(error => console.error(error));

        console.log("Categories: ", categories);

    
    },[refresh]);

    return(
        <div className="container shadow-xl size-full">
            <div className="flex justify-center">
                <Table dictList = {products}/>
            </div>

            <div className='flex justify-center gap-4 my-4'>
                <button className='btn-primary w-24' onClick={OnAddClick}>Add</button>
                {/* <button className='btn-primary w-24' onClick={}>Delete</button>
                <button className='btn-primary w-24' onClick={}>Update</button> */}
            </div>

            <Modal open = {open} onClose={() => {
                setOpen(false)
                }}>
                <div className='grid grid-cols-1 gap-2'>
                    <p className='text-xl font-bold underline'>New Product </p>
                    <div className='grid grid-cols-2 gap-2'>
                        <label className='text-lg font-bold'>Product Name</label> 
                        <input
                            className='border p-2' 
                            placeholder='Enter product name'
                            required={true}
                            onChange={(e)=>setName(e.target.value)} 
                            value={name}
                            >
                        </input>

                        <label className='text-lg font-bold'>Price</label>
                        <input
                            className='border p-2' 
                            placeholder='Enter price'
                            required={true}
                            onChange={(e)=>setPrice(e.target.value)} 
                            value={price}
                            >
                        </input>

                        <label className='text-lg font-bold'>Inventory</label>
                        <input
                            className='border p-2' 
                            placeholder='Enter inventory count' 
                            required={true}
                            onChange={(e)=>setInventory(e.target.value)} 
                            value={inventory}
                            >
                        </input>

                        <label className='text-lg font-bold'>Select Category</label>
                        <select
                            className='border p-2'
                            required={true}
                            onChange={(e)=>setCategoryId(e.target.value)} 
                            value={category_id}
                            >
                                <option value="" disabled>Select a category</option>
                                {categories.map((category) => (
                                    <option key={category.id} value={category.id}>{category.name}</option>
                                ))}
                        </select>

                        <label className='text-lg font-bold'>Select Picture (PNG, JPG, JPEG)</label>
                        <input 
                            className="cursor-pointer bg-neutral-secondary-medium border border-default-medium text-heading text-sm rounded-base focus:ring-brand focus:border-brand block w-full shadow-xs placeholder:text-body" 
                            id="file_input" 
                            type="file"
                            onInput={FileProcessing}
                            accept='image/png, image/jpeg, image/jpg'
                            >
                        </input>


                        <label className='text-lg font-bold'>Description</label> 
                        <textarea
                            className="block w-full h-32 p-2 text-left bg-gray-200 border-2 border-gray-200 rounded text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-gray-800"
                            placeholder="Description here:"
                            onChange={(e)=>setDescription(e.target.value)}
                            value={description}
                            required={true}
                            >
                        </textarea>
                        
                    </div>
                    
                    <button className='btn-primary w-auto flex justify-self-center' onClick={AddProduct}>Submit</button>
                </div>
            </Modal>


        </div>
    );
}