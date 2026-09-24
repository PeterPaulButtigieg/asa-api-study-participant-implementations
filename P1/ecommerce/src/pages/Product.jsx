import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { getProduct } from "../api";

function Product({
  setSelectedProduct,
  quantity,
  setQuantity,
}) {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    getProduct(id)
      .then((response) => {
        setProduct(response.data);
      })
      .catch(() => {
        setError(true);
      });
  }, [id]);

  if (error) {
    return (
      <div className="page">
        Could not load product.
      </div>
    );
  }

  if (!product) {
    return (
      <div className="page">
        Loading...
      </div>
    );
  }

  const maxQuantity = Math.min(
    product.available_quantity,
    5
  );

  function buyNow() {
    setSelectedProduct(product);
    navigate("/checkout");
  }

  return (
    <div className="page">
      <Link to="/" className="back-link">
        Back to products
      </Link>

      <div className="product-detail">
        <div>
          <img
            src={product.image_url}
            alt={product.name}
            className="detail-image"
          />
        </div>

        <div>
          <h1>{product.name}</h1>

          <div className="detail-description">
            {product.description}
          </div>

          <div className="detail-price">
            {product.currency} {product.price}
          </div>

          <div className="stock">
            Available: {product.available_quantity}
          </div>

          <h2>Features</h2>

          <div className="features">
            {product.features.map((feature, index) => (
              <div key={index}>
                {feature}
              </div>
            ))}
          </div>

          {maxQuantity > 0 ? (
            <>
              <div className="quantity-area">
                <div>Quantity</div>

                <select
                  value={quantity}
                  onChange={(event) =>
                    setQuantity(
                      Number(event.target.value)
                    )
                  }
                >
                  {Array.from(
                    { length: maxQuantity },
                    (_, index) => index + 1
                  ).map((number) => (
                    <option
                      key={number}
                      value={number}
                    >
                      {number}
                    </option>
                  ))}
                </select>
              </div>

              <button onClick={buyNow}>
                Buy now
              </button>
            </>
          ) : (
            <div>Out of stock</div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Product;