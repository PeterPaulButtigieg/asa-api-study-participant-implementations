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


function ConfirmationPage() {
  const location = useLocation();


  const headingRef =
    useRef<HTMLHeadingElement>(null);


  const order = (
    location.state as {
      order?: OrderData;
    } | null
  )?.order;


  useEffect(() => {
    document.title =
      "Order confirmed - Study Shop";

    headingRef.current?.focus();
  }, []);


  if (!order) {
    return (
      <Navigate
        to="/products"
        replace
      />
    );
  }


  return (
    <div className="bg-lime-300 border-8 border-green-600 p-4">

      <h1
        ref={headingRef}
        tabIndex={-1}
        className="text-5xl font-bold mb-2"
      >
        SUCCESS!!!
      </h1>


      <p className="font-bold mb-4">
        {order.message}
      </p>


      <div className="bg-white border-4 border-black p-3">

        <p>
          <b>ORDER:</b>{" "}
          {order.id}
        </p>


        <p>
          <b>STATUS:</b>{" "}
          {order.status}
        </p>


        <p>
          <b>ITEMS:</b>{" "}
          {order.item_count}
        </p>


        <h2 className="text-2xl font-bold mt-4">
          YOUR STUFF
        </h2>


        {order.items.map(
          (item, index) => (
            <div
              key={
                `${item.product_id}-${index}`
              }
              className="bg-cyan-200 border-2 border-black p-2 my-2"
            >

              <p className="font-bold text-lg">
                {item.product_name}
              </p>


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

            </div>
          )
        )}


        <p className="text-2xl font-bold bg-yellow-300 border-2 border-black p-2 mt-3">

          GRAND TOTAL:{" "}
          {order.total.toFixed(2)}{" "}
          {order.currency}

        </p>


        <Link
          to="/products"
          className="inline-block bg-fuchsia-500 border-4 border-black p-3 font-bold mt-4 text-black"
        >
          BUY MORE STUFF
        </Link>

      </div>

    </div>
  );
}


export default ConfirmationPage;