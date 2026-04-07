import { useState, useEffect } from 'react'
import { Link, NavLink, Navigate } from 'react-router-dom';

const Navbar = ({bool}) => {
    const [button1, setButton1] = useState("Home");
    const [button2, setButton2] = useState("Products");
    const [button3, setButton3] = useState("Search");
    const [initials, setinitials] = useState("DEF");
    const [hid, setHid] = useState(true);
    const [loginBtn, setLoginBtn] = useState("Login/Signup");

    
    function isAdmin(bool) {
        if (bool) {
            setButton1("Dashboard");
            setButton2("Categories");
            setButton3("Products");
            setinitials("OU");
            setHid(false);
            setLoginBtn("Logout");
        }
    }

    //false: user is clicking home, should redirct to homepage
    //true: admin us clicking on Dashboard, should redirct to admin dash
    function onButton1Click() {
            if (bool) {
                Navigate('/admin/categories');
            } else {
                //redirct to homepage
                Navigate('/');
            }

    }


    useEffect(() => {
        isAdmin(bool);
    });

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
                    <button 
                        className="rounded-md px-3 py-2 text-sm font-medium text-gray-300 hover:bg-white/5 hover:text-white"
                        onClick={onButton1Click}
                        >
                        {button1}
                    </button>
                    <button className="rounded-md px-3 py-2 text-sm font-medium text-gray-300 hover:bg-white/5 hover:text-white">{button2}</button>
                    <button className="rounded-md px-3 py-2 text-sm font-medium text-gray-300 hover:bg-white/5 hover:text-white">{button3}</button>
                </div>
                </div>
            </div>
            <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0" >
                <button className="rounded-md px-3 py-2 text-sm font-medium text-gray-300 hover:bg-white/5 hover:text-white" hidden={hid}>
                    <p className="">{initials}</p>
                </button>
                <button className="rounded-md px-3 py-2 text-sm font-medium text-gray-300 hover:bg-white/5 hover:text-white">
                    {loginBtn}
                </button>
                
                
            </div>
            </div>
        </div>
        </nav>
    );
};
export default Navbar;