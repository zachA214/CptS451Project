import { useState, useEffect } from 'react';

export default function Wishlist() {

    const [items, setItems] = useState([]);
    const [toast, setToast] = useState("");

    const showToast = (message) => {
        setToast(message);
        setTimeout(() => setToast(""), 2000);
    };

    useEffect(() => {
        fetch('http://localhost:8000/api/wishlist/')
            .then(res => res.json())
            .then(data => {
                console.log("WISHLIST:", data);
                setItems(Array.isArray(data) ? data : []);
            })
            .catch(err => console.error(err));
    }, []);

    const removeFromWishlist = (productId) => {
        fetch(`http://localhost:8000/api/wishlist/remove/${productId}/`, {
            method: 'DELETE'
        })
            .then(res => res.json())
            .then(() => {
                setItems(prev => prev.filter(i => i.product.product_id !== productId));
                showToast("Removed from wishlist");
            })
            .catch(err => console.error(err));
    };

    const addToCart = (productId) => {
        fetch('http://localhost:8000/api/cart/add/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ product_id: productId, quantity: 1 })
        })
            .then(res => res.json())
            .then(() => showToast("Added to cart"))
            .catch(err => console.error(err));
    };

    return (
        <div className="container shadow-xl size-full pb-10">

            {toast && (
                <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50">
                    <div className="flex items-center bg-gray-200 text-gray-900 px-6 py-3 rounded-lg shadow-xl text-sm font-semibold border border-gray-400">
                        <span>{toast}</span>
                    </div>
                </div>
            )}

            <div className="flex justify-center my-6">
                <h1 className="text-3xl font-bold">Wishlist</h1>
            </div>

            <div className="flex flex-wrap justify-center gap-6">

                {items.map(item => {
                    const p = item.product;

                    return (
                        <div
                            key={item.id}
                            className="border border-gray-300 rounded-xl p-4 w-64 shadow hover:shadow-lg hover:-translate-y-1 transition flex flex-col items-center gap-3 bg-white"
                        >

                            <p className="font-bold text-center text-sm">
                                {p?.name}
                            </p>

                            <p className="text-sm text-gray-600">
                                ${p?.price}
                            </p>

                            <div className="w-full flex justify-center">
                                {p?.img_val ? (
                                    <img
                                        src={p.img_val}
                                        alt={p.name}
                                        className="w-28 h-28 object-cover rounded-md"
                                    />
                                ) : (
                                    <div className="w-28 h-28 bg-gray-200 flex items-center justify-center text-xs text-gray-500 rounded-md">
                                        No image
                                    </div>
                                )}
                            </div>

                            <div className="flex gap-2 w-full">

                                <button
                                    className="btn-primary text-xs px-2 py-1 flex-1"
                                    onClick={() => removeFromWishlist(p.product_id)}
                                >
                                    Remove
                                </button>

                                <button
                                    className="btn-primary text-xs px-2 py-1 flex-1"
                                    onClick={() => addToCart(p.product_id)}
                                >
                                    Add to Cart
                                </button>

                            </div>

                        </div>
                    );
                })}

            </div>
        </div>
    );
}


