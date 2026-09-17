import { getProduct } from './api.js';

const productId = new URLSearchParams(location.search).get('id');

function getErrorText(err) {
  const detail = err.body?.detail;
  if (Array.isArray(detail)) return detail.map(x => x.msg).join(', ');
  return detail || err.message;
}

$(async function () {
  if (!productId) {
    $('#product').empty();
    $('#productStatus').addClass('error').text('No product was selected.');
    return;
  }

  try {
    const result = await getProduct(productId);
    const product = result.data;
    const maxQuantity = Math.min(product.available_quantity, 5);
    const features = product.features.map(f => `<li>${f}</li>`).join('');

    let options = '';
    for(let qty = 1; qty <= maxQuantity; qty++) {
      options += `<option value="${qty}">${qty}</option>`;
    }

    $('#product').html(`
      <div class="photo"><img src="${product.image_url}" alt="${product.name}"></div>
      <section class="panel">
        <h1>${product.name}</h1>
        <p>${product.description}</p>
        <p class="cost">${product.price} ${product.currency}</p>
        <p>${product.available_quantity} available</p>
        <h2>Features</h2>
        <ul>${features}</ul>
        <label for="quantity">Quantity</label>
        <select id="quantity">${options}</select>
        ${maxQuantity === 0
          ? '<button type="button" disabled>Out of stock</button>'
          : '<button type="button" id="buyNow">Buy now</button>'}
      </section>
    `);

    $('#buyNow').on('click', function () {
      location.href = `checkout.html?id=${product.id}&qty=${$('#quantity').val()}`;
    });
  } catch (err) {
    $('#product').empty();
    $('#productStatus').addClass('error').text(getErrorText(err));
  }
});
