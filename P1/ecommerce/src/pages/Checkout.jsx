import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { createOrder } from "../api";

function Checkout({ product, quantity }) {
  const navigate = useNavigate();

  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (!product) {
    return (
      <div className="page">
        <h1>Checkout</h1>

        <div>No product selected.</div>

        <Link className="button" to="/">
          View products
        </Link>
      </div>
    );
  }

  async function handleSubmit(event) {
    event.preventDefault();

    setSubmitting(true);
    setError("");

    const form = new FormData(event.currentTarget);

    const order = {
      product_id: product.id,
      quantity: quantity,

      customer: {
        full_name: form.get("full_name"),
        email: form.get("email"),
      },

      delivery_address: {
        address_line: form.get("address_line"),
        city: form.get("city"),
        postcode: form.get("postcode"),
      },

      payment: {
        cardholder_name: form.get("cardholder_name"),
        card_number: form.get("card_number"),
        expiry_date: form.get("expiry_date"),
        security_code: form.get("security_code"),
      },
    };

    try {
      const response = await createOrder(order);

      navigate("/confirmation", {
        state: {
          order: response.data,
        },
      });
    } catch {
      setError("Could not place order.");
      setSubmitting(false);
    }
  }

  return (
    <div className="page checkout-page">
      <h1>Checkout</h1>

      <div className="checkout-summary">
        <img
          src={product.image_url}
          alt={product.name}
          className="checkout-image"
        />

        <div>
          <h2>{product.name}</h2>

          <div>
            Quantity: {quantity}
          </div>

          <div>
            {product.currency}{" "}
            {(product.price * quantity).toFixed(2)}
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <h2>Customer details</h2>

        <input
          name="full_name"
          type="text"
          placeholder="Full name"
          required
        />

        <input
          name="email"
          type="email"
          placeholder="Email"
          required
        />

        <h2>Delivery address</h2>

        <input
          name="address_line"
          type="text"
          placeholder="Address"
          required
        />

        <input
          name="city"
          type="text"
          placeholder="City"
          required
        />

        <input
          name="postcode"
          type="text"
          placeholder="Postcode"
          required
        />

        <h2>Payment</h2>

        <input
          name="cardholder_name"
          type="text"
          placeholder="Cardholder name"
          required
        />

        <input
          name="card_number"
          type="text"
          placeholder="Card number"
          required
        />

        <input
          name="expiry_date"
          type="text"
          placeholder="MM/YY"
          required
        />

        <input
          name="security_code"
          type="text"
          placeholder="CVV"
          required
        />

        {error && (
          <div className="error">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={submitting}
        >
          {submitting
            ? "Placing order..."
            : "Place order"}
        </button>
      </form>
    </div>
  );
}

export default Checkout;