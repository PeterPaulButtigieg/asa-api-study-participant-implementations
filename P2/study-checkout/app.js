import { createOrder, getOrder, getProduct, getProducts } from "./api.js";

const page = document.body.dataset.page;

function getQueryParam(name) {
  return new URLSearchParams(window.location.search).get(name);
}

function formatMoney(value, currency) {
  try {
    return new Intl.NumberFormat(undefined, {
      style: "currency",
      currency,
    }).format(value);
  } catch {
    return `${value} ${currency}`;
  }
}

function setMessage(text, isError = false) {
  const message = document.getElementById("message");
  if (!message) return;

  message.textContent = text;
  message.classList.toggle("error", isError);
}

function featureList(features = []) {
  if (!features.length) return "";
  return `<ul class="features">${features.map((feature) => `<li>${escapeHtml(feature)}</li>`).join("")}</ul>`;
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

async function loadProductsPage() {
  const list = document.getElementById("product-list");
  setMessage("Loading products...");

  try {
    const response = await getProducts();
    const products = response.data || [];

    list.innerHTML = products.map((product) => `
      <li>
        <h2>${escapeHtml(product.name)}</h2>
        <img src="${escapeHtml(product.image_url)}" alt="${escapeHtml(product.name)}">
        <p>${formatMoney(product.price, product.currency)}</p>
        ${featureList(product.features)}
        <a class="button-link" href="product.html?id=${encodeURIComponent(product.id)}">View product</a>
      </li>
    `).join("");

    setMessage(products.length ? "" : "No products are available.");
  } catch (error) {
    setMessage(error.message, true);
  }
}

async function loadProductPage() {
  const productId = getQueryParam("id");
  const container = document.getElementById("product-detail");

  if (!productId) {
    setMessage("No product was selected.", true);
    return;
  }

  setMessage("Loading product...");

  try {
    const response = await getProduct(productId);
    const product = response.data;
    const maxQuantity = Math.min(5, product.available_quantity);
    const unavailable = maxQuantity < 1;

    container.innerHTML = `
      <h1>${escapeHtml(product.name)}</h1>
      <img src="${escapeHtml(product.image_url)}" alt="${escapeHtml(product.name)}">
      <p>${escapeHtml(product.description)}</p>
      <p><strong>Price:</strong> ${formatMoney(product.price, product.currency)}</p>
      <h2>Features</h2>
      ${featureList(product.features)}
      <p><strong>Available quantity:</strong> ${product.available_quantity}</p>

      <form id="buy-form">
        <label for="quantity">Quantity</label>
        <input id="quantity" name="quantity" type="number" min="1" max="${maxQuantity}" value="1" required ${unavailable ? "disabled" : ""}>
        <button type="submit" ${unavailable ? "disabled" : ""}>Buy now</button>
      </form>
    `;

    if (unavailable) {
      setMessage("This product is currently unavailable.");
      return;
    }

    document.getElementById("buy-form").addEventListener("submit", (event) => {
      event.preventDefault();
      const quantity = Number(document.getElementById("quantity").value);
      window.location.href = `checkout.html?id=${encodeURIComponent(product.id)}&quantity=${encodeURIComponent(quantity)}`;
    });

    setMessage("");
  } catch (error) {
    setMessage(error.message, true);
  }
}

async function loadCheckoutPage() {
  const productId = getQueryParam("id");
  const quantity = Number(getQueryParam("quantity"));
  const summary = document.getElementById("checkout-summary");
  const form = document.getElementById("checkout-form");
  const backLink = document.getElementById("back-link");

  if (!productId || !Number.isInteger(quantity) || quantity < 1 || quantity > 5) {
    form.hidden = true;
    setMessage("The selected product or quantity is invalid.", true);
    return;
  }

  backLink.href = `product.html?id=${encodeURIComponent(productId)}`;
  setMessage("Loading checkout...");

  try {
    const response = await getProduct(productId);
    const product = response.data;

    if (quantity > product.available_quantity) {
      form.hidden = true;
      setMessage("The selected quantity is no longer available.", true);
      return;
    }

    const total = product.price * quantity;

    summary.innerHTML = `
      <h2>Order summary</h2>
      <p><strong>Product:</strong> ${escapeHtml(product.name)}</p>
      <p><strong>Quantity:</strong> ${quantity}</p>
      <p><strong>Total:</strong> ${formatMoney(total, product.currency)}</p>
    `;

    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      setMessage("");

      const submitButton = document.getElementById("submit-order");
      submitButton.disabled = true;

      const data = new FormData(form);
      const order = {
        product_id: Number(productId),
        quantity,
        customer: {
          full_name: data.get("full_name").trim(),
          email: data.get("email").trim(),
        },
        delivery_address: {
          address_line: data.get("address_line").trim(),
          city: data.get("city").trim(),
          postcode: data.get("postcode").trim(),
        },
        payment: {
          cardholder_name: data.get("cardholder_name").trim(),
          card_number: data.get("card_number").trim(),
          expiry_date: data.get("expiry_date").trim(),
          security_code: data.get("security_code").trim(),
        },
      };

      try {
        const response = await createOrder(order);
        const orderId = response.data.id;
        window.location.href = `success.html?orderId=${encodeURIComponent(orderId)}`;
      } catch (error) {
        setMessage(error.message, true);
        submitButton.disabled = false;
      }
    });

    setMessage("");
  } catch (error) {
    form.hidden = true;
    setMessage(error.message, true);
  }
}

async function loadSuccessPage() {
  const orderId = getQueryParam("orderId");
  const container = document.getElementById("order-summary");

  if (!orderId) {
    container.hidden = true;
    setMessage("No order was provided.", true);
    return;
  }

  setMessage("Loading order...");

  try {
    const response = await getOrder(orderId);
    const order = response.data;

    const items = order.items.map((item) => `
      <li>
        <strong>${escapeHtml(item.product_name)}</strong><br>
        Quantity: ${item.quantity}<br>
        Unit price: ${formatMoney(item.unit_price, item.currency)}<br>
        Line total: ${formatMoney(item.line_total, item.currency)}
      </li>
    `).join("");

    container.innerHTML = `
      <p><strong>Order ID:</strong> ${escapeHtml(order.id)}</p>
      <p><strong>Status:</strong> ${escapeHtml(order.status)}</p>
      <p>${escapeHtml(order.message)}</p>
      <h2>Items</h2>
      <ul>${items}</ul>
      <p><strong>Total items:</strong> ${order.item_count}</p>
      <p><strong>Order total:</strong> ${formatMoney(order.total, order.currency)}</p>
    `;

    setMessage("");
  } catch (error) {
    container.hidden = true;
    setMessage(error.message, true);
  }
}

switch (page) {
  case "products":
    loadProductsPage();
    break;
  case "product":
    loadProductPage();
    break;
  case "checkout":
    loadCheckoutPage();
    break;
  case "success":
    loadSuccessPage();
    break;
}
