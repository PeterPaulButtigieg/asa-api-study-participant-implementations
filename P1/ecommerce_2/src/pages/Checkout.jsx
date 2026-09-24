import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { createOrder } from "../api";

function Checkout({ product, quantity }) {
  const navigate = useNavigate();

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(false);

  if (!product) {
    return (
      <div className="page">
        <h1>Checkout</h1>

        <p>No product has been selected.</p>

        <Link className="button" to="/">
          View products
        </Link>
      </div>
    );
  }

  async function handleSubmit(event) {
    event.preventDefault();

    setSubmitting(true);
    setError(false);

    const form = new FormData(event.currentTarget);

    const order = {
      product_id: product.id,
      quantity,

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
      setError(true);
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

        <label htmlFor="full-name">
          Full name
        </label>
        <input
          id="full-name"
          name="full_name"
          type="text"
          required
        />

        <label htmlFor="email">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
        />

        <h2>Delivery address</h2>

        <label htmlFor="address">
          Address
        </label>
        <input
          id="address"
          name="address_line"
          type="text"
          required
        />

        <label htmlFor="city">
          City
        </label>
        <input
          id="city"
          name="city"
          type="text"
          required
        />

        <label htmlFor="postcode">
          Postcode
        </label>
        <input
          id="postcode"
          name="postcode"
          type="text"
          required
        />

        <h2>Payment</h2>

        <label htmlFor="card-name">
          Cardholder name
        </label>
        <input
          id="card-name"
          name="cardholder_name"
          type="text"
          required
        />

        <label htmlFor="card-number">
          Card number
        </label>
        <input
          id="card-number"
          name="card_number"
          type="text"
          required
        />

        <label htmlFor="expiry">
          Expiry date
        </label>
        <input
          id="expiry"
          name="expiry_date"
          type="text"
          placeholder="MM/YY"
          required
        />

        <label htmlFor="security-code">
          Security code
        </label>
        <input
          id="security-code"
          name="security_code"
          type="text"
          required
        />

        {error && (
          <div className="error" role="alert">
            There was a problem placing your order.
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