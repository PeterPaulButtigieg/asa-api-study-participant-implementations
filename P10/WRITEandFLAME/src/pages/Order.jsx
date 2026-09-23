import { useEffect, useState } from "react";
import { getOrder } from "../api";


export default function Order({ orderId }) {
  const [order, setOrder] = useState(null);
  const [error, setError] = useState("");


  useEffect(() => {
    getOrder(orderId)
      .then((res) => {
        setOrder(res.data);
      })
      .catch((err) => {
        setError(err.message);
      });
  }, [orderId]);


  if (error) {
    return (
      <main className="max-w-3xl mx-auto px-5 py-10">
        <div
          role="alert"
          aria-live="assertive"
          className="border bg-red-50 border-red-200 rounded-lg p-4 text-red-700"
        >
          {error}
        </div>
      </main>
    );
  }

  if (!order) {
    return (
      <main className="mx-auto max-w-3xl py-10 px-5">
        <p role="status" aria-live="polite" className="text-slate-500">
          Loading order...
        </p>
      </main>
    );
  }


  return (
    <main className="max-w-3xl px-5 mx-auto py-10">
      <div className="border-slate-200 border rounded-xl bg-white shadow-sm p-7">
        <div
          className="mb-7"
          role="status"
          aria-live="polite"
        >
          <div className="text-sm font-medium rounded-full bg-green-100 inline-block text-green-800 mb-3 py-1 px-3">
            Order successful
          </div>

          <h1 className="font-bold text-3xl">
            Thanks for your order
          </h1>

          <p className="mt-2 text-slate-600">
            {order.message}
          </p>
        </div>


        <section
          className="rounded-lg bg-slate-50 mb-6 py-3 px-4 text-sm"
          aria-label="Order information"
        >
          <div className="flex mb-1 justify-between">
            <span className="text-slate-500">Order ID</span>
            <span className="font-medium">{order.id}</span>
          </div>

          <div className="justify-between flex">
            <span className="text-slate-500">Status</span>
            <span className="font-medium">{order.status}</span>
          </div>
        </section>


        <section aria-labelledby="order-details-title">
          <h2
            id="order-details-title"
            className="text-lg mb-3 font-semibold"
          >
            Order details
          </h2>

          <ul>
            {order.items.map((item) => (
              <li
                key={`${item.product_id}-${item.product_name}`}
                className="border-b py-4 border-slate-200"
              >
                <div className="flex gap-4 justify-between">
                  <div>
                    <h3 className="font-medium">
                      {item.product_name}
                    </h3>

                    <p className="text-slate-500 mt-1 text-sm">
                      {item.quantity} × {item.unit_price}{" "}
                      {item.currency}
                    </p>
                  </div>

                  <p className="font-semibold">
                    {item.line_total} {item.currency}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </section>


        <div className="space-y-2 mt-6">
          <div className="text-slate-600 justify-between flex">
            <span>Total items</span>
            <span>{order.item_count}</span>
          </div>

          <div className="font-bold border-t flex justify-between text-xl pt-4 mt-4">
            <span>Total</span>

            <span>
              {order.total} {order.currency}
            </span>
          </div>
        </div>
      </div>
    </main>
  );
}