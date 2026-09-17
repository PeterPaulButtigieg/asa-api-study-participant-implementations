import {
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type FormEvent,
} from "react";

import {
  Link,
  Navigate,
  useLocation,
  useNavigate,
} from "react-router";

import {
  ApiError,
  createOrder,
} from "../api";

import type {
  Cart,
  CheckoutPayload,
} from "../types";


type FormValues = {
  fullName: string;
  email: string;

  address: string;
  city: string;
  postcode: string;

  cardholderName: string;
  cardNumber: string;
  expiryDate: string;
  securityCode: string;
};


type DisplayError = {
  message: string;
  status?: number;
  body?: unknown;
};


function CheckoutPage() {
  const location = useLocation();
  const navigate = useNavigate();


  const headingRef =
    useRef<HTMLHeadingElement>(null);


  const cart = (
    location.state as {
      cart?: Cart;
    } | null
  )?.cart;


  const [form, setForm] =
    useState<FormValues>({
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


  const [submitting, setSubmitting] =
    useState(false);


  const [error, setError] =
    useState<DisplayError | null>(null);


  useEffect(() => {
    document.title =
      "Checkout - Study Shop";

    headingRef.current?.focus();
  }, []);


  if (!cart) {
    return (
      <Navigate
        to="/products"
        replace
      />
    );
  }


  const {
    product,
    quantity,
  } = cart;


  const total =
    product.price * quantity;


  function updateField(
    event: ChangeEvent<HTMLInputElement>
  ) {
    setForm({
      ...form,

      [event.target.name]:
        event.target.value,
    });
  }


  async function submitOrder(
    event: FormEvent
  ) {
    event.preventDefault();

    setError(null);
    setSubmitting(true);


    const payload: CheckoutPayload = {
      product_id:
        product.id,

      quantity:
        quantity,


      customer: {
        full_name:
          form.fullName,

        email:
          form.email,
      },


      delivery_address: {
        address_line:
          form.address,

        city:
          form.city,

        postcode:
          form.postcode,
      },


      payment: {
        cardholder_name:
          form.cardholderName,

        card_number:
          form.cardNumber,

        expiry_date:
          form.expiryDate,

        security_code:
          form.securityCode,
      },
    };


    try {

      const response =
        await createOrder(payload);


      navigate(
        "/confirmation",
        {
          state: {
            order:
              response.data,
          },
        }
      );

    } catch (err) {

      if (err instanceof ApiError) {

        setError({
          message:
            err.message,

          status:
            err.status,

          body:
            err.body,
        });

      } else {

        setError({
          message:
            "Something went wrong placing the order.",
        });

      }

    } finally {
      setSubmitting(false);
    }
  }


  const inputStyle =
    "w-full border-2 border-black p-2 bg-white";


  return (
    <div>

      <Link
        to={`/products/${product.id}`}
        className="inline-block bg-white border-2 border-black p-2 mb-3 font-bold"
      >
        BACK TO PRODUCT
      </Link>


      <div className="grid lg:grid-cols-[2fr_1fr] gap-4">

        <form
          onSubmit={submitOrder}
          className="bg-orange-300 border-4 border-black p-4"
        >

          <h1
            ref={headingRef}
            tabIndex={-1}
            className="text-4xl font-bold"
          >
            CHECKOUT!!!
          </h1>


          <p className="mb-4">
            Fill this stuff in to buy it.
          </p>


          {error && (
            <div className="bg-red-500 text-white border-4 border-black p-3 my-3">

              <p className="font-bold text-xl">
                ERROR!!!
              </p>


              <p>
                {error.message}
              </p>


              {error.status !== undefined && (
                <p>
                  HTTP STATUS:{" "}
                  {error.status}
                </p>
              )}


              {error.body !== undefined && (
                <pre className="bg-white text-black p-2 mt-2 overflow-auto text-xs whitespace-pre-wrap">

                  {typeof error.body ===
                  "string"
                    ? error.body
                    : JSON.stringify(
                        error.body,
                        null,
                        2
                      )}

                </pre>
              )}

            </div>
          )}


          <h2 className="font-bold text-xl bg-fuchsia-400 p-1 my-3">
            CUSTOMER INFORMATION
          </h2>


          <div className="grid md:grid-cols-2 gap-3">

            <div>

              <label
                htmlFor="fullName"
                className="block font-bold"
              >
                Full name
              </label>

              <input
                id="fullName"
                name="fullName"
                required
                maxLength={100}
                value={form.fullName}
                onChange={updateField}
                className={inputStyle}
              />

            </div>


            <div>

              <label
                htmlFor="email"
                className="block font-bold"
              >
                Email
              </label>

              <input
                id="email"
                name="email"
                type="email"
                required
                value={form.email}
                onChange={updateField}
                className={inputStyle}
              />

            </div>

          </div>


          <h2 className="font-bold text-xl bg-fuchsia-400 p-1 my-3">
            DELIVERY ADDRESS
          </h2>


          <div>

            <label
              htmlFor="address"
              className="block font-bold"
            >
              Address line
            </label>

            <input
              id="address"
              name="address"
              required
              maxLength={200}
              value={form.address}
              onChange={updateField}
              className={inputStyle}
            />

          </div>


          <div className="grid md:grid-cols-2 gap-3 mt-3">

            <div>

              <label
                htmlFor="city"
                className="block font-bold"
              >
                Town or city
              </label>

              <input
                id="city"
                name="city"
                required
                maxLength={100}
                value={form.city}
                onChange={updateField}
                className={inputStyle}
              />

            </div>


            <div>

              <label
                htmlFor="postcode"
                className="block font-bold"
              >
                Postal code
              </label>

              <input
                id="postcode"
                name="postcode"
                required
                maxLength={20}
                value={form.postcode}
                onChange={updateField}
                className={inputStyle}
              />

            </div>

          </div>


          <h2 className="font-bold text-xl bg-fuchsia-400 p-1 my-3">
            PAYMENT
          </h2>


          <div>

            <label
              htmlFor="cardholderName"
              className="block font-bold"
            >
              Cardholder name
            </label>

            <input
              id="cardholderName"
              name="cardholderName"
              required
              maxLength={100}
              value={
                form.cardholderName
              }
              onChange={updateField}
              className={inputStyle}
            />

          </div>


          <div className="mt-3">

            <label
              htmlFor="cardNumber"
              className="block font-bold"
            >
              Card number
            </label>

            <input
              id="cardNumber"
              name="cardNumber"
              required
              minLength={12}
              maxLength={23}
              value={
                form.cardNumber
              }
              onChange={updateField}
              className={inputStyle}
            />

          </div>


          <div className="grid grid-cols-2 gap-3 mt-3">

            <div>

              <label
                htmlFor="expiryDate"
                className="block font-bold"
              >
                Expiry date
              </label>

              <input
                id="expiryDate"
                name="expiryDate"
                required
                placeholder="MM/YY"
                pattern="[0-9]{2}/[0-9]{2}"
                value={
                  form.expiryDate
                }
                onChange={updateField}
                className={inputStyle}
              />

            </div>


            <div>

              <label
                htmlFor="securityCode"
                className="block font-bold"
              >
                CVV
              </label>

              <input
                id="securityCode"
                name="securityCode"
                required
                pattern="[0-9]{3,4}"
                maxLength={4}
                value={
                  form.securityCode
                }
                onChange={updateField}
                className={inputStyle}
              />

            </div>

          </div>


          <button
            type="submit"
            disabled={submitting}
            className="bg-green-500 border-4 border-black p-3 mt-4 font-bold text-xl disabled:bg-gray-400"
          >

            {submitting
              ? "WAIT..."
              : `PAY ${total.toFixed(2)} ${product.currency}!!!`}

          </button>

        </form>


        <aside className="bg-cyan-300 border-4 border-black p-3 h-fit">

          <h2 className="text-2xl font-bold">
            CART
          </h2>


          <img
            src={product.image_url}
            alt={product.name}
            className="w-28 h-28 object-cover border-2 border-black my-2"
          />


          <p className="font-bold">
            {product.name}
          </p>


          <p>
            Quantity: {quantity}
          </p>


          <p>
            Each:{" "}
            {product.price.toFixed(2)}{" "}
            {product.currency}
          </p>


          <p className="font-bold text-xl mt-3 bg-yellow-300 p-2 border-2 border-black">

            TOTAL:{" "}
            {total.toFixed(2)}{" "}
            {product.currency}

          </p>

        </aside>

      </div>

    </div>
  );
}


export default CheckoutPage;