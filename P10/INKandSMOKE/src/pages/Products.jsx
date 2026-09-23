import { useEffect, useState } from "react";
import { getProducts } from "../api";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getProducts()
      .then((response) => {
        setProducts(response.data);
      })
      .catch((err) => {
        setError(err.message);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <main className="max-w-6xl mx-auto p-6">
        <p className="text-slate-500">Loading products...</p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="max-w-6xl mx-auto px-6 py-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
          {error}
        </div>
      </main>
    );
  }

  return (
    <main className="max-w-6xl mx-auto py-8 px-5">
      <div className="mb-7">
        <h1 className="text-3xl font-bold">Shop</h1>


      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {products.map((product) => (
          <div
            key={product.id}
            className="bg-white rounded-xl border p-5 border-slate-200 shadow-sm p-5"
          >
            <img
              src={product.image_url}
              alt=""
              className="w-full h-48 object-contain bg-slate-50 rounded-lg mb-4"
            />

            <h2 className="font-semibold text-lg">{product.name}</h2>

            <div className="font-bold text-xl mt-2 mb-3">
              {product.price}{" "}
              <span className="text-sm font-normal text-slate-500">
                {product.currency}
              </span>
            </div>

            <div className="mb-5">
              {product.features.map((feature) => (
                <div
                  key={feature}
                  className="text-sm text-slate-600 mb-1"
                >
                  • {feature}
                </div>
              ))}
            </div>

            <a
              href={`/product/${product.id}`}
              className="inline-block rounded-md text-white bg-slate-900 px-4 py-2 text-sm font-medium px-4"
            >
              Check it Out
            </a>
          </div>
        ))}
      </div>
    </main>
  );
}