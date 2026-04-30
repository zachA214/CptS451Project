import { useEffect, useMemo, useState } from "react";

const API_BASE = "http://localhost:8000/api";

export default function Cart() {
  const [status, setStatus] = useState("idle"); // idle | loading | error | success
  const [error, setError] = useState("");
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);

  const loadCart = async () => {
    setStatus("loading");
    setError("");
    try {
      const res = await fetch(`${API_BASE}/cart/`);
      const data = await res.json();
      if (!res.ok) {
        setStatus("error");
        setError(data?.error || "Failed to load cart");
        return;
      }
      setItems(Array.isArray(data?.items) ? data.items : []);
      setTotal(Number(data?.total || 0));
      setStatus("success");
    } catch (e) {
      setStatus("error");
      setError("Network error");
    }
  };

  useEffect(() => {
    loadCart();
  }, []);

  const updateQty = async (productId, quantity) => {
    try {
      const res = await fetch(`${API_BASE}/cart/update/`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ product_id: productId, quantity }),
      });
      const data = await res.json();
      if (!res.ok) {
        alert(data?.error || "Update failed");
        return;
      }
      await loadCart();
    } catch {
      alert("Network error");
    }
  };

  const removeItem = async (productId) => {
    try {
      const url = new URL(`${API_BASE}/cart/remove/`);
      url.searchParams.set("product_id", String(productId));
      const res = await fetch(url.toString(), { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) {
        alert(data?.error || "Remove failed");
        return;
      }
      await loadCart();
    } catch {
      alert("Network error");
    }
  };

  const checkout = async () => {
    try {
      const res = await fetch(`${API_BASE}/checkout/`, { method: "POST" });
      const data = await res.json();
      if (!res.ok) {
        alert(data?.error || "Checkout failed");
        return;
      }
      alert(`Checkout complete. Orders: ${data.order_ids?.join(", ") || ""}`);
      await loadCart();
    } catch {
      alert("Network error");
    }
  };

  const formattedTotal = useMemo(() => total.toFixed(2), [total]);

  return (
    <div className="container shadow-xl size-full p-4">
      <div className="flex justify-center my-6">
        <h1 className="text-3xl font-bold">Cart</h1>
      </div>

      {status === "error" && <p className="text-red-600 mb-4">{error}</p>}
      {status === "loading" && <p className="text-gray-500">Loading...</p>}

      {status !== "loading" && items.length === 0 ? (
        <p className="text-gray-500">Your cart is empty.</p>
      ) : (
        <div className="max-w-3xl mx-auto w-full">
          <div className="grid gap-3">
            {items.map((ci) => (
              <div key={ci.cart_id} className="border p-3 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  {ci.product?.img_val ? (
                    <img src={ci.product.img_val} alt={ci.product.name} className="w-16 h-16 object-cover" />
                  ) : (
                    <div className="w-16 h-16 bg-gray-200 flex items-center justify-center text-xs text-gray-500">
                      No image
                    </div>
                  )}
                  <div>
                    <p className="font-semibold">{ci.product?.name}</p>
                    <p className="text-sm text-gray-600">${ci.product?.price}</p>
                    <p className="text-xs text-gray-500">Line total: ${Number(ci.line_total || 0).toFixed(2)}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    className="border p-2 w-20"
                    type="number"
                    min={1}
                    value={ci.quantity}
                    onChange={(e) => updateQty(ci.product.product_id, Number(e.target.value))}
                  />
                  <button className="border px-3 py-2" onClick={() => removeItem(ci.product.product_id)}>
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-between items-center mt-6 border-t pt-4">
            <p className="text-lg font-bold">Total: ${formattedTotal}</p>
            <button className="btn-primary px-4 py-2" onClick={checkout} disabled={items.length === 0}>
              Checkout
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

