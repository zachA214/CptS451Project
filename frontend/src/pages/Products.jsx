import { useState, useEffect } from 'react';
import Modal from '../components/Modal';

export default function Products() {

    const [products, setProducts] = useState([]);
    const [toast, setToast] = useState("");

    const [openReviewModal, setOpenReviewModal] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);

    const [rating, setRating] = useState("");
    const [comment, setComment] = useState("");

    const [reviews, setReviews] = useState({});

    const [openReviewPanel, setOpenReviewPanel] = useState(false);
    const [activeProduct, setActiveProduct] = useState(null);

    const showToast = (message) => {
        setToast(message);
        setTimeout(() => setToast(""), 2000);
    };

    useEffect(() => {
        fetch('http://localhost:8000/api/products/')
            .then(res => res.json())
            .then(data => {
                const productList = Array.isArray(data) ? data : [];
                setProducts(productList);

                productList.forEach(p => {
                    fetch(`http://localhost:8000/api/review/${p.id}/`)
                        .then(res => res.json())
                        .then(r => {
                            setReviews(prev => ({
                                ...prev,
                                [p.id]: r
                            }));
                        })
                        .catch(err => console.error(err));
                });
            })
            .catch(err => console.error(err));
    }, []);

    const addToWishlist = (productId) => {
        fetch('http://localhost:8000/api/wishlist/add/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ product_id: productId })
        })
            .then(res => res.json())
            .then(() => showToast("Added to wishlist"))
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

    const openReviews = (productId) => {
        setActiveProduct(productId);
        setOpenReviewPanel(true);
    };

    const writeReview = (productId) => {
        setSelectedProduct(productId);
        setOpenReviewModal(true);
    };

    const submitReview = () => {
        if (!rating) {
            alert("Please enter a rating.");
            return;
        }

        fetch('http://localhost:8000/api/review/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                product_id: selectedProduct,
                rating: parseInt(rating),
                comment: comment
            })
        })
            .then(res => res.json())
            .then(() => {
                setRating("");
                setComment("");
                setSelectedProduct(null);
                setOpenReviewModal(false);
                showToast("Review submitted");
            })
            .catch(err => console.error(err));
    };

    const getAvgRating = (productId) => {
    const productReviews = reviews[productId] || [];
        if (productReviews.length === 0) return null;

        const sum = productReviews.reduce((acc, r) => acc + r.rating, 0);
        return sum / productReviews.length;
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
                <h1 className="text-3xl font-bold">Products</h1>
            </div>

            <div className="flex flex-wrap justify-center gap-6">

                {products.map(p => (
                    <div
                        key={p.product_id}
                        className="border border-gray-300 rounded-xl p-4 w-64 shadow hover:shadow-lg hover:-translate-y-1 transition flex flex-col items-center gap-3 bg-white"
                    >

                        <p className="font-bold text-center text-sm">
                            {p.name}
                        </p>

                        <p className="text-sm text-gray-600">
                            ${p.price}
                        </p>

                        <div className="w-full flex justify-center">
                            {p.img_val ? (
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

                        <div className="flex gap-2 w-full mt-2">

                            <button
                                className="btn-primary text-xs px-2 py-1 flex-1"
                                onClick={() => addToWishlist(p.id)}
                            >
                                Wishlist
                            </button>

                            <button
                                className="btn-primary text-xs px-2 py-1 flex-1"
                                onClick={() => writeReview(p.id)}
                            >
                                Review
                            </button>

                        </div>

                        <button
                            className="btn-primary text-xs px-2 py-1 w-full"
                            onClick={() => addToCart(p.id)}
                        >
                            Add to Cart
                        </button>

                        <div className="flex items-center justify-between w-full mt-1">

                            <p className="text-xs text-gray-500">
                                &#11088; {getAvgRating(p.id) ? getAvgRating(p.id).toFixed(1) : "No ratings"}
                            </p>

                            <button
                                className="text-blue-500 text-xs"
                                onClick={() => openReviews(p.id)}
                            >
                                View Reviews &#8594;
                            </button>

                        </div>

                    </div>
                ))}

            </div>

            {openReviewPanel && (
                <div className="fixed inset-0 flex justify-end z-50">

                    <div
                        className="absolute inset-0 bg-black/40"
                        onClick={() => setOpenReviewPanel(false)}
                    />

                    <div className="relative w-96 h-full bg-white shadow-xl p-4 overflow-y-auto">

                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-lg font-bold">Reviews</h2>

                            <button
                                onClick={() => setOpenReviewPanel(false)}
                                className="text-gray-500"
                            >
                                &#128942;
                            </button>
                        </div>

                        {reviews[activeProduct]?.length > 0 ? (
                            reviews[activeProduct].map((r, i) => (
                                <div key={i} className="border-b py-2">
                                    &#11088; {r.rating}
                                    <p className="text-sm">{r.comment}</p>
                                </div>
                            ))
                        ) : (
                            <p className="text-gray-400">No reviews yet</p>
                        )}

                    </div>
                </div>
            )}

            <Modal
                open={openReviewModal}
                onClose={() => {
                    setOpenReviewModal(false);
                    setRating("");
                    setComment("");
                }}
            >
                <div className="grid grid-cols-1 gap-2">

                    <p className="text-xl font-bold">Write Review</p>

                    <input
                        className="border p-2"
                        placeholder="Rating (1-5)"
                        value={rating}
                        onChange={(e) => setRating(e.target.value)}
                    />

                    <textarea
                        className="border p-2"
                        placeholder="Comment"
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                    />

                    <button
                        className="btn-primary w-auto flex justify-self-center"
                        onClick={submitReview}
                    >
                        Submit
                    </button>

                </div>
            </Modal>

        </div>
    );
}