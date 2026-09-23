import { useEffect, useState } from "react";
import { getOrder } from "../api";

export default function Order({ orderId }) {
  const [order, setOrder] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    getOrder(orderId)
      .then((response) => {
        setOrder(response.data);
      })
      .catch((err) => setError(err.message));
  }, [orderId]);

  if (error) {
    return (
      <main className="max-w-3xl mx-auto px-5 py-10">
        <div className="p-4 rounded-lg bg-red-50 border border-red-200 text-red-700">
          {error}
        </div>
      </main>
    );
  }

  if (!order) {
    return (
      <main className="max-w-3xl mx-auto px-5 py-10">
        <p className="text-slate-500">Loading order...</p>
      </main>
    );
  }

  return (
    <main className="max-w-3xl mx-auto px-5 py-10">
      <div className="bg-white border border-slate-200 rounded-xl p-7 shadow-sm">
        <div className="mb-7">
          <div className="inline-block bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium mb-3">
            Order successful
          </div>

          <h1 className="text-3xl font-bold">
            Thanks for your order
          </h1>

          <p className="text-slate-600 mt-2">
            {order.message}
          </p>
        </div>

        <div className="bg-slate-50 rounded-lg px-4 py-3 mb-6 text-sm">
          <div className="flex justify-between mb-1">
            <span className="text-slate-500">Order ID</span>
            <span className="font-medium">{order.id}</span>
          </div>

          <div className="flex justify-between">
            <span className="text-slate-500">Status</span>
            <span className="font-medium">{order.status}</span>
          </div>
        </div>

        <h2 className="font-semibold text-lg mb-3">
          Order details
        </h2>

        <div>
          {order.items.map((item) => (
            <div
              key={`${item.product_id}-${item.product_name}`}
              className="py-4 border-b border-slate-200"
            >
              <div className="flex justify-between gap-4">
                <div>
                  <p className="font-medium">
                    {item.product_name}
                  </p>

                  <p className="text-sm text-slate-500 mt-1">
                    {item.quantity} × {item.unit_price}{" "}
                    {item.currency}
                  </p>
                </div>

                <p className="font-semibold">
                  {item.line_total} {item.currency}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 space-y-2">
          <div className="flex justify-between text-slate-600">
            <span>Total items</span>
            <span>{order.item_count}</span>
          </div>

          <div className="flex justify-between border-t pt-4 mt-4 text-xl font-bold">
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