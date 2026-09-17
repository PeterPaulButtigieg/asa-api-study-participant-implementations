import { getProduct, createOrder } from './api.js';

const query = new URLSearchParams(location.search);
const productId = query.get('id');
let qty = Number(query.get('qty') || 1);
let currentProduct;

const fieldIds = {
  full_name: 'fullName', email: 'email', address_line: 'address', city: 'city', postcode: 'postcode',
  cardholder_name: 'cardName', card_number: 'cardNumber', expiry_date: 'expiry', security_code: 'cvv'
};

function clearApiErrors() {
  $('.field-error').remove();
  $('#checkoutForm input').removeAttr('aria-invalid').each(function () {
    const describedBy = ($(this).attr('aria-describedby') || '').split(' ').filter(x => !x.endsWith('-error'));
    describedBy.length ? $(this).attr('aria-describedby', describedBy.join(' ')) : $(this).removeAttr('aria-describedby');
  });
  $('#checkoutStatus').removeClass('error').empty();
}

function showApiError(err) {
  clearApiErrors();
  const detail = err.body?.detail;
  const messages = [];

  if (Array.isArray(detail)) {
    detail.forEach((problem, i) => {
      const message = problem.msg || 'Invalid value';
      messages.push(message);
      const key = problem.loc?.[problem.loc.length - 1];
      const inputId = fieldIds[key];

      if (inputId) {
        const errorId = `${inputId}-error`;
        $(`#${inputId}`).attr({ 'aria-invalid': 'true', 'aria-describedby': errorId });
        $(`<div class="field-error" id="${errorId}">${message}</div>`).insertAfter(`#${inputId}`);
      }
    });
  } else {
    messages.push(detail || err.message);
  }

  const suggestionNudges = (err.body?.accessibility?.nudges || []).filter(n =>
    n.type === 'error-suggestion' || n.success_criterion === '3.3.3'
  );
  const suggestions = suggestionNudges.flatMap(n => n.values || []).filter(Boolean);

  let html = `<strong>There was a problem.</strong><div>${messages.join('<br>')}</div>`;
  if (suggestions.length) {
    html += `<p>Try this:</p><ul>${suggestions.map(s => `<li>${s}</li>`).join('')}</ul>`;
  }
  $('#checkoutStatus').addClass('error').html(html);
}

$(async function () {
  if (!productId) {
    $('#cart').html('<h2 id="cartHeading">Order summary</h2><p>Your cart is empty.</p>');
    $('#checkoutForm').hide();
    return;
  }

  try {
    const response = await getProduct(productId);
    currentProduct = response.data;
    const max = Math.min(5, currentProduct.available_quantity);

    if (max < 1) {
      $('#cart').html('<h2 id="cartHeading">Order summary</h2><p>This product is out of stock.</p>');
      $('#checkoutForm').hide();
      return;
    }
    if (qty < 1 || qty > max) qty = 1;

    $('#cart').html(`
      <h2 id="cartHeading">Order summary</h2>
      <p><strong>${currentProduct.name}</strong></p>
      <p>Quantity: ${qty}</p>
      <p class="cost">Total: ${(currentProduct.price * qty).toFixed(2)} ${currentProduct.currency}</p>
    `);
  } catch (err) {
    $('#checkoutForm').hide();
    showApiError(err);
  }
});

$('#checkoutForm').on('submit', async function (event) {
  event.preventDefault();
  if (!currentProduct) return;

  clearApiErrors();
  $('#placeOrder').prop('disabled', true).text('Submitting...');

  const order = {
    product_id: currentProduct.id,
    quantity: qty,
    customer: { full_name: $('#fullName').val().trim(), email: $('#email').val().trim() },
    delivery_address: {
      address_line: $('#address').val().trim(), city: $('#city').val().trim(), postcode: $('#postcode').val().trim()
    },
    payment: {
      cardholder_name: $('#cardName').val().trim(), card_number: $('#cardNumber').val().trim(),
      expiry_date: $('#expiry').val().trim(), security_code: $('#cvv').val().trim()
    }
  };

  try {
    const response = await createOrder(order);
    $('#checkoutStatus').removeClass('error').text(response.data.message);
    sessionStorage.setItem('orderMessage', response.data.message);
    setTimeout(() => {
      location.href = 'confirmation.html?order=' + encodeURIComponent(response.data.id);
    }, 250);
  } catch (err) {
    showApiError(err);
    $('#placeOrder').prop('disabled', false).text('Place order');
  }
});
