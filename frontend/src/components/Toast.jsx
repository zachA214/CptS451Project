import { useState, useEffect } from 'react'

export default function Toast({message, type}) {

    const [classname, setClass] = useState("fixed bottom-5 right-5 flex items-center w-full max-w-sm p-4 text-green-700 bg-green-100 rounded-lg shadow border border-green-300");
    const [icontoast, setIconToast] = useState(<svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor"><path d="M5 13l4 4L19 7"/></svg>);

    function checkType() {
        if(type == "error"){
            
            setClass("fixed bottom-5 right-5 flex items-center w-full max-w-sm p-4 text-red-700 bg-red-100 rounded-lg shadow border border-red-300");
            setIconToast(<svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor"><path d="M6 18L18 6M6 6l12 12"/></svg>);
        }
    }

    useEffect(()=> {

        checkType();
    },[]);

    return (
        <div id="toast-success" className={classname} role="alert">
            {icontoast}
            <div className="ms-3 text-sm font-normal">{message}</div>
        </div>
    );
}