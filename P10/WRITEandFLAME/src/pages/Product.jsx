import { useEffect, useState } from "react";
import { getProduct } from "../api";


export default function Product({ productId }) {
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [error, setError] = useState("");


  useEffect(() => {
    getProduct(productId)
      .then((res) => setProduct(res.data))
      .catch((err) => {
        setError(err.message);
      });
  }, [productId]);


  function buyNow() {
    if (!product) return;

    const cart = {
      productId: product.id,
      name: product.name,
      price: product.price,
      currency: product.currency,
      image: product.image_url,
      quantity: quantity,
    };

    sessionStorage.setItem("cart", JSON.stringify(cart));

    window.location.href = "/checkout";
  }


  if (error) {
    return (
      <main className="max-w-5xl mx-auto py-8 px-6">
        <div
          role="alert"
          aria-live="assertive"
          className="text-red-700 bg-red-50 rounded-lg border-red-200 border p-4"
        >
          {error}
        </div>
      </main>
    );
  }

  if (!product) {
    return (
      <main className="max-w-5xl py-8 px-6 mx-auto">
        <p role="status" className="text-slate-500" aria-live="polite">
          Loading product...
        </p>
      </main>
    );
  }


  const maxQuantity = Math.min(product.available_quantity, 5);
  const soldOut = product.available_quantity < 1;

  return (
    <main className="mx-auto max-w-5xl py-9 px-5">
      <div className="bg-white rounded-xl border border-slate-200 p-6 grid md:grid-cols-2 gap-9">
        <div>
          <img
            src={product.image_url}
            alt={product.name}
            className="w-full bg-slate-50 object-contain rounded-lg h-[410px]"
          />
        </div>

        <section className="pt-1">
          <h1 className="font-bold text-3xl mb-3">
            {product.name}
          </h1>

          <p className="text-slate-600 mb-5 leading-6">
            {product.description}
          </p>

          <p className="font-bold text-2xl mb-6">
            {product.price}{" "}
            <span className="font-normal text-slate-500 text-base">
              {product.currency}
            </span>
          </p>

          <h2 className="font-semibold mb-2 text-base">
            Features
          </h2>

          <ul className="mb-6 list-disc ml-5 text-sm text-slate-600">
            {product.features.map((feature) => (
              <li key={feature} className="mb-1">
                {feature}
              </li>
            ))}
          </ul>

          <div className="border-t pt-5">
            <p className="text-sm mb-4">
              Available:{" "}
              <strong>{product.available_quantity}</strong>
            </p>

            {!soldOut ? (
              <div className="flex gap-3 items-end">
                <div>
                  <label
                    htmlFor="quantity"
                    className="block text-sm mb-1"
                  >
                    Quantity
                  </label>

                  <select
                    id="quantity"
                    value={quantity}
                    onChange={(e) => setQuantity(Number(e.target.value))}
                    className="rounded-md px-3 py-2 bg-white border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-600"
                  >
                    {Array.from(
                      { length: maxQuantity },
                      (_, index) => index + 1
                    ).map((number) => (
                      <option value={number} key={number}>
                        {number}
                      </option>
                    ))}
                  </select>
                </div>

                <button
                  type="button"
                  onClick={buyNow}
                  className="font-semibold px-6 py-2 text-white bg-slate-900 rounded-md hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-700"
                >
                  Buy now
                </button>
              </div>
            ) : (
              <p role="status" className="text-red-700 font-medium">
                Currently unavailable
              </p>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}