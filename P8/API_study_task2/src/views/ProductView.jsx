import { useEffect, useState } from "react";
import { getProduct } from "../api";

function ProductView({ productId, goBack, onBuy }) {
  const [product, setProduct] = useState();
  const [qty,setQty] = useState(1);

  const [problem, setProblem] = useState("");


  useEffect(() => {
    getProduct(productId)
      .then(res => {
        setProduct(res.data);
      })
      .catch(err => {
        setProblem(err.message);
      });
  }, [productId]);


  if (problem) {
    return (
      <div className="mt-4">
        <p>Problem loading product: {problem}</p>

        <button onClick={goBack} className="border px-1 mt-3">
          Back
        </button>
      </div>
    );
  }

  if (!product)
    return <p>loading...</p>;


  const maxQty = Math.min(5, product.available_quantity);


  function quantityChanged(e) {
    let value = Number(e.target.value);

    if (value < 1)
      value = 1;

    if (value > maxQty) value = maxQty;

    setQty(value);
  }


  return (
    <div className="mt-4">
      <button onClick={goBack}>
        Back to products
      </button>

      <h2 className="font-bold mt-4 text-xl">
        {product.name}
      </h2>

      <img
        src={product.image_url}
        width="300"
        alt={product.name}
        className="mt-2"
      />

      <p className="mt-3">
        {product.description}
      </p>

      <p>
        Price: {product.price} {product.currency}
      </p>


      <h3 className="mt-4 font-bold">Features</h3>

      <ul className="list-disc ml-7">
        {product.features.map((feature, i) =>
          <li key={i}>{feature}</li>
        )}
      </ul>


      <p className="mt-4">
        Available: {product.available_quantity}
      </p>


      {product.available_quantity === 0 ? (
        <p>Out of stock</p>
      ) : (
        <div>
          <label htmlFor="quantity">
            Quantity
          </label>

          <input
            id="quantity"
            className="border ml-2 w-16"
            type="number"
            min="1"
            max={maxQty}
            value={qty}
            onChange={quantityChanged}
          />

          <br/>

          <button
            className="px-3 border mt-4 py-1"
            onClick={() => onBuy(product, qty)}
          >
            Buy now
          </button>
        </div>
      )}
    </div>
  );
}

export default ProductView;