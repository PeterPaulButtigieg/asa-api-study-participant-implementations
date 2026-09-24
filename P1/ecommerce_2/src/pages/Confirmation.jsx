import { Link, useLocation } from "react-router-dom";

function Confirmation() {
  const location = useLocation();
  const order = location.state?.order;

  if (!order) {
    return (
      <div className="page">
        <h1>Order confirmation</h1>

        <p>No order information is available.</p>

        <Link className="button" to="/">
          Back to products
        </Link>
      </div>
    );
  }

  return (
    <div className="page confirmation">
      <h1>Order confirmed</h1>

      <p
        className="confirmation-message"
        role="status"
        aria-live="polite"
      >
        {order.message}
      </p>

      <div className="order-details">
        <div>
          <strong>Order ID:</strong> {order.id}
        </div>

        <div>
          <strong>Status:</strong> {order.status}
        </div>

        <div>
          <strong>Items:</strong> {order.item_count}
        </div>

        <div>
          <strong>Total:</strong>{" "}
          {order.currency} {order.total}
        </div>
      </div>

      <h2>Order items</h2>

      <ul className="order-items">
        {order.items.map((item) => (
          <li
            className="confirmation-item"
            key={item.product_id}
          >
            <div>
              <strong>{item.product_name}</strong>
            </div>

            <div>
              Quantity: {item.quantity}
            </div>

            <div>
              {item.currency} {item.line_total}
            </div>
          </li>
        ))}
      </ul>

      <Link className="button" to="/">
        Continue shopping
      </Link>
    </div>
  );
}

export default Confirmation;