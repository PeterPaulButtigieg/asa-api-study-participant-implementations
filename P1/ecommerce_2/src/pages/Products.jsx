import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getProducts } from "../api";

function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    async function loadProducts() {
      try {
        const response = await getProducts();
        setProducts(response.data);
      } catch {
        setError(true);
      }

      setLoading(false);
    }

    loadProducts();
  }, []);

  if (loading) {
    return (
      <div className="page">
        <p>Loading products...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page" role="alert">
        <h1>Products</h1>
        <p>Products could not be loaded.</p>
      </div>
    );
  }

  return (
    <div className="page">
      <h1>Products</h1>

      <div className="product-list">
        {products.map((product) => (
          <article className="product-card" key={product.id}>
            <img
              src={product.image_url}
              alt={product.name}
              className="product-image"
            />

            <h2>{product.name}</h2>

            <p>{product.description}</p>

            <div className="product-price">
              {product.currency} {product.price}
            </div>

            <Link
              className="button"
              to={`/products/${product.id}`}
            >
              View product
            </Link>
          </article>
        ))}
      </div>
    </div>
  );
}

export default Products;