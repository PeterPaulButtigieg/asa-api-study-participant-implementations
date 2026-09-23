function SuccessView({ order, onHome }) {
  return (
    <div className="mt-5">
      <h2 className="text-xl font-bold">Order successful</h2>

      <p>{order.message}</p>

      <br />

      <p>Order id: {order.id}</p>
      <p>Status: {order.status}</p>

      <h3 className="font-bold mt-5">Items</h3>

      {order.items.map((item, i) => (
        <div key={i} className="mt-3">
          <p>{item.product_name}</p>
          <p>Quantity: {item.quantity}</p>
          <p>
            Price: {item.unit_price} {item.currency}
          </p>
          <p>
            Total: {item.line_total} {item.currency}
          </p>
        </div>
      ))}

      <hr className="my-4" />

      <p>Number of items: {order.item_count}</p>

      <p>
        <b>Total:</b> {order.total} {order.currency}
      </p>

      <br />

      <button className="border px-1" onClick={onHome}>
        Return to Peters Shop
      </button>
    </div>
  );
}

export default SuccessView;