import { useEffect, useState } from "react";
import { getProduct } from "../api";

function ProductView({ productId, onBuy, onBack }) {
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [error, setError] = useState("");

  useEffect(() => {
    getProduct(productId)
      .then((result) => setProduct(result.data))
      .catch((err) => setError(err.message));
  }, [productId]);

  if (error) {
    return (
      <div>
        <p>Error loading product: {error}</p>
        <button onClick={onBack}>go back</button>
      </div>
    );
  }

  if (!product) return <p>loading product...</p>;

  const maxQuantity = Math.min(product.available_quantity, 5);

  function changeQuantity(e) {
    let q = Number(e.target.value);

    if (q < 1) q = 1;
    if (q > maxQuantity) q = maxQuantity;

    setQuantity(q);
  }

  return (
    <div className="mt-5">
      <button onClick={onBack}>Back</button>

      <h2 className="font-bold text-xl mt-4">{product.name}</h2>

      <img
        src={product.image_url}
        alt={product.name}
        width="300"
        className="mt-2"
      />

      <p className="mt-4">{product.description}</p>

      <p>
        Price: {product.price} {product.currency}
      </p>

      <h3 className="font-bold mt-3">Features</h3>

      <ul className="list-disc ml-7">
        {product.features.map((feature, i) => (
          <li key={i}>{feature}</li>
        ))}
      </ul>

      <p className="mt-3">
        Available quantity: {product.available_quantity}
      </p>

      {product.available_quantity > 0 ? (
        <>
          <p className="mt-4">
            Quantity:
            <input
              className="border ml-2 w-16"
              type="number"
              value={quantity}
              min="1"
              max={maxQuantity}
              onChange={changeQuantity}
            />
          </p>

          <button
            className="border mt-3 px-3 py-1"
            onClick={() => onBuy(product, quantity)}
          >
            Buy Now
          </button>
        </>
      ) : (
        <p>Out of stock</p>
      )}
    </div>
  );
}

export default ProductView;