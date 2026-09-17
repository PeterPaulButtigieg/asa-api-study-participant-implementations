import { getProduct, createOrder } from './api.js';

const params = new URLSearchParams(location.search);
const productId = params.get('id');
let quantity = parseInt(params.get('qty') || '1', 10);
let product = null;

$(async function () {
  if (!productId) {
    $('#cart').text('Cart is empty.');
    $('#checkoutForm').hide();
    return;
  }

  try {
    const result = await getProduct(productId);
    product = result.data;
    const max = Math.min(5, product.available_quantity);

    if (max === 0) {
      $('#cart').text('This item is out of stock.');
      $('#checkoutForm').hide();
      return;
    }
    if (quantity < 1 || quantity > max) quantity = 1;
    $('#cart').empty()
      .append($('<h2>Cart summary</h2>'))
      .append($('<p></p>').text(product.name))
      .append($('<p></p>').text('Quantity: ' + quantity))
      .append($('<p class="price"></p>').text('Total: ' + (product.price * quantity).toFixed(2) + ' ' + product.currency));
  } catch (err) {
    $('#cart').text('Could not load cart.');
    $('#error').addClass('error').text(err.message);
    $('#checkoutForm').hide();
  }
});

$('#checkoutForm').on('submit', async function (event) {
  event.preventDefault();
  if (!product) return;

  $('#error').removeClass('error').empty();
  $('#placeOrder').prop('disabled', true).text('Submitting...');

  const order = {
    product_id: product.id,
    quantity: quantity,
    customer: {
      full_name: $('#fullName').val().trim(),
      email: $('#email').val().trim()
    },
    delivery_address: {
      address_line: $('#address').val().trim(),
      city: $('#city').val().trim(),
      postcode: $('#postcode').val().trim()
    },
    payment: {
      cardholder_name: $('#cardName').val().trim(),
      card_number: $('#cardNumber').val().trim(),
      expiry_date: $('#expiry').val().trim(),
      security_code: $('#cvv').val().trim()
    }
  };

  try {
    const response = await createOrder(order);
    window.location.href = 'confirmation.html?order=' + encodeURIComponent(response.data.id);
  } catch (err) {
    $('#error').addClass('error').text('Order failed: ' + err.message);
    $('#placeOrder').prop('disabled', false).text('Place order');
  }
});
