import { useState } from "react";
import { createOrder } from "../api";

function CheckoutView({ cart, onBack, onSuccess }) {
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    address: "",
    city: "",
    postcode: "",
    cardholderName: "",
    cardNumber: "",
    expiryDate: "",
    securityCode: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function change(e) {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  }

  async function submit(e) {
    e.preventDefault();

    setError("");
    setLoading(true);

    const data = {
      product_id: cart.product.id,
      quantity: cart.quantity,

      customer: {
        full_name: form.fullName,
        email: form.email,
      },

      delivery_address: {
        address_line: form.address,
        city: form.city,
        postcode: form.postcode,
      },

      payment: {
        cardholder_name: form.cardholderName,
        card_number: form.cardNumber,
        expiry_date: form.expiryDate,
        security_code: form.securityCode,
      },
    };

    try {
      const result = await createOrder(data);
      onSuccess(result.data);
    } catch (err) {
      setError(err.message);
    }

    setLoading(false);
  }

  const total = cart.product.price * cart.quantity;

  return (
    <div className="mt-4">
      <button onClick={onBack}>back</button>

      <h2 className="text-xl font-bold mt-3">Checkout</h2>

      
      <hr className="my-5" />

      {error && (
        <p className="text-red-700">
          Something went wrong: {error}
        </p>
      )}

      <form onSubmit={submit}>
        <h3 className="font-bold">Customer details</h3>

        <p className="mt-2">
          Full name<br />
          <input
            className="border"
            name="fullName"
            value={form.fullName}
            onChange={change}
            required
          />
        </p>

        <p>
          Email<br />
          <input
            className="border"
            name="email"
            type="email"
            value={form.email}
            onChange={change}
            required
          />
        </p>

        <h3 className="font-bold mt-5">Address</h3>

        <p>
          Address<br />
          <input
            className="border"
            name="address"
            value={form.address}
            onChange={change}
            required
          />
        </p>

        <p>
          City<br />
          <input
            name="city"
            className="border"
            value={form.city}
            onChange={change}
            required
          />
        </p>

        <p>
          Postcode<br />
          <input
            name="postcode"
            className="border"
            value={form.postcode}
            onChange={change}
            required
          />
        </p>

        <h3 className="font-bold mt-5">Card details</h3>

        <p>
          Test card: 4242 4242 4242 4242
        </p>

        <p>
          Cardholder name<br />
          <input
            name="cardholderName"
            value={form.cardholderName}
            onChange={change}
            className="border"
            required
          />
        </p>

        <p>
          Card number<br />
          <input
            name="cardNumber"
            value={form.cardNumber}
            onChange={change}
            className="border"
            required
          />
        </p>

        <p>
          Expiry date<br />
          <input
            name="expiryDate"
            value={form.expiryDate}
            onChange={change}
            className="border"
            required
          />
        </p>

        <p>
          CVV<br />
          <input
            name="securityCode"
            value={form.securityCode}
            onChange={change}
            pattern="\d{3,4}"
            className="border"
            required
          />
        </p>

        <br />

        <button className="border px-2" disabled={loading}>
          {loading ? "placing order..." : "Place order"}
        </button>
      </form>
    </div>
  );
}

export default CheckoutView;