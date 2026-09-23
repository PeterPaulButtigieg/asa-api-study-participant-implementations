import { useState } from "react";
import { createOrder } from "../api";


export default function Checkout() {
  const stored = sessionStorage.getItem("cart");
  const cart = stored ? JSON.parse(stored) : null;

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
  const [fieldErrors, setFieldErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);


  function updateField(e) {
    const { name, value } = e.target;

    setForm({
      ...form,
      [name]: value,
    });

    if (fieldErrors[name]) {
      setFieldErrors({
        ...fieldErrors,
        [name]: "",
      });
    }
  }


  function getFieldErrors(err) {
    const errors = {};

    if (!Array.isArray(err.data?.detail)) {
      return errors;
    }

    err.data.detail.forEach((item) => {
      const location = item.loc || [];
      const field = location[location.length - 1];

      if (typeof field === "string") {
        errors[field] = item.msg || "Please check this value.";
      }
    });

    return errors;
  }


  function fieldError(name) {
    if (!fieldErrors[name]) return null;

    return (
      <p
        id={`${name}-error`}
        className="text-red-700 text-sm mt-1"
      >
        {fieldErrors[name]}
      </p>
    );
  }


  async function submitOrder(e) {
    e.preventDefault();

    setError("");
    setFieldErrors({});

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
      setFieldErrors(getFieldErrors(err));
      setSubmitting(false);
    }
  }


  if (!cart) {
    return (
      <main className="py-10 max-w-5xl px-5 mx-auto">
        <div className="border bg-white border-slate-200 rounded-xl p-6">
          <h1 className="text-2xl font-bold mb-2">
            Checkout
          </h1>

          <p role="status" className="text-slate-600">
            Your cart is empty.
          </p>
        </div>
      </main>
    );
  }


  const total = cart.price * cart.quantity;

  return (
    <main className="max-w-5xl px-5 mx-auto py-8">
      <h1 className="font-bold text-3xl mb-7">
        Checkout
      </h1>

      <div className="grid gap-6 items-start md:grid-cols-[1fr_320px]">
        <form
          onSubmit={submitOrder}
          className="p-6 bg-white border rounded-xl border-slate-200 shadow-sm"
        >
          {error && (
            <div
              role="alert"
              aria-live="assertive"
              className="border-red-200 border text-red-700 bg-red-50 rounded-md mb-5 p-3 text-sm"
            >
              {error}
            </div>
          )}

          <fieldset className="mb-7">
            <legend className="font-semibold text-lg mb-4">
              Customer
            </legend>

            <div className="grid gap-4">
              <div>
                <label htmlFor="full_name" className="mb-1 text-sm block">
                  Full name
                </label>

                <input
                  id="full_name"
                  name="full_name"
                  value={form.full_name}
                  onChange={updateField}
                  required
                  maxLength={100}
                  autoComplete="name"
                  aria-invalid={!!fieldErrors.full_name}
                  aria-describedby={
                    fieldErrors.full_name ? "full_name-error" : undefined
                  }
                  className="w-full rounded-md border-slate-300 border px-3 py-2 focus:ring-2 focus:ring-slate-600 focus:outline-none"
                />

                {fieldError("full_name")}
              </div>

              <div>
                <label htmlFor="email" className="block text-sm mb-1">
                  Email
                </label>

                <input
                  id="email"
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={updateField}
                  required
                  autoComplete="email"
                  aria-invalid={!!fieldErrors.email}
                  aria-describedby={
                    fieldErrors.email ? "email-error" : undefined
                  }
                  className="border w-full border-slate-300 px-3 rounded-md py-2 focus:outline-none focus:ring-2 focus:ring-slate-600"
                />

                {fieldError("email")}
              </div>
            </div>
          </fieldset>


          <fieldset className="border-t pt-6 mb-7">
            <legend className="font-semibold text-lg px-1">
              Delivery address
            </legend>

            <div className="grid gap-4 mt-3">
              <div>
                <label
                  htmlFor="address_line"
                  className="block text-sm mb-1"
                >
                  Address line
                </label>

                <input
                  id="address_line"
                  name="address_line"
                  value={form.address_line}
                  onChange={updateField}
                  required
                  maxLength={200}
                  autoComplete="street-address"
                  aria-invalid={!!fieldErrors.address_line}
                  aria-describedby={
                    fieldErrors.address_line
                      ? "address_line-error"
                      : undefined
                  }
                  className="w-full py-2 px-3 border rounded-md border-slate-300 focus:ring-2 focus:ring-slate-600 focus:outline-none"
                />

                {fieldError("address_line")}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="city" className="text-sm block mb-1">
                    Town
                  </label>

                  <input
                    id="city"
                    name="city"
                    value={form.city}
                    onChange={updateField}
                    required
                    maxLength={100}
                    autoComplete="address-level2"
                    aria-invalid={!!fieldErrors.city}
                    aria-describedby={
                      fieldErrors.city ? "city-error" : undefined
                    }
                    className="border-slate-300 border rounded-md w-full px-3 py-2 focus:ring-2 focus:ring-slate-600 focus:outline-none"
                  />

                  {fieldError("city")}
                </div>

                <div>
                  <label
                    htmlFor="postcode"
                    className="text-sm mb-1 block"
                  >
                    Post code
                  </label>

                  <input
                    id="postcode"
                    name="postcode"
                    value={form.postcode}
                    onChange={updateField}
                    required
                    maxLength={20}
                    autoComplete="postal-code"
                    aria-invalid={!!fieldErrors.postcode}
                    aria-describedby={
                      fieldErrors.postcode ? "postcode-error" : undefined
                    }
                    className="rounded-md w-full border px-3 border-slate-300 py-2 focus:outline-none focus:ring-2 focus:ring-slate-600"
                  />

                  {fieldError("postcode")}
                </div>
              </div>
            </div>
          </fieldset>


          <fieldset className="border-t pt-6">
            <legend className="text-lg font-semibold px-1">
              Payment
            </legend>

            <div className="grid gap-4 mt-3">
              <div>
                <label
                  htmlFor="cardholder_name"
                  className="block mb-1 text-sm"
                >
                  Card name
                </label>

                <input
                  id="cardholder_name"
                  name="cardholder_name"
                  value={form.cardholder_name}
                  onChange={updateField}
                  required
                  maxLength={100}
                  autoComplete="cc-name"
                  aria-invalid={!!fieldErrors.cardholder_name}
                  aria-describedby={
                    fieldErrors.cardholder_name
                      ? "cardholder_name-error"
                      : undefined
                  }
                  className="w-full border border-slate-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-slate-600 focus:outline-none"
                />

                {fieldError("cardholder_name")}
              </div>

              <div>
                <label
                  htmlFor="card_number"
                  className="text-sm block mb-1"
                >
                  Card number
                </label>

                <input
                  id="card_number"
                  name="card_number"
                  value={form.card_number}
                  onChange={updateField}
                  required
                  minLength={12}
                  maxLength={23}
                  inputMode="numeric"
                  autoComplete="cc-number"
                  aria-invalid={!!fieldErrors.card_number}
                  aria-describedby={
                    fieldErrors.card_number
                      ? "card_number-error"
                      : undefined
                  }
                  className="border border-slate-300 w-full rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-slate-600"
                />

                {fieldError("card_number")}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label
                    htmlFor="expiry_date"
                    className="block text-sm mb-1"
                  >
                    Expiry date
                  </label>

                  <input
                    id="expiry_date"
                    name="expiry_date"
                    value={form.expiry_date}
                    onChange={updateField}
                    required
                    placeholder="MM/YY"
                    pattern="\d{2}/\d{2}"
                    autoComplete="cc-exp"
                    aria-invalid={!!fieldErrors.expiry_date}
                    aria-describedby={
                      fieldErrors.expiry_date
                        ? "expiry_date-error"
                        : undefined
                    }
                    className="w-full px-3 rounded-md py-2 border border-slate-300 focus:ring-2 focus:ring-slate-600 focus:outline-none"
                  />

                  {fieldError("expiry_date")}
                </div>

                <div>
                  <label
                    htmlFor="security_code"
                    className="text-sm block mb-1"
                  >
                    CVV
                  </label>

                  <input
                    id="security_code"
                    name="security_code"
                    value={form.security_code}
                    onChange={updateField}
                    required
                    pattern="\d{3,4}"
                    inputMode="numeric"
                    autoComplete="cc-csc"
                    aria-invalid={!!fieldErrors.security_code}
                    aria-describedby={
                      fieldErrors.security_code
                        ? "security_code-error"
                        : undefined
                    }
                    className="border border-slate-300 rounded-md px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-slate-600"
                  />

                  {fieldError("security_code")}
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="px-6 mt-6 py-3 font-semibold bg-slate-900 rounded-md text-white disabled:opacity-50 focus:ring-offset-2 focus:ring-2 focus:ring-slate-700 focus:outline-none"
            >
              {submitting ? "Processing..." : "Place order"}
            </button>

            {submitting && (
              <span className="sr-only" role="status" aria-live="polite">
                Your order is being processed
              </span>
            )}
          </fieldset>
        </form>


        <aside
          className="rounded-xl bg-white border p-5 border-slate-200 md:sticky md:top-5"
          aria-labelledby="cart-title"
        >
          <h2 id="cart-title" className="text-lg font-bold mb-4">
            Your cart
          </h2>

          <div className="flex gap-3">
            <img
              src={cart.image}
              alt={cart.name}
              className="h-20 w-20 rounded object-contain bg-slate-50"
            />

            <div>
              <p className="font-medium">{cart.name}</p>

              <p className="text-slate-500 text-sm mt-1">
                Quantity: {cart.quantity}
              </p>

              <p className="mt-1 text-sm">
                {cart.price} {cart.currency} each
              </p>
            </div>
          </div>

          <div className="border-t mt-5 pt-4 font-bold flex justify-between border-slate-200">
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