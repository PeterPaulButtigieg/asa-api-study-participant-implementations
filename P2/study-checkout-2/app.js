import {
  getProducts,
  getProduct,
  createOrder,
  getOrder,
} from "./api.js";

const page = document.body.dataset.page;

function getQueryParam(name) {
  const params = new URLSearchParams(window.location.search);
  return params.get(name);
}

function formatMoney(value, currency) {
  try {
    return new Intl.NumberFormat(undefined, {
      style: "currency",
      currency: currency,
    }).format(value);
  } catch {
    return `${value} ${currency}`;
  }
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function setMessage(text, isError = false) {
  const message = document.getElementById("message");

  if (!message) {
    return;
  }

  message.textContent = text;
  message.classList.toggle("error", isError);

  if (isError) {
    message.setAttribute("role", "alert");
    message.setAttribute("aria-live", "assertive");

    if (text) {
      message.tabIndex = -1;
      message.focus();
    }
  } else {
    message.setAttribute("role", "status");
    message.setAttribute("aria-live", "polite");
  }
}

function makeFeatures(features) {
  if (!features || features.length === 0) {
    return "<p>No features listed.</p>";
  }

  return `
    <ul>
      ${features
        .map((feature) => `<li>${escapeHtml(feature)}</li>`)
        .join("")}
    </ul>
  `;
}

async function loadProductsPage() {
  const productList = document.getElementById("product-list");

  setMessage("Loading products...");

  try {
    const response = await getProducts();
    const products = response.data;

    productList.innerHTML = products
      .map(
        (product) => `
          <li class="product-card">
            <article>
              <h2>${escapeHtml(product.name)}</h2>

              <img
                src="${escapeHtml(product.image_url)}"
                alt="${escapeHtml(product.name)}"
              >

              <p>
                <strong>
                  ${formatMoney(product.price, product.currency)}
                </strong>
              </p>

              <h3>Features</h3>
              ${makeFeatures(product.features)}

              <a
                class="button"
                href="product.html?id=${encodeURIComponent(product.id)}"
              >
                View ${escapeHtml(product.name)}
              </a>
            </article>
          </li>
        `
      )
      .join("");

    if (products.length === 0) {
      setMessage("There are no products available.");
    } else {
      setMessage("");
    }
  } catch (error) {
    setMessage(error.message, true);
  }
}

async function loadProductPage() {
  const productId = getQueryParam("id");
  const container = document.getElementById("product-detail");

  if (!productId) {
    setMessage("A product was not selected.", true);
    return;
  }

  setMessage("Loading product...");

  try {
    const response = await getProduct(productId);
    const product = response.data;

    const maxQuantity = Math.min(
      product.available_quantity,
      5
    );

    const unavailable = maxQuantity < 1;

    container.innerHTML = `
      <h1>${escapeHtml(product.name)}</h1>

      <img
        src="${escapeHtml(product.image_url)}"
        alt="${escapeHtml(product.name)}"
      >

      <p>${escapeHtml(product.description)}</p>

      <p>
        <strong>Price:</strong>
        ${formatMoney(product.price, product.currency)}
      </p>

      <section aria-labelledby="product-features">
        <h2 id="product-features">Features</h2>
        ${makeFeatures(product.features)}
      </section>

      <p>
        <strong>Available quantity:</strong>
        ${product.available_quantity}
      </p>

      <form id="purchase-form">
        <label for="quantity">Quantity</label>

        <input
          type="number"
          id="quantity"
          name="quantity"
          value="1"
          min="1"
          max="${maxQuantity}"
          required
          ${unavailable ? "disabled" : ""}
        >

        <button
          type="submit"
          ${unavailable ? "disabled" : ""}
        >
          Buy now
        </button>
      </form>
    `;

    if (unavailable) {
      setMessage("This product is currently unavailable.");
      return;
    }

    const purchaseForm =
      document.getElementById("purchase-form");

    purchaseForm.addEventListener("submit", (event) => {
      event.preventDefault();

      const quantity = Number(
        document.getElementById("quantity").value
      );

      window.location.href =
        `checkout.html?id=${encodeURIComponent(product.id)}` +
        `&quantity=${encodeURIComponent(quantity)}`;
    });

    setMessage("");
  } catch (error) {
    setMessage(error.message, true);
  }
}

async function loadCheckoutPage() {
  const productId = getQueryParam("id");
  const quantity = Number(getQueryParam("quantity"));

  const summary =
    document.getElementById("checkout-summary");

  const form =
    document.getElementById("checkout-form");

  const backLink =
    document.getElementById("back-link");

  if (
    !productId ||
    !Number.isInteger(quantity) ||
    quantity < 1 ||
    quantity > 5
  ) {
    setMessage(
      "The selected product or quantity is invalid.",
      true
    );
    return;
  }

  backLink.href =
    `product.html?id=${encodeURIComponent(productId)}`;

  setMessage("Loading checkout...");

  try {
    const response = await getProduct(productId);
    const product = response.data;

    if (quantity > product.available_quantity) {
      setMessage(
        "The selected quantity is no longer available. Return to the product page and choose another quantity.",
        true
      );
      return;
    }

    summary.innerHTML = `
      <h2>Order summary</h2>

      <dl>
        <dt>Product</dt>
        <dd>${escapeHtml(product.name)}</dd>

        <dt>Quantity</dt>
        <dd>${quantity}</dd>

        <dt>Total</dt>
        <dd>
          ${formatMoney(
            product.price * quantity,
            product.currency
          )}
        </dd>
      </dl>
    `;

    form.hidden = false;
    setMessage("");

    form.addEventListener("submit", async (event) => {
      event.preventDefault();

      const submitButton =
        document.getElementById("submit-order");

      submitButton.disabled = true;
      submitButton.textContent = "Placing order...";

      setMessage("");

      const formData = new FormData(form);

      const order = {
        product_id: Number(productId),
        quantity: quantity,

        customer: {
          full_name: formData.get("full_name").trim(),
          email: formData.get("email").trim(),
        },

        delivery_address: {
          address_line:
            formData.get("address_line").trim(),
          city:
            formData.get("city").trim(),
          postcode:
            formData.get("postcode").trim(),
        },

        payment: {
          cardholder_name:
            formData.get("cardholder_name").trim(),
          card_number:
            formData.get("card_number").trim(),
          expiry_date:
            formData.get("expiry_date").trim(),
          security_code:
            formData.get("security_code").trim(),
        },
      };

      try {
        const result = await createOrder(order);

        window.location.href =
          `success.html?orderId=${encodeURIComponent(
            result.data.id
          )}`;
      } catch (error) {
        setMessage(
          `${error.message}. Please check the entered information and try again.`,
          true
        );

        submitButton.disabled = false;
        submitButton.textContent = "Place order";
      }
    });
  } catch (error) {
    setMessage(error.message, true);
  }
}

async function loadSuccessPage() {
  const orderId = getQueryParam("orderId");

  const summary =
    document.getElementById("order-summary");

  const orderStatus =
    document.getElementById("order-status");

  if (!orderId) {
    setMessage("No order was selected.", true);
    return;
  }

  setMessage("Loading order details...");

  try {
    const response = await getOrder(orderId);
    const order = response.data;

    orderStatus.textContent = order.message;

    const items = order.items
      .map(
        (item) => `
          <li>
            <h3>${escapeHtml(item.product_name)}</h3>

            <dl>
              <dt>Quantity</dt>
              <dd>${item.quantity}</dd>

              <dt>Unit price</dt>
              <dd>
                ${formatMoney(
                  item.unit_price,
                  item.currency
                )}
              </dd>

              <dt>Line total</dt>
              <dd>
                ${formatMoney(
                  item.line_total,
                  item.currency
                )}
              </dd>
            </dl>
          </li>
        `
      )
      .join("");

    summary.innerHTML = `
      <dl>
        <dt>Order ID</dt>
        <dd>${escapeHtml(order.id)}</dd>

        <dt>Status</dt>
        <dd>${escapeHtml(order.status)}</dd>

        <dt>Total items</dt>
        <dd>${order.item_count}</dd>

        <dt>Total</dt>
        <dd>
          ${formatMoney(order.total, order.currency)}
        </dd>
      </dl>

      <h2>Ordered items</h2>

      <ul class="order-items">
        ${items}
      </ul>
    `;

    setMessage("");
  } catch (error) {
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
