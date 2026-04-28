import { useState,useEffect } from "react";
import Table from '../components/Table';


export default function AdminDash(){

    const [totalUsers, setTotalUsers] = useState(0);
    const [totalProducts, setTotalProducts] = useState(0);
    const [totalCategories, setTotalCategories] = useState(0);
    const [totalOrders, setTotalOrders] = useState(0);
    const [averageSale, setAverageSale] = useState(0.0);
    const [recentOrders, setRecentOrders] = useState([]);
    const [sales, setSales] = useState({});
    const [selectedSale, setSelectedSale] = useState(0.0);
    const [uniqueUsers, setUniqueUsers] = useState(0);


    const fetchTotalUsers = async () => {
        const response = await fetch(`http://localhost:8000/api/users/count/`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            })

        if(response.ok) {
            const data = await response.json();
            setTotalUsers(data["user_count"]);
        }
        else
        {
            console.error("Failed to fetch total users: ", response.status);
        }
    }

    const fetchTotalProducts = async () => {
        const response = await fetch(`http://localhost:8000/api/products/count/`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            })

        if(response.ok) {
            const data = await response.json();
            setTotalProducts(data["product_count"]);
        }
        else
        {
            console.error("Failed to fetch total products: ", response.status);
        }
    }

    const fetchTotalCategories = async () => {
        const response = await fetch(`http://localhost:8000/api/categories/count/`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            })

        if(response.ok) {
            const data = await response.json();
            setTotalCategories(data["category_count"]);
        }
        else
        {
            console.error("Failed to fetch total categories: ", response.status);
        }
    }

    const fetchTotalOrders = async () => {
        const response = await fetch(`http://localhost:8000/api/orders/count/`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            })

        if(response.ok) {
            const data = await response.json();
            setTotalOrders(data["order_count"]);
        }
        else
        {
            console.error("Failed to fetch total orders: ", response.status);
        }
    }

    const fetchAverageSale = async () => {
        const response = await fetch(`http://localhost:8000/api/orders/averagesale/`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            })

        if(response.ok) {
            const data = await response.json();
            setAverageSale(data["avg_total"]);
        }
        else
        {
            console.error("Failed to fetch average sale: ", response.status);
        }
    }

    const fetchRecentOrders = async () => {
        const response = await fetch(`http://localhost:8000/api/orders/recent/`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            })

        if(response.ok) {
            const data = await response.json();
            // Process recent orders data as needed
            console.log(data);
            setRecentOrders(data);
        }
        else
        {
            console.error("Failed to fetch recent orders: ", response.status);
        }
    }

    const fetchSales = async () => {
        const response = await fetch(`http://localhost:8000/api/orders/weeklysales/`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            })

        if(response.ok) {
            const data = await response.json();
            console.log("This is sales: ", data);
            setSales(data);
        }
        else
        {
            console.error("Failed to fetch sales: ", response.status);
        }
    }

    const fetchUniqueUsers = async () => {
        const response = await fetch(`http://localhost:8000/api/orders/uniqueusersweekly/`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            })

        if(response.ok) {
            const data = await response.json();
            console.log("This is unique users: ", data);
            setUniqueUsers(data);
        }
        else
        {
            console.error("Failed to fetch unique users: ", response.status);
        }
    }


    useEffect(() => {
        fetchTotalUsers();
        fetchTotalProducts();
        fetchTotalCategories();
        fetchTotalOrders();
        fetchAverageSale();
        fetchRecentOrders();
        fetchSales();
        fetchUniqueUsers();

    }, []);

  

    return (
        <div className="container shadow-xl pb-4">

            <div className="flex items-center justify-between my-4 mx-4"> 
                <a href="#" className="bg-neutral-primary-soft block max-w-sm p-6 border border-default rounded-base shadow-xs hover:bg-neutral-secondary-medium transform h-32 transition duration-500 hover:scale-110">
                    <h5 className="mb-3 text-2xl font-semibold tracking-tight text-heading leading-8">Total Users</h5>
                    <hr className="w-full my-2"/>
                    <p className="text-body">{totalUsers}</p>
                </a>

                <a href="#" className="bg-neutral-primary-soft block max-w-sm p-6 border border-default rounded-base shadow-xs hover:bg-neutral-secondary-medium transform h-32 transition duration-500 hover:scale-110">
                    <h5 className="mb-3 text-2xl font-semibold tracking-tight text-heading leading-8">Total Products</h5>
                    <hr className="w-full my-2"/>
                    <p className="text-body">{totalProducts}</p>
                </a>

                <a href="#" className="bg-neutral-primary-soft block max-w-sm p-6 border border-default rounded-base shadow-xs hover:bg-neutral-secondary-medium transform h-32 transition duration-500 hover:scale-110">
                    <h5 className="mb-3 text-2xl font-semibold tracking-tight text-heading leading-8">Total Categories</h5>
                    <hr className="w-full my-2"/>
                    <p className="text-body">{totalCategories}</p>
                </a>

                <a href="#" className="bg-neutral-primary-soft block max-w-sm p-6 border border-default rounded-base shadow-xs hover:bg-neutral-secondary-medium transform h-32 transition duration-500 hover:scale-110">
                    <h5 className="mb-3 text-2xl font-semibold tracking-tight text-heading leading-8">Average Sale</h5>
                    <hr className="w-full my-2"/>
                    <p className="text-body">${averageSale}</p>
                </a>

                <a href="#" className="bg-neutral-primary-soft block max-w-sm p-6 border border-default rounded-base shadow-xs hover:bg-neutral-secondary-medium transform h-32 transition duration-500 hover:scale-110">
                    <h5 className="mb-3 text-2xl font-semibold tracking-tight text-heading leading-8">Total Orders</h5>
                    <hr className="w-full my-2"/>
                    <p className="text-body">{totalOrders}</p>
                </a>
            </div>

            <div className="my-10 mx-4">
                <h2 className="text-2xl font-bold mb-4">Recent Orders</h2>
                <div className="flex justify-center">
                    <Table dictList = {recentOrders}/>
                </div>
            
            </div>

            <div className="flex items-center justify-center gap-10 my-10">
                {/*  */}

                <div className="max-w-sm w-full h-40 bg-neutral-primary-soft border border-default rounded-base shadow-xs p-4 md:p-6 transform h-48 transition duration-500 hover:scale-110">
                    <div className="mb-4">
                        <label className="text-2xl font-bold text-heading my-2">Unique users this week</label>
                        <hr className="w-full"/>
                    </div>
                    <div className="flex justify-center">
                        <div>
                            <label className="text-2xl font-semibold text-heading">{uniqueUsers}</label>
                        </div>
                    </div>
                    
                </div>

                <div className="max-w-sm w-full h-40 bg-neutral-primary-soft border border-default rounded-base shadow-xs p-4 md:p-6 transform h-48 transition duration-500 hover:scale-110">
                    <div className="mb-4">
                        <label className="text-2xl font-bold text-heading my-2">Sales</label>
                        <hr className="w-full"/>
                    </div>
                    <div className="flex justify-center">
                        <div>
                            <label className="text-2xl font-bold text-heading">${selectedSale}</label>
                        </div>
                    </div>
                    <div className="my-2">
                        <select
                            className='border p-2'
                            required={true}
                            onChange={(e)=>setSelectedSale(e.target.value)}
                            >
                                <option value="" disabled>Select a range</option>
                                {Object.entries(sales).map(
                                    ([key, value]) => (
                                        <option key={key} value={value}>{key}</option>
                                    )
                                )}
                        </select>
                    </div>
                </div>

            </div>
            
        </div>

);
}