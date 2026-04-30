import { useEffect, useMemo, useState } from "react";

const API_BASE = "http://localhost:8000/api";

function buildSearchUrl({ query, category, min_price, max_price }) {
  const url = new URL(`${API_BASE}/products/search/`);
  if (query) url.searchParams.set("query", query);
  if (category) url.searchParams.set("category", category);
  if (min_price !== "") url.searchParams.set("min_price", min_price);
  if (max_price !== "") url.searchParams.set("max_price", max_price);
  url.searchParams.set("limit", "50");
  url.searchParams.set("offset", "0");
  return url.toString();
}

export default function Search() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  const [status, setStatus] = useState("idle"); // idle | loading | error | success
  const [error, setError] = useState("");
  const [results, setResults] = useState([]);
  const [toast, setToast] = useState("");

  const showToast = (message) => {
      setToast(message);
      setTimeout(() => setToast(""), 2000);
  };

  const requestUrl = useMemo(
    () =>
      buildSearchUrl({
        query: query.trim(),
        category: category.trim(),
        min_price: minPrice,
        max_price: maxPrice,
      }),
    [query, category, minPrice, maxPrice],
  );

  const runSearch = async () => {
    setStatus("loading");
    setError("");
    try {
      const res = await fetch(requestUrl);
      const data = await res.json();
      if (!res.ok) {
        setStatus("error");
        setError(data?.error || "Search failed");
        setResults([]);
        return;
      }
      setResults(Array.isArray(data?.results) ? data.results : []);
      setStatus("success");
    } catch (e) {
      setStatus("error");
      setError("Network error");
      setResults([]);
    }
  };

  useEffect(() => {
    runSearch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

    <div className="container shadow-xl size-full p-4">

       {toast && (
                <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50">
                    <div className="flex items-center bg-gray-200 text-gray-900 px-6 py-3 rounded-lg shadow-xl text-sm font-semibold border border-gray-400">
                        <span>{toast}</span>
                    </div>
                </div>
            )}

      <div className="flex justify-center my-6">
        <h1 className="text-3xl font-bold">Search</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-3 items-end mb-6">
        <div className="flex flex-col gap-1">
          <label className="text-sm text-gray-600">Keyword</label>
          <input
            className="border p-2"
            placeholder="name or description"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-sm text-gray-600">Category</label>
          <input
            className="border p-2"
            placeholder="category name or id"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-sm text-gray-600">Min price</label>
          <input
            className="border p-2"
            placeholder="0"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-sm text-gray-600">Max price</label>
          <input
            className="border p-2"
            placeholder="999"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
          />
        </div>
      </div>

      <div className="flex gap-2 mb-6">
        <button className="btn-primary px-4 py-2" onClick={runSearch} disabled={status === "loading"}>
          {status === "loading" ? "Searching..." : "Search"}
        </button>
        <button
          className="border px-4 py-2"
          onClick={() => {
            setQuery("");
            setCategory("");
            setMinPrice("");
            setMaxPrice("");
          }}
        >
          Clear
        </button>
      </div>

      {status === "error" && (
        <p className="text-red-600 mb-4">{error}</p>
      )}

      {status !== "loading" && results.length === 0 ? (
        <p className="text-gray-500">No results.</p>
      ) : (
        <div className="flex flex-wrap justify-center gap-6 pb-10">

          {results.map((p) => (
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

              <p className="text-xs text-gray-500">
                Stock: {p.inventory}
              </p>

              <button
                className="btn-primary text-xs px-2 py-1 w-full"
                onClick={() => addToCart(p.product_id)}
              >
                Add to Cart
              </button>

            </div>
          ))}

        </div>
      )}
    </div>
  );
}

