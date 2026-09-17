import { getProducts } from './api.js';

$(async function () {
  try {
    const response = await getProducts();
    let html = '';

    response.data.forEach(product => {
      const featureList = product.features.map(x => `<li>${x}</li>`).join('');

      html += `
        <article class="product-card">
          <img src="${product.image_url}" alt="${product.name}">
          <h2>${product.name}</h2>
          <p class="cost">${product.price} ${product.currency}</p>
          <ul>${featureList}</ul>
          <a class="btn" href="product.html?id=${product.id}">View product</a>
        </article>`;
    });

    $('#products').html(html);
    $('#productsStatus').text(response.data.length ? '' : 'No products available.');
  } catch (err) {
    $('#productsStatus').addClass('error').text(err.body?.detail || err.message);
  }
});
