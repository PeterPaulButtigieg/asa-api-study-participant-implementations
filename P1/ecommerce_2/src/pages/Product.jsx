import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { getProduct } from "../api";

function Product({
  setCheckoutProduct,
  quantity,
  setQuantity,
}) {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    async function loadProduct() {
      try {
        const response = await getProduct(id);
        setProduct(response.data);
        setQuantity(1);
      } catch {
        setError(true);
      }
    }

    loadProduct();
  }, [id, setQuantity]);

  if (error) {
    return (
      <div className="page">
        <h1>Product</h1>

        <div role="status">
          The product could not be found.
        </div>

        <Link className="button" to="/">
          Back to products
        </Link>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="page">
        <p>Loading product...</p>
      </div>
    );
  }

  const maximumQuantity = Math.min(
    product.available_quantity,
    5
  );

  function checkout() {
    setCheckoutProduct(product);
    navigate("/checkout");
  }

  return (
    <div className="page">
      <Link className="back-link" to="/">
        Back to products
      </Link>

      <div className="product-detail">
        <img
          src={product.image_url}
          alt={product.name}
          className="detail-image"
        />

        <div>
          <h1>{product.name}</h1>

          <p>{product.description}</p>

          <div className="detail-price">
            {product.currency} {product.price}
          </div>

          <div>
            {product.available_quantity} available
          </div>

          <h2>Features</h2>

          <ul className="features">
            {product.features.map((feature) => (
              <li key={feature}>
                {feature}
              </li>
            ))}
          </ul>

          {maximumQuantity > 0 ? (
            <>
              <div className="quantity-area">
                <label htmlFor="quantity">
                  Quantity
                </label>

                <select
                  id="quantity"
                  value={quantity}
                  onChange={(event) =>
                    setQuantity(
                      Number(event.target.value)
                    )
                  }
                >
                  {Array.from(
                    { length: maximumQuantity },
                    (_, index) => index + 1
                  ).map((number) => (
                    <option
                      value={number}
                      key={number}
                    >
                      {number}
                    </option>
                  ))}
                </select>
              </div>

              <button onClick={checkout}>
                Buy now
              </button>
            </>
          ) : (
            <p>Out of stock</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Product;