import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";


export default function Homepage() {


    const navigate = useNavigate();

    const [products, setProducts] = useState([]);
    const [reviews, setReviews] = useState({});

    useEffect(() => {
        fetch("http://localhost:8000/api/products/")
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

    const getAvgRating = (productId) => {
        const productReviews = reviews?.[productId] || [];
        if (!productReviews.length) return 0;

        const sum = productReviews.reduce((acc, r) => acc + r.rating, 0);
        return sum / productReviews.length;
    };

    return (
        <div className="container mx-auto shadow-xl p-10 pt-15">


            <div className="flex flex-col md:flex-row items-center gap-8 mb-8 ms-10">

                <div className="flex-1 text-center md:text-left ms-5">

                    <h1 className="text-4xl font-bold mb-3">
                        Welcome!
                    </h1>

                    <p className="text-gray-600 mb-6">
                        Browse items, save favorites, and leave reviews
                    </p>

                    <div className="flex gap-4 justify-center md:justify-start">

                        <button
                            className="btn-primary px-6 py-3"
                            onClick={() => navigate("/products")}
                        >
                            Browse Products
                        </button>

                        <button
                            className="btn-primary px-6 py-3"
                            onClick={() => navigate("/search")}
                        >
                            Search
                        </button>


                    </div>

                </div>


                <div className="flex-1 flex justify-center">
                    <div className="bg-gray-50 rounded-xl p-5 px-15 shadow-sm flex flex-col items-center">

                    <p className="text-md text-gray-600 mb-3">
                        Featured Products
                    </p>

                    <div className="grid grid-cols-2 gap-4 max-w-md">

                        {[...products]
                            .sort((a, b) => getAvgRating(b.id) - getAvgRating(a.id))
                            .slice(0, 4)
                            .map((p) => (
                        <div
                            key={p.id || p.product_id}
                            onClick={() => navigate("/products")}
                            className="border border-gray-100 rounded-xl p-3 shadow-sm bg-white flex flex-col items-center text-center
                                    hover:shadow-lg hover:-translate-y-1 transition duration-200"
        
                        >

                                {p.img_val ? (
                                    <img
                                        src={p.img_val}
                                        alt={p.name}
                                        className="w-14 h-14 object-cover rounded"
                                    />
                                ) : (
                                    <div className="w-14 h-14 bg-gray-200 flex items-center justify-center text-[10px] text-gray-500 rounded">
                                        No img
                                    </div>
                                )}

                                <p className="text-xs font-semibold mt-1">
                                    {p.name}
                                </p>

                                <p className="text-[10px] text-gray-500">
                                    ${p.price}
                                </p>

                                <p className="text-[10px] text-gray-500">
                                    &#11088; {getAvgRating(p.id) ? getAvgRating(p.id).toFixed(1) : "No ratings"}
                                </p>

                            </div>
                        ))}

                    </div>

                    <button
                        className="btn-primary mt-4 px-4 py-2 text-xs"
                        onClick={() => navigate("/products")}
                    >
                        View All &#8594;
                    </button>

                </div>


                </div>
            </div>

        </div>
    );
}