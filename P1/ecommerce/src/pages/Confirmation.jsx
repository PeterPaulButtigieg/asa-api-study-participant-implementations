import { Link, useLocation } from "react-router-dom";

function Confirmation() {
  const location = useLocation();

  const order = location.state?.order;

  if (!order) {
    return (
      <div className="page">
        <h1>Order confirmation</h1>

        <div>
          No order information available.
        </div>

        <Link className="button" to="/">
          Back to products
        </Link>
      </div>
    );
  }

  return (
    <div className="page confirmation">
      <h1>Order confirmed</h1>

      <div className="confirmation-message">
        {order.message}
      </div>

      <div className="order-details">
        <div>
          Order ID: {order.id}
        </div>

        <div>
          Status: {order.status}
        </div>

        <div>
          Items: {order.item_count}
        </div>

        <div>
          Total: {order.currency} {order.total}
        </div>
      </div>

      <h2>Order items</h2>

      <div className="confirmation-items">
        {order.items.map((item) => (
          <div
            className="confirmation-item"
            key={item.product_id}
          >
            <div>{item.product_name}</div>

            <div>
              Quantity: {item.quantity}
            </div>

            <div>
              {item.currency} {item.line_total}
            </div>
          </div>
        ))}
      </div>

      <Link className="button" to="/">
        Continue shopping
      </Link>
    </div>
  );
}

export default Confirmation;