import { getProducts } from './api.js';

$(async function () {
  const $products = $('#products');
  let loading = true;

  try {
    const response = await getProducts();
    $products.empty();

    response.data.forEach(function (product) {
      const $card = $('<div class="card"></div>');
      $('<img>').attr('src', product.image_url).attr('alt', product.name).appendTo($card);
      $('<h2></h2>').text(product.name).appendTo($card);
      $('<p class="price"></p>').text(product.price + ' ' + product.currency).appendTo($card);

      const $features = $('<ul></ul>');
      product.features.forEach(f => $('<li></li>').text(f).appendTo($features));
      $card.append($features);
      $('<a class="button">View product</a>')
        .attr('href', 'product.html?id=' + product.id).appendTo($card);

      $products.append($card);
    });
    loading = false;
  } catch (err) {
    $products.append($('<div class="error"></div>').text(err.message));
  }
});
