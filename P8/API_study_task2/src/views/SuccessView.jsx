function SuccessView({ order, goHome }) {

  return (
    <div className="mt-5">

      <h2 className="text-xl">
        Order successful
      </h2>

      <p
        role="status"
        aria-live="polite"
        className="mt-2"
      >
        {order.message}
      </p>


      <p className="mt-4">
        Order ID: {order.id}
      </p>

      <p>Status: {order.status}</p>


      <h3 className="mt-5 ">
        Order items
      </h3>

      <ul>
        {order.items.map((item, index) => (
          <li key={index} className="mt-4">
            <p>
              <b>{item.product_name}</b>
            </p>

            <p>
              Quantity: {item.quantity}
            </p>

            <p>
              Unit price: {item.unit_price} {item.currency}
            </p>

            <p>
              Line total: {item.line_total} {item.currency}
            </p>
          </li>
        ))}
      </ul>


      <hr className="my-5"/>

      <p>
        Total items: {order.item_count}
      </p>

      <p>
        <b>
          Total: {order.total} {order.currency}
        </b>
      </p>


      <button
        onClick={goHome}
        className="mt-5 px-2"
      >
        Back to Peters Shop
      </button>
    </div>
  );
}

export default SuccessView;