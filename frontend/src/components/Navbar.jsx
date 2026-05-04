import { useState, useEffect } from 'react'
import { Link, NavLink, Navigate, redirect, useNavigate } from 'react-router-dom';

export default function Navbar({bool}){
//const Navbar = ({bool}) => {
    const [button1, setButton1] = useState("Home");
    const [button2, setButton2] = useState("Products");
    const [button3, setButton3] = useState("Search");
    const [initials, setinitials] = useState("DEF");
    const [hid, setHid] = useState(true);
    const [loginBtn, setLoginBtn] = useState("Login");

  
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [name, setName] = useState("");
    
    //Use to navigate to different pages
    const navigate = useNavigate();
    
    function isAdmin(bool) {
        if (bool) {
            setButton1("Dashboard");
            setButton2("Categories");
            setButton3("Products");
            setinitials("");//TODO: get admin name and set initials
            setHid(false);
            setLoginBtn("Logout");
        }
    }

    //Home or Dashboard
    //true: admin us clicking on Dashboard, should redirct to admin dash
    //false: user is clicking home, should redirct to homepage
    function onButton1Click() {
        
        if (bool) {
            navigate("/admin");
        } else {
            //user home here
            navigate("/");
        }
    }

    //products or categories
    //true: admin us clicking on categories, should redirct to admin categories
    //false: user is clicking products, should redirct to product page
    function onButton2Click() {
        if (bool) {
            navigate("/admin/categories");
        } else {
            //user products here
            navigate("/products");
        }
    }

    function onButton3Click(){
        if (bool) {
            navigate("/admin/products");
        } else {
            //user search here
            navigate("/search");
        }
    }


    function onLoginBtnClick() {
        if(loginBtn === "Login"){
            setLoginBtn("Logout");
            navigate("/login");
        }
        else{
            setLoginBtn("Login/Signup");
            navigate("/");
        }

    }



    useEffect(() => {
        isAdmin(bool);

    },[]);

    return(
        <nav className="relative bg-gray-800 after:pointer-events-none after:absolute after:inset-x-0 after:bottom-0 after:h-px after:bg-white/10">
        <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
            <div className="relative flex h-16 items-center justify-between">
            <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                {/* <!-- Mobile menu button--> */}
                <button type="button" command="--toggle" commandfor="mobile-menu" className="relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-white/5 hover:text-white focus:outline-2 focus:-outline-offset-1 focus:outline-indigo-500">
                <span className="absolute -inset-0.5"></span>
                <span className="sr-only">Open main menu</span>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" data-slot="icon" aria-hidden="true" className="size-6 in-aria-expanded:hidden">
                    <path d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" data-slot="icon" aria-hidden="true" className="size-6 not-in-aria-expanded:hidden">
                    <path d="M6 18 18 6M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                </button>
            </div>
            <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
                <div className="flex shrink-0 items-center">
                </div>
                <div className="hidden sm:ml-6 sm:block">
                <div className="flex space-x-4">
                    <button //Home or Dashboard
                        className="rounded-md px-3 py-2 text-sm font-medium text-gray-300 hover:bg-white/5 hover:text-white"
                        onClick={onButton1Click}
                        >
                        {button1} 
                    </button>
                    <button //Products or Categories
                        className="rounded-md px-3 py-2 text-sm font-medium text-gray-300 hover:bg-white/5 hover:text-white"
                        onClick={onButton2Click}
                        >
                        {button2}
                    </button>
                    <button 
                        className="rounded-md px-3 py-2 text-sm font-medium text-gray-300 hover:bg-white/5 hover:text-white"
                        onClick={onButton3Click}
                        >
                        {button3}
                    </button>
                    {!bool && ( //wishlist 
                        <button
                            className="rounded-md px-3 py-2 text-sm font-medium text-gray-300 hover:bg-white/5 hover:text-white"
                            onClick={() => navigate("/wishlist")}
                        >
                        Wishlist
                        </button>
                    )}
                    {!bool && (
                        <button
                            className="rounded-md px-3 py-2 text-sm font-medium text-gray-300 hover:bg-white/5 hover:text-white"
                            onClick={() => navigate("/cart")}
                        >
                        Cart
                        </button>
                    )}
                </div>
                </div>
            </div>
            <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0" >
                <button className="rounded-md px-3 py-2 text-sm font-medium text-gray-300 hover:bg-white/5 hover:text-white" hidden={hid}>
                    <p className="">{initials}</p>
                </button>
                <button className="rounded-md px-3 py-2 text-sm font-medium text-gray-300 hover:bg-white/5 hover:text-white" onClick={onLoginBtnClick}>
                    {loginBtn}
                </button>
                
                
            </div>
            </div>
        </div>
        </nav>
    );
};