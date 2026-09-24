import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getProducts } from "../api";

function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    getProducts()
      .then((response) => {
        setProducts(response.data);
      })
      .catch(() => {
        setError(true);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="page">
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div className="page">
        Something went wrong.
      </div>
    );
  }

  return (
    <div className="page">
      <h1>Products</h1>

      <div className="product-list">
        {products.map((product) => (
          <div className="product-card" key={product.id}>
            <img
              src={product.image_url}
              alt={product.name}
              className="product-image"
            />

            <h2>{product.name}</h2>

            <div className="product-description">
              {product.description}
            </div>

            <div className="product-price">
              {product.currency} {product.price}
            </div>

            <Link
              className="button"
              to={`/products/${product.id}`}
            >
              View product
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Products;