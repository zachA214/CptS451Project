import { useState, useEffect } from 'react'
import Table from '../components/Table';
import Modal from '../components/Modal';
import Toast from '../components/Toast';

export default function AdAddProducts(){
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);

    //Attributes for new product
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState("");
    const [category_id, setCategoryId] = useState("");
    const [product_id, setProductId] = useState("");
    const [inventory, setInventory] = useState("");
    const [img_val, setImgVal] = useState("");

    //Modals
    const [open, setOpen] = useState(false);
    const [openDelModal, setopenDelModal] = useState(false);
    const [openUpdateModal, setOpenUpdateModal] = useState(false);

     //to rerender table after add, delete, or update
    const [refresh, setRefresh] = useState(false);

    //ForToast
    const [toast, setToast] = useState({ show: false, message: "", type: "success" });

    // Open Modal when a add is clicked
    const OnAddClick = () =>{
        setOpen(true);
    }
    // Open Modal when delete is clicked
    const OnDeleteClick = () => {
        setopenDelModal(true);
    }

    // Open Modal when update is clicked
    const onUpdateClick = () => {
        setOpenUpdateModal(true);
    }

    //Helper function to reset states after add or update, also resets file input and hides update form until a product is selected
    const resetStates = () => {
        setName("");
        setDescription("");
        setPrice("");
        setCategoryId("");
        setInventory("");
        setImgVal("");
        document.getElementById("file_input").value = null; // Reset file input
        document.getElementById("file_input_update").value = null; // Reset file input
        document.getElementById("ProductForm").hidden = true; // Hide update form until a product is selected
    }

    //Triggered by submit button in add Modal, adds product to database and table is refreshed
    const AddProduct = async (e) => {
    
        // if(name === "" || description === "" || price === "" || category_id === "" || inventory === "" || img_val === "") {
        //     alert("Please fill in all fields.");
        //     return;
        // }

        console.log("newProduct: ", {name, description, price, category_id, inventory, img_val});
        const detail = {name, description, price, category_id, inventory, img_val};

        const response = await fetch('http://localhost:8000/api/products/', {
            method: 'POST',
            body: JSON.stringify(detail),
            headers: {
                'Content-Type': 'application/json'
            }
        })

        if(response.ok) {
            const result = await response.json();
            console.log("Product added: ", result);
            resetStates();
            setOpen(false);
            setRefresh(prev => !prev);
            setToast({ show: true, message: "Product added successfully!", type: "success" });
            setTimeout(() => {setToast(t => ({show: false}));}, 3000);
            
        }
        else
        {
            //console.error();
            setToast({ show: true, message: "Product failed to be added!", type: "error" });
            setTimeout(() => {setToast(t => ({show: false}));}, 3000);
        }

    }

    //Triggered when a file is selected, converts the file to base64 encoding and sets the img_val state with the 
    //encoded string (without the data:image/png;base64, prefix)
    const FileProcessing = async (e) => {
        const file = e.target.files[0];
        if (!file) {
            alert("No file selected. Please select a file.");
            return;
        }
        //const encoding = await ConvertToBase64(file).then(encoded => {return encoded.split(",")[1]});
        const encoding = await ConvertToBase64(file).then(encoded => {return encoded});

        console.log("Encoding: ", encoding);
        setImgVal(encoding);
    }

    //Helper function to convert file to base64 encoding, returns a promise that resolves with the encoded string
    const ConvertToBase64 = async (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = error => reject(error);
        });
    }

    //Triggered by submit button in delete modal, deletes the product from the database and table is refreshed
    const DeleteProduct = async (e) => {
        //Make states for modal, maybe we can do a select instead of manually inputting the id, but for now this will do.
        if(product_id === "") {
            alert("Please select a product");
            return;
        }

        console.log("Product ID to delete: ", product_id);

        const response = await fetch(`http://localhost:8000/api/products/${product_id}/`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        if (response.ok) {
            const result = await response.json();
            console.log(result.message);
            setProductId("");
            setopenDelModal(false);
            setRefresh(prev => !prev);
            setToast({ show: true, message: "Product deleted successfully!", type: "success" });
            setTimeout(() => {setToast(t => ({show: false}));}, 3000);
        }
        else
        {
            console.error("Failed to delete category: ", response);
            setToast({ show: true, message: "Product failed to deleted!", type: "error" });
            setTimeout(() => {setToast(t => ({show: false}));}, 3000);
        }

    }

    //Fetch product details to prefill update form, triggered when a product is selected in the update modal, 
    //sets the states with the product details to prefill the form
    const fetchProductDetails = async (pID) => {
        if(pID === "") {
            alert("Please select a product");
            return;
        }

        const response = await fetch(`http://localhost:8000/api/products/${pID}/`);

        if (response.ok) {
            
            const data = await response.json();
            const { name, price, description, category_id, inventory, image_val } = data;
            setName(name);
            setPrice(price);
            setDescription(description);
            setCategoryId(category_id);
            setInventory(inventory);
            setImgVal(image_val);

        } else {
            console.error("Failed to fetch product details: ", response);
            alert("Failed to fetch product details. Please try again.");
            return null;
        }
       

    }

    //Triggered by submit button in update modal, updates the product in the database and table is refreshed
    const UpdateProduct = async (e) => {
        // if(name === "" || description === "" || price === "" || category_id === "" || inventory === "" || img_val === "") {
        //     alert("Please fill in all fields.");
        //     return;
        // }

        const response = await fetch(`http://localhost:8000/api/products/${product_id}/`, {
            method: 'PATCH',
            body: JSON.stringify({name: name, description: description, price: price, category_id: category_id, inventory: inventory, img_val: img_val}),
            headers: {
                'Content-Type': 'application/json'
            }
        })

        if (response.ok) {
            console.log(response.message);
            resetStates();
            setProductId("");
            setOpenUpdateModal(false);
            setRefresh(prev => !prev);
            setToast({ show: true, message: "Product updated successfully!", type: "success" });
            setTimeout(() => {setToast(t => ({show: false}));}, 3000);
        }
        else
        {
            console.error("Failed to update product: ", response);
            setToast({ show: true, message: "Product failed to update!", type: "error" });
            setTimeout(() => {setToast(t => ({show: false}));}, 3000);
        }
    }

     useEffect(()=> {

        fetch ('http://localhost:8000/api/products/')
        .then(response => response.json())
        .then(data => setProducts(data))
        .catch(error => console.error(error));

        fetch ('http://localhost:8000/api/categories/')
        .then(response => response.json())
        .then(data => setCategories(data))
        .catch(error => console.error(error));
 
    },[refresh]);

    return(
        <div className="container shadow-xl size-full">
            <div className="flex justify-center">
                <Table dictList = {products}/>
            </div>

            <div className='flex justify-center gap-4 my-4'>
                <button className='btn-primary w-24' onClick={OnAddClick}>Add</button>
                <button className='btn-primary w-24' onClick={OnDeleteClick}>Delete</button>
                <button className='btn-primary w-24' onClick={onUpdateClick}>Update</button>
            </div>

            <Modal open = {open} onClose={(e) => {
                setOpen(false)
                resetStates();
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
                            type='text'
                            >
                        </input>
                        {/* Price input */}
                        <label className='text-lg font-bold'>Price</label>
                        <input
                            className='border p-2' 
                            placeholder='Enter price'
                            required={true}
                            onChange={(e)=>setPrice(e.target.value)} 
                            value={price}
                            type='number'
                            >
                        </input>
                        {/* Inventory input */}
                        <label className='text-lg font-bold'>Inventory</label>
                        <input
                            className='border p-2' 
                            placeholder='Enter inventory count' 
                            required={true}
                            onChange={(e)=>setInventory(e.target.value)} 
                            value={inventory}
                            type='number'
                            >
                        </input>
                        {/* Category select */}
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
                        {/* File input */}
                        <label className='text-lg font-bold'>Select Picture (PNG, JPG, JPEG)</label>
                        <input 
                            className="cursor-pointer bg-neutral-secondary-medium border border-default-medium text-heading text-sm rounded-base focus:ring-brand focus:border-brand block w-full shadow-xs placeholder:text-body" 
                            id="file_input" 
                            type="file"
                            onInput={FileProcessing}
                            accept='image/png, image/jpeg, image/jpg'
                            >
                        </input>
                        {/* Description */}
                        <label className='text-lg font-bold'>Description</label> 
                        <textarea
                            className="block w-full h-32 p-2 text-left bg-gray-200 border-2 border-gray-200 rounded text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-gray-800"
                            placeholder="Description here:"
                            onChange={(e)=>setDescription(e.target.value)}
                            value={description}
                            required={true}
                            type='text'
                            >
                        </textarea>
                    </div>
                    <button className='btn-primary w-auto flex justify-self-center' onClick={AddProduct}>Submit</button>
                </div>
            </Modal>

            <Modal open = {openDelModal} onClose={() => {
                setopenDelModal(false)
                setProductId("");
                }}>
                <div className='grid grid-cols-1 gap-2'>
                    <p className='text-xl font-bold underline'>Delete Product </p>
                    <label>Select Product</label>
                    {/* Input for id */}
                    <select
                        className='bg-gray 50 border border-gray-300 p-2'
                        required={true}
                        onChange={(e)=>setProductId(e.target.value)} 
                        value={product_id}>
                            <option value="" disabled>Products</option>
                            {products.map((product) => (
                                <option key={product.id} value={product.id}>{product.name}</option>
                            ))}
                    </select>
                    <button className='btn-primary w-auto flex justify-self-center' onClick={DeleteProduct}>Submit</button>
                </div>
            </Modal>

            <Modal open = {openUpdateModal} onClose={() => {
                setOpenUpdateModal(false)
                setProductId("");
                resetStates();
                //document.getElementById("ProductForm").hidden = true;
                }}>
                <div className='grid grid-cols-1 gap-2'>
                    <p className='text-xl font-bold underline'>Update Product </p>
                    <label>Select Product</label>
                    {/* Input for id */}
                    <select
                        className='bg-gray 50 border border-gray-300 p-2'
                        required={true}
                        onChange={(e) => {
                            setProductId(e.target.value)
                            fetchProductDetails(e.target.value);
                            document.getElementById("ProductForm").hidden = false;
                        }}
                        value={product_id}>
                            <option value="" disabled>Products</option>
                            {products.map((product) => (
                                <option key={product.id} value={product.id}>{product.name}</option>
                            ))}
                    </select>
                    <div id='ProductForm' hidden='True' className='grid grid-cols-2 gap-2'>
                        <label className='text-lg font-bold'>Product Name</label> 
                        <input
                            className='border p-2' 
                            placeholder='Enter product name'
                            required={true}
                            onChange={(e)=>setName(e.target.value)} 
                            value={name}
                            type='text'
                            >
                        </input>
                        {/* Price input */}
                        <label className='text-lg font-bold'>Price</label>
                        <input
                            className='border p-2' 
                            placeholder='Enter price'
                            required={true}
                            onChange={(e)=>setPrice(e.target.value)} 
                            value={price}
                            type='number'
                            >
                        </input>
                        {/* Inventory input */}
                        <label className='text-lg font-bold'>Inventory</label>
                        <input
                            className='border p-2' 
                            placeholder='Enter inventory count' 
                            required={true}
                            onChange={(e)=>setInventory(e.target.value)} 
                            value={inventory}
                            type='number'
                            >
                        </input>
                        {/* Category select */}
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
                        {/* File input */}
                        <label className='text-lg font-bold'>Select for new Picture (PNG, JPG, JPEG)</label>
                        <input 
                            className="cursor-pointer bg-neutral-secondary-medium border border-default-medium text-heading text-sm rounded-base focus:ring-brand focus:border-brand block w-full shadow-xs placeholder:text-body" 
                            id="file_input_update" 
                            type="file"
                            onInput={FileProcessing}
                            accept='image/png, image/jpeg, image/jpg'
                            >
                        </input>
                        {/* Description */}
                        <label className='text-lg font-bold'>Description</label> 
                        <textarea
                            className="block w-full h-32 p-2 text-left bg-gray-200 border-2 border-gray-200 rounded text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-gray-800"
                            placeholder="Description here:"
                            onChange={(e)=>setDescription(e.target.value)}
                            value={description}
                            required={true}
                            type='text'
                            >
                        </textarea> 
                    </div>
                    <button className='btn-primary w-auto flex justify-self-center' onClick={UpdateProduct}>Submit</button>
                </div>
            </Modal>

            {toast.show &&<Toast message={toast.message} type={toast.type} />}

        </div>
    );
}