import { getProduct } from './api.js';

const params = new URLSearchParams(window.location.search);
const productId = params.get('id');

$(async function () {
  if (!productId) {
    $('#product').text('No product selected.');
    return;
  }

  try {
    const response = await getProduct(productId);
    const p = response.data;
    const maxQty = Math.min(5, p.available_quantity);
    const $left = $('<div></div>');
    $('<img>').attr({ src:p.image_url, alt:p.name }).appendTo($left);

    const $right = $('<div class="box"></div>');
    $('<h1></h1>').text(p.name).appendTo($right);
    $('<p></p>').text(p.description).appendTo($right);
    $('<p class="price"></p>').text(p.price + ' ' + p.currency).appendTo($right);
    $('<p></p>').text('Available: ' + p.available_quantity).appendTo($right);

    const $features = $('<ul></ul>');
    p.features.forEach(function(feature){ $('<li></li>').text(feature).appendTo($features); });
    $right.append($features);

    const $qty = $('<select id="quantity"></select>');
    for (let i=1; i<=maxQty; i++) $qty.append('<option value="'+i+'">'+i+'</option>');
    $right.append('<label for="quantity">Quantity</label>').append($qty);

    const $buy = $('<button id="buyNow">Buy Now</button>');
    if (maxQty === 0) {
      $buy.prop('disabled', true).text('Out of stock');
    }
    $right.append('<br><br>').append($buy);
    $('#product').empty().append($left, $right);

    $buy.on('click', function () {
      window.location.href = 'checkout.html?id=' + p.id + '&qty=' + $qty.val();
    });
  } catch (err) {
    $('#product').text('Could not load product.');
    $('#error').addClass('error').text(err.message);
  }
});
