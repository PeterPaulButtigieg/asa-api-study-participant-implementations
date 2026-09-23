import { useState } from "react";
import { createOrder } from "../api";

export default function Checkout() {
  const storedCart = sessionStorage.getItem("cart");
  const cart = storedCart ? JSON.parse(storedCart) : null;

  const [form, setForm] = useState({
    full_name: "",
    email: "",
    address_line: "",
    city: "",
    postcode: "",
    cardholder_name: "",
    card_number: "",
    expiry_date: "",
    security_code: "",
  });

  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  function updateField(e) {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  }

  async function submitOrder(e) {
    e.preventDefault();
    setError("");

    if (!cart) {
      setError("There is nothing in your cart.");
      return;
    }

    setSubmitting(true);

    const order = {
      product_id: cart.productId,
      quantity: cart.quantity,

      customer: {
        full_name: form.full_name,
        email: form.email,
      },

      delivery_address: {
        address_line: form.address_line,
        city: form.city,
        postcode: form.postcode,
      },

      payment: {
        cardholder_name: form.cardholder_name,
        card_number: form.card_number,
        expiry_date: form.expiry_date,
        security_code: form.security_code,
      },
    };

    try {
      const response = await createOrder(order);

      sessionStorage.removeItem("cart");
      window.location.href = `/order/${response.data.id}`;
    } catch (err) {
      setError(err.message);
      setSubmitting(false);
    }
  }

  if (!cart) {
    return (
      <main className="max-w-5xl mx-auto py-10 px-5">
        <div className="bg-white p-6 border border-slate-200 rounded-xl">
          <h1 className="font-bold text-2xl mb-2">Checkout</h1>
          <p className="text-slate-600">Your cart is empty.</p>
        </div>
      </main>
    );
  }

  const total = cart.price * cart.quantity;

  return (
    <main className="max-w-5xl mx-auto py-8 px-5">
      <h1 className="text-3xl font-bold mb-7">Checkout</h1>

      <div className="grid md:grid-cols-[1fr_320px] gap-6 items-start">
        <form
          onSubmit={submitOrder}
          className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm"
        >
          {error && (
            <div className="bg-red-50 text-red-700 border border-red-200 p-3 mb-5 rounded-md text-sm">
              {error}
            </div>
          )}

          <section className="mb-7">
            <h2 className="font-semibold text-lg mb-4">
              Customer
            </h2>

            <div className="grid gap-4">
              <div>
                <label className="text-sm mb-1 block">Full name</label>
                <input
                  name="full_name"
                  value={form.full_name}
                  onChange={updateField}
                  required
                  maxLength={100}
                  className="w-full border rounded-md border-slate-300 px-3 py-2"
                />
              </div>

              <div>
                <label className="block text-sm mb-1">Email</label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={updateField}
                  required
                  className="border border-slate-300 w-full px-3 py-2 rounded-md"
                />
              </div>
            </div>
          </section>

          <section className="mb-7 border-t pt-6">
            <h2 className="text-lg font-semibold mb-4">
              Delivery address
            </h2>

            <div className="grid gap-4">
              <div>
                <label className="text-sm block mb-1">Address line</label>
                <input
                  name="address_line"
                  value={form.address_line}
                  onChange={updateField}
                  required
                  maxLength={200}
                  className="w-full px-3 border border-slate-300 rounded-md py-2"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block mb-1 text-sm">
                    Town
                  </label>
                  <input
                    name="city"
                    value={form.city}
                    onChange={updateField}
                    required
                    maxLength={100}
                    className="w-full border border-slate-300 px-3 py-2 rounded-md"
                  />
                </div>

                <div>
                  <label className="block text-sm mb-1">
                    Post code
                  </label>
                  <input
                    name="postcode"
                    value={form.postcode}
                    onChange={updateField}
                    required
                    maxLength={20}
                    className="w-full rounded-md px-3 py-2 border border-slate-300"
                  />
                </div>
              </div>
            </div>
          </section>

          <section className="border-t pt-6">
            <h2 className="text-lg font-semibold mb-4">
              Payment
            </h2>

            <div className="grid gap-4">
              <div>
                <label className="text-sm mb-1 block">
                  Card Name
                </label>
                <input
                  name="cardholder_name"
                  value={form.cardholder_name}
                  onChange={updateField}
                  required
                  maxLength={100}
                  className="border w-full rounded-md border-slate-300 py-2 px-3"
                />
              </div>

              <div>
                <label className="block text-sm mb-1">
                  Card number
                </label>
                <input
                  name="card_number"
                  value={form.card_number}
                  onChange={updateField}
                  required
                  minLength={12}
                  maxLength={23}
                  className="w-full border border-slate-300 rounded-md px-3 py-2"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm block mb-1">
                    Expiry date
                  </label>
                  <input
                    name="expiry_date"
                    value={form.expiry_date}
                    onChange={updateField}
                    required
                    pattern="\d{2}/\d{2}"
                    className="border rounded-md w-full px-3 py-2 border-slate-300"
                  />
                </div>

                <div>
                  <label className="text-sm block mb-1">CVV</label>
                  <input
                    name="security_code"
                    value={form.security_code}
                    onChange={updateField}
                    required
                    pattern="\d{3,4}"
                    className="border border-slate-300 px-3 py-2 rounded-md w-full"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="mt-6 bg-slate-900 px-6 py-3 rounded-md text-white font-semibold disabled:opacity-50"
            >
              {submitting ? "Processing..." : "Place order"}
            </button>
          </section>
        </form>

        <aside className="bg-white border border-slate-200 p-5 rounded-xl md:sticky md:top-5">
          <h2 className="font-bold text-lg mb-4">Your cart</h2>

          <div className="flex gap-3">
            <img
              src={cart.image}
              alt=""
              className="w-20 h-20 object-contain bg-slate-50 rounded"
            />

            <div>
              <p className="font-medium">{cart.name}</p>
              <p className="text-sm text-slate-500 mt-1">
                Quantity: {cart.quantity}
              </p>

              <p className="text-sm mt-1">
                {cart.price} {cart.currency} each
              </p>
            </div>
          </div>

          <div className="border-t border-slate-200 mt-5 pt-4 flex justify-between font-bold">
            <span>Total</span>
            <span>
              {total.toFixed(2)} {cart.currency}
            </span>
          </div>
        </aside>
      </div>
    </main>
  );
}