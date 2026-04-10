import { useState, useEffect } from 'react';

export default function Wishlist() {

    const [items, setItems] = useState([]);

    useEffect(() => {
        fetch('http://localhost:8000/api/wishlist/')
            .then(res => res.json())
            .then(data => {
                console.log("WISHLIST:", data);
                setItems(Array.isArray(data) ? data : []);
            })
            .catch(err => console.error(err));
    }, []);

    return (
        <div className="container shadow-xl size-full">

            <div className="flex justify-center my-6">
                <h1 className="text-3xl font-bold">
                    Wishlist
                </h1>
            </div>

            <div className="flex flex-wrap justify-center gap-6">

                {items.map(item => {
                    const p = item.product;

                    return (
                        <div
                            key={item.id}
                            className="border p-4 w-64 shadow flex flex-col items-center gap-2"
                        >

                            <p className="font-bold text-center">
                                {p?.name}
                            </p>

                            <p className="text-sm text-gray-600">
                                ${p?.price}
                            </p>

                            {p?.img_val ? (
                                <img
                                    src={p.img_val}
                                    alt={p.name}
                                    className="w-20 h-20 object-cover"
                                />
                            ) : (
                                <div className="w-20 h-20 bg-gray-200 flex items-center justify-center text-xs text-gray-500">
                                    No image
                                </div>
                            )}

                            <div className="flex gap-2 w-full mt-2">

                                <button className="btn-primary text-xs px-2 py-1 flex-1">
                                    Remove
                                </button>

                            </div>

                        </div>
                    );
                })}

            </div>
        </div>
    );
}

