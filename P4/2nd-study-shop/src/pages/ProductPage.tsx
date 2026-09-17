import {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  Link,
  useParams,
} from "react-router";

import {
  ApiError,
  getProduct,
} from "../api";

import type {
  Cart,
  Product,
} from "../types";


export default function ProductPage() {
  const params = useParams();

  const id = Number(params.id);


  const [item, setItem] =
    useState<Product | null>(null);

  const [qty, setQty] =
    useState(1);

  const [busy, setBusy] =
    useState(true);

  const [errorText, setErrorText] =
    useState("");


  const pageHeading =
    useRef<HTMLHeadingElement>(null);


  useEffect(() => {
    setBusy(true);
    setErrorText("");


    if (
      !Number.isInteger(id) ||
      id < 1
    ) {
      setErrorText(
        "That product number is invalid."
      );

      setBusy(false);
      return;
    }


    getProduct(id)
      .then((response) => {
        setItem(response.data);
      })

      .catch((error) => {

        if (error instanceof ApiError) {

          if (error.status === 404) {
            setErrorText(
              "That product could not be found."
            );
          } else {
            setErrorText(
              `Could not load this product. Error ${error.status}.`
            );
          }

        } else {
          setErrorText(
            "Could not load this product."
          );
        }

      })

      .finally(() => {
        setBusy(false);
      });

  }, [id]);


  useEffect(() => {
    if (!item) {
      return;
    }

    document.title =
      `${item.name} | Study Shop`;

    pageHeading.current?.focus();

  }, [item]);


  if (busy) {
    return (
      <div
        role="status"
        aria-live="polite"
        className="bg-white border-4 border-black p-4"
      >
        Loading product...
      </div>
    );
  }


  if (errorText || !item) {
    return (
      <div>

        <h1
          ref={pageHeading}
          tabIndex={-1}
          className="text-3xl font-bold mb-3"
        >
          Product unavailable
        </h1>

        <div
          role="alert"
          aria-live="assertive"
          className="bg-red-600 text-white border-4 border-black p-3"
        >
          {errorText || "Product unavailable."}
        </div>


        <Link
          to="/products"
          className="inline-block bg-white border-2 border-black mt-3 p-2 font-bold"
        >
          Back to products
        </Link>

      </div>
    );
  }


  const maxQty =
    Math.min(
      item.available_quantity,
      5
    );


  const cart: Cart = {
    product: item,
    quantity: qty,
  };


  return (
    <div>

      <Link
        to="/products"
        className="inline-block bg-white border-2 border-black p-2 mb-3 font-bold"
      >
        Back to products
      </Link>


      <article className="border-4 border-black bg-lime-300 p-3 md:grid md:grid-cols-2 md:gap-5">

        <div>
          <img
            src={item.image_url}
            alt={item.name}
            className="w-full border-4 border-red-600"
          />
        </div>


        <div>

          <h1
            ref={pageHeading}
            tabIndex={-1}
            className="text-4xl font-bold"
          >
            {item.name}
          </h1>


          <p className="text-3xl text-red-700 font-bold my-2">
            {item.price.toFixed(2)}{" "}
            {item.currency}
          </p>


          <p className="mb-4">
            {item.description}
          </p>


          <section aria-labelledby="feature-heading">

            <h2
              id="feature-heading"
              className="text-xl font-bold"
            >
              Features
            </h2>

            <ul className="list-disc ml-6 mb-4">
              {item.features.map(
                (feature, i) => (
                  <li key={i}>
                    {feature}
                  </li>
                )
              )}
            </ul>

          </section>


          <p
            id="stock-info"
            className="font-bold mb-4"
          >
            Available:{" "}
            {item.available_quantity}
          </p>


          {maxQty > 0 && (
            <div className="mb-4">

              <label
                htmlFor="quantity"
                className="font-bold block mb-1"
              >
                Quantity
              </label>

              <select
                id="quantity"
                value={qty}
                aria-describedby="stock-info"
                onChange={(event) =>
                  setQty(
                    Number(event.target.value)
                  )
                }
                className="border-2 border-black p-2 bg-white"
              >

                {Array.from(
                  { length: maxQty },
                  (_, index) =>
                    index + 1
                ).map((value) => (
                  <option
                    value={value}
                    key={value}
                  >
                    {value}
                  </option>
                ))}

              </select>

            </div>
          )}


          {maxQty > 0 ? (

            <Link
              to="/checkout"
              state={{ cart }}
              className="inline-block border-4 border-black bg-fuchsia-500 p-3 text-xl font-bold"
            >
              Buy now
            </Link>

          ) : (

            <button
              disabled
              className="border-4 border-black bg-gray-400 p-3 font-bold"
            >
              Out of stock
            </button>

          )}

        </div>

      </article>

    </div>
  );
}