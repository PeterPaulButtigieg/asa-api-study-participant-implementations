import { useEffect, useState } from "react";
import { getProducts } from "../api";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");


  useEffect(() => {
    getProducts()
      .then((res) => {
        setProducts(res.data);
      })
      .catch((err) => setError(err.message))
      .finally(() => {
        setLoading(false);
      });
  }, []);


  if (loading) {
    return (
      <main className="max-w-6xl p-6 mx-auto">
        <p role="status" aria-live="polite" className="text-slate-500">
          Loading products...
        </p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="mx-auto max-w-6xl py-8 px-5">
        <div
          role="alert"
          className="border p-4 rounded-lg bg-red-50 border-red-200 text-red-700"
        >
          {error}
        </div>
      </main>
    );
  }


  return (
    <main className="max-w-6xl mx-auto px-5 py-9">
      <div className="mb-6">
        <h1 className="font-bold text-3xl">Shop</h1>
      </div>

      <div className="grid lg:grid-cols-3 grid-cols-1 gap-5 md:grid-cols-2">
        {products.map((product) => (
          <article
            key={product.id}
            className="border bg-white border-slate-200 rounded-xl p-5 shadow-sm"
          >
            <img
              src={product.image_url}
              alt={product.name}
              className="bg-slate-50 rounded-lg object-contain h-48 w-full mb-4"
            />

            <h2 className="text-lg font-semibold">{product.name}</h2>

            <p className="mt-2 text-xl font-bold mb-3">
              {product.price}{" "}
              <span className="font-normal text-sm text-slate-500">
                {product.currency}
              </span>
            </p>

            <ul className="mb-5 text-sm text-slate-600 list-disc ml-5">
              {product.features.map((feature) => (
                <li key={feature} className="mb-1">
                  {feature}
                </li>
              ))}
            </ul>

            <a
              href={`/product/${product.id}`}
              className="bg-slate-900 text-white rounded-md inline-block py-2 px-4 text-sm font-medium focus:ring-2 focus:ring-offset-2 focus:ring-slate-700 focus:outline-none"
            >
              Check me out
            </a>
          </article>
        ))}
      </div>
    </main>
  );
}