import { getOrder } from './api.js';

const orderId = new URLSearchParams(location.search).get('order');

function apiMessage(err) {
  if (Array.isArray(err.body?.detail)) return err.body.detail.map(x => x.msg).join(', ');
  return err.body?.detail || err.message;
}

$(async function () {
  if (!orderId) {
    $('#confirmation').html('<h1>Order not found</h1><p role="status">No order id was provided.</p>');
    return;
  }

  const postedMessage = sessionStorage.getItem('orderMessage');
  if (postedMessage) {
    $('#confirmation').html(`<p role="status" aria-live="polite">${postedMessage}</p><p>Loading order details...</p>`);
    sessionStorage.removeItem('orderMessage');
  }

  try {
    const response = await getOrder(orderId);
    const order = response.data;
    const items = order.items.map(item => `
      <li>
        <strong>${item.product_name}</strong><br>
        Quantity: ${item.quantity}<br>
        Unit price: ${item.unit_price} ${item.currency}<br>
        Line total: ${item.line_total} ${item.currency}
      </li>`).join('');

    $('#confirmation').html(`
      <h1>Order confirmed</h1>
      <p class="success" role="status" aria-live="polite">${order.message}</p>
      <p>Order ID: ${order.id}</p>
      <p>Status: ${order.status}</p>
      <section aria-labelledby="itemsHeading">
        <h2 id="itemsHeading">Ordered items</h2>
        <ul class="order-list">${items}</ul>
      </section>
      <p>Total items: ${order.item_count}</p>
      <p class="cost">Order total: ${order.total} ${order.currency}</p>
    `);
  } catch (err) {
    $('#confirmation').addClass('error').html(`<h1>Could not load order</h1><p role="status" aria-live="polite">${apiMessage(err)}</p>`);
  }
});
