import { getOrder } from './api.js';

const orderId = new URLSearchParams(window.location.search).get('order');

$(async function () {
  if (!orderId) {
    $('#confirmation').html('<h1>No order found</h1><p>There is no order id in the URL.</p>');
    return;
  }

  try {
    const response = await getOrder(orderId);
    const order = response.data;
    const $root = $('#confirmation').empty();

    $('<h1 class="success">Order successful</h1>').appendTo($root);
    $('<p></p>').text(order.message).appendTo($root);
    $('<p></p>').text('Order ID: ' + order.id).appendTo($root);
    $('<p></p>').text('Status: ' + order.status).appendTo($root);

    order.items.forEach(item => {
      const $item = $('<div class="order-item"></div>');
      $('<strong></strong>').text(item.product_name).appendTo($item);
      $('<div></div>').text('Quantity: ' + item.quantity).appendTo($item);
      $('<div></div>').text('Unit price: ' + item.unit_price + ' ' + item.currency).appendTo($item);
      $('<div></div>').text('Line total: ' + item.line_total + ' ' + item.currency).appendTo($item);
      $root.append($item);
    });

    $('<p></p>').text('Total items: ' + order.item_count).appendTo($root);
    $('<p class="price"></p>').text('Order total: ' + order.total + ' ' + order.currency).appendTo($root);
  } catch(err) {
    $('#confirmation').addClass('error').text('Could not load order: ' + err.message);
  }
});
