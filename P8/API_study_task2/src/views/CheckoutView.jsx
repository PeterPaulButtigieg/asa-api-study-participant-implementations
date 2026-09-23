import { useState } from "react";
import { createOrder } from "../api";


function CheckoutView({ cart, back, orderFinished }) {

  const [values, setValues] = useState({
    fullName: "",
    email: "",
    address: "",
    city: "",
    postcode: "",

    cardName: "",
    cardNumber: "",
    expiry: "",
    cvv: ""
  });

  const [serverErrors,setServerErrors] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [submitting,setSubmitting] = useState(false);


  function update(e) {
    setValues({
      ...values,
      [e.target.name]: e.target.value
    });
  }


  function handleApiError(err) {
    const errors = [];

    if (Array.isArray(err.data?.detail)) {
      err.data.detail.forEach((item) => {
        errors.push(item.msg || item.message || "Invalid value");
      });
    } else {
      errors.push(err.message || "Order could not be completed");
    }

    const accessibilityNudges = err.accessibility?.nudges || [];

    const apiSuggestions = accessibilityNudges
      .filter(nudge => nudge.type === "error-suggestion")
      .flatMap(nudge => {
        if (Array.isArray(nudge.values))
          return nudge.values;

        if (nudge.message)
          return [nudge.message];

        return [];
      });

    setServerErrors(errors);
    setSuggestions(apiSuggestions);
  }


  async function sendOrder(e) {
    e.preventDefault();

    setServerErrors([]);
    setSuggestions([]);
    setSubmitting(true);


    const order = {
      product_id: cart.product.id,
      quantity: cart.quantity,

      customer: {
        full_name: values.fullName,
        email: values.email
      },

      delivery_address: {
        address_line: values.address,
        city: values.city,
        postcode: values.postcode
      },

      payment: {
        cardholder_name: values.cardName,
        card_number: values.cardNumber,
        expiry_date: values.expiry,
        security_code: values.cvv
      }
    };


    try {
      const result = await createOrder(order);

      orderFinished(result.data);
    }
    catch (err) {
      handleApiError(err);
    }

    setSubmitting(false);
  }


  const total = cart.product.price * cart.quantity;


  return (
    <div className="mt-4">
      <button onClick={back}>back</button>

      <h2 className="font-bold text-xl mt-3">
        Checkout
      </h2>


      <hr className="my-5"/>


      {serverErrors.length > 0 && (
        <div
          role="alert"
          aria-live="assertive"
          className="mb-5"
        >
          <p className="font-bold">
            There was a problem with the order
          </p>

          <ul className="list-disc ml-6">
            {serverErrors.map((error, i) => (
              <li key={i}>{error}</li>
            ))}
          </ul>

          {suggestions.length > 0 && (
            <div className="mt-2">
              <p>Try this:</p>

              <ul className="ml-6 list-disc">
                {suggestions.map((text, i) => (
                  <li key={i}>{text}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}


      <form onSubmit={sendOrder}>

        <h3 className="font-bold">
          Customer details
        </h3>

        <div className="mt-2">
          <label htmlFor="fullName">Full name</label>
          <br/>

          <input
            id="fullName"
            name="fullName"
            value={values.fullName}
            onChange={update}
            autoComplete="name"
            required
            className="border"
          />
        </div>


        <div>
          <label htmlFor="email">Email</label>
          <br/>

          <input
            id="email"
            type="email"
            name="email"
            required
            value={values.email}
            onChange={update}
            autoComplete="email"
            className="border"
          />
        </div>


        <h3 className="font-bold mt-5">
          Delivery
        </h3>

        <div>
          <label htmlFor="address">Address</label>
          <br/>

          <input
            id="address"
            className="border"
            name="address"
            required
            autoComplete="street-address"
            value={values.address}
            onChange={update}
          />
        </div>


        <div>
          <label htmlFor="city">City</label>
          <br/>

          <input
            id="city"
            name="city"
            value={values.city}
            required
            onChange={update}
            className="border"
          />
        </div>

        <div>
          <label htmlFor="postcode">Postcode</label>
          <br/>

          <input
            id="postcode"
            name="postcode"
            required
            className="border"
            value={values.postcode}
            onChange={update}
            autoComplete="postal-code"
          />
        </div>


        <h3 className="font-bold mt-5">
          Payment details
        </h3>

        <p>
          4242 4242 4242 4242
        </p>


        <div className="mt-2">
          <label htmlFor="cardName">Cardholder name</label>
          <br/>

          <input
            id="cardName"
            name="cardName"
            className="border"
            value={values.cardName}
            onChange={update}
            required
          />
        </div>


        <div>
          <label htmlFor="cardNumber">Card number</label>
          <br/>

          <input
            id="cardNumber"
            name="cardNumber"
            value={values.cardNumber}
            onChange={update}
            className="border"
            required
            minLength="12"
            maxLength="23"
          />
        </div>


        <div>
          <label htmlFor="expiry">Expiry date (MM/YY)</label>
          <br/>

          <input
            id="expiry"
            name="expiry"
            pattern="\d{2}/\d{2}"
            value={values.expiry}
            onChange={update}
            required
            className="border"
          />
        </div>


        <div>
          <label htmlFor="cvv">CVV</label>
          <br/>

          <input
            id="cvv"
            name="cvv"
            value={values.cvv}
            onChange={update}
            required
            maxLength="4"
            className="border w-20"
          />
        </div>


        <button
          type="submit"
          disabled={submitting}
          className="mt-5 border py-1 px-2"
        >
          {submitting ? "Sending..." : "Place order"}
        </button>
      </form>
    </div>
  );
}

export default CheckoutView;