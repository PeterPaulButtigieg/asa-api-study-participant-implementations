import { useEffect, useState } from "react";
import { getProduct } from "../api";

export default function Product({ productId }) {
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [error, setError] = useState("");

  useEffect(() => {
    getProduct(productId)
      .then((response) => {
        setProduct(response.data);
      })
      .catch((err) => setError(err.message));
  }, [productId]);

  function buyNow() {
    if (!product) return;

    const cart = {
      productId: product.id,
      name: product.name,
      price: product.price,
      currency: product.currency,
      image: product.image_url,
      quantity,
    };

    sessionStorage.setItem("cart", JSON.stringify(cart));
    window.location.href = "/checkout";
  }

  if (error) {
    return (
      <main className="max-w-5xl mx-auto p-6">
        <div className="border border-red-200 bg-red-50 text-red-700 p-4 rounded-lg">
          {error}
        </div>
      </main>
    );
  }

  if (!product) {
    return (
      <main className="max-w-5xl mx-auto px-6 py-8">
        <p className="text-slate-500">Loading product...</p>
      </main>
    );
  }

  const maxQuantity = Math.min(5, product.available_quantity);
  const soldOut = product.available_quantity === 0;

  return (
    <main className="max-w-5xl mx-auto px-5 py-10">
      <div className="grid md:grid-cols-2 gap-10 bg-white p-6 rounded-xl border border-slate-200">
        <div>
          <img
            src={product.image_url}
            alt=""
            className="w-full h-[420px] object-contain bg-slate-50 rounded-lg"
          />
        </div>

        <div className="pt-2">
          <h1 className="text-3xl font-bold mb-3">{product.name}</h1>

          <p className="text-slate-600 leading-6 mb-5">
            {product.description}
          </p>

          <p className="text-2xl font-bold mb-6">
            {product.price}{" "}
            <span className="text-base text-slate-500 font-normal">
              {product.currency}
            </span>
          </p>

          <h3 className="font-semibold mb-2">Features</h3>

          <ul className="mb-6">
            {product.features.map((feature) => (
              <li className="text-sm text-slate-600 mb-1" key={feature}>
                • {feature}
              </li>
            ))}
          </ul>

          <div className="border-t pt-5">
            <p className="text-sm mb-4">
              Available:{" "}
              <span className="font-semibold">
                {product.available_quantity}
              </span>
            </p>

            {!soldOut && (
              <div className="flex items-end gap-3">
                <div>
                  <label className="text-sm block mb-1">
                    Quantity
                  </label>

                  <select
                    value={quantity}
                    onChange={(e) => setQuantity(Number(e.target.value))}
                    className="border border-slate-300 rounded-md px-3 py-2 bg-white"
                  >
                    {Array.from(
                      { length: maxQuantity },
                      (_, index) => index + 1
                    ).map((number) => (
                      <option key={number} value={number}>
                        {number}
                      </option>
                    ))}
                  </select>
                </div>

                <button
                  onClick={buyNow}
                  className="bg-slate-900 text-white rounded-md px-6 py-2 hover:bg-slate-800 font-semibold"
                >
                  Buy Now
                </button>
              </div>
            )}

            {soldOut && (
              <p className="font-medium text-red-600">
                Currently unavailable
              </p>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}