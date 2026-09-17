import {
  useEffect,
  useRef,
} from "react";

import {
  Link,
  Navigate,
  useLocation,
} from "react-router";

import type {
  OrderData,
} from "../types";


export default function ConfirmationPage() {
  const location =
    useLocation();


  const heading =
    useRef<HTMLHeadingElement>(null);


  const order = (
    location.state as {
      order?: OrderData;
    } | null
  )?.order;


  useEffect(() => {
    document.title =
      "Order confirmed | Study Shop";

    heading.current?.focus();
  }, []);


  if (!order) {
    return (
      <Navigate
        replace
        to="/products"
      />
    );
  }


  return (
    <div className="border-8 border-green-700 bg-lime-300 p-4">

      <h1
        ref={heading}
        tabIndex={-1}
        className="text-5xl font-bold"
      >
        Order successful
      </h1>


      <div
        role="status"
        aria-live="polite"
        className="bg-green-100 border-2 border-green-800 p-2 my-3 font-bold"
      >
        {order.message}
      </div>


      <section
        aria-labelledby="order-details-heading"
        className="bg-white border-4 border-black p-3"
      >

        <h2
          id="order-details-heading"
          className="text-2xl font-bold"
        >
          Order details
        </h2>


        <dl className="my-3">

          <div>
            <dt className="font-bold inline">
              Order:
            </dt>

            <dd className="inline ml-2">
              {order.id}
            </dd>
          </div>


          <div>
            <dt className="font-bold inline">
              Status:
            </dt>

            <dd className="inline ml-2">
              {order.status}
            </dd>
          </div>


          <div>
            <dt className="font-bold inline">
              Total items:
            </dt>

            <dd className="inline ml-2">
              {order.item_count}
            </dd>
          </div>

        </dl>


        <h3 className="text-xl font-bold mt-4">
          Items
        </h3>


        <ul className="list-none p-0">

          {order.items.map(
            (item, index) => (
              <li
                key={
                  `${item.product_id}-${index}`
                }
                className="border-2 border-black bg-cyan-200 p-2 my-2"
              >

                <h4 className="font-bold text-lg">
                  {item.product_name}
                </h4>

                <p>
                  Quantity:{" "}
                  {item.quantity}
                </p>

                <p>
                  Unit price:{" "}
                  {item.unit_price.toFixed(2)}{" "}
                  {item.currency}
                </p>

                <p>
                  Line total:{" "}
                  {item.line_total.toFixed(2)}{" "}
                  {item.currency}
                </p>

              </li>
            )
          )}

        </ul>


        <p className="border-2 border-black bg-yellow-300 p-2 mt-3 text-2xl font-bold">
          Order total:{" "}
          {order.total.toFixed(2)}{" "}
          {order.currency}
        </p>


        <Link
          to="/products"
          className="inline-block border-4 border-black bg-fuchsia-500 p-3 mt-4 font-bold"
        >
          Browse products
        </Link>

      </section>

    </div>
  );
}