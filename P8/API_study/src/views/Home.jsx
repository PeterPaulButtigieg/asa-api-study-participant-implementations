import { useEffect, useState } from "react";
import { getProducts } from "../api";

function Home({ onViewProduct }) {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProducts()
      .then((result) => {
        setProducts(result.data);
      })
      .catch((err) => {
        setError(err.message);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>loading...</p>;

  if (error) return <p>error: {error}</p>;

  return (
    <div>
      <h2 className="text-xl mt-5">Products</h2>

      {products.map((product) => (
        <div key={product.id} className="mt-8">
          <img
            src={product.image_url}
            alt={product.name}
            width="180"
          />

          <h3 className="font-bold">{product.name}</h3>

          <p>
            {product.price} {product.currency}
          </p>

          <p>Features:</p>

          <ul className="list-disc ml-7">
            {product.features.map((feature, i) => (
              <li key={i}>{feature}</li>
            ))}
          </ul>

          <button
            className="border px-2 mt-2"
            onClick={() => onViewProduct(product.id)}
          >
            View product
          </button>

          <hr className="mt-6" />
        </div>
      ))}
    </div>
  );
}

export default Home;