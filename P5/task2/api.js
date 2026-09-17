const API_BASE_URL = "http://192.168.1.165:8000";

async function request(path, options = {}) {
  const headers = new Headers(options.headers || {});
  headers.set("Accessibility", "true");

  if (options.body !== undefined && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers
  });

  if (!response.ok) {
    let body = null;
    let message = `Request failed (${response.status})`;

    try {
      body = await response.json();
      if (body.detail) {
        message = Array.isArray(body.detail)
          ? body.detail.map(error => error.msg).join(', ')
          : String(body.detail);
      }
    } catch {
      // response did not contain json
    }

    const error = new Error(message);
    error.status = response.status;
    error.body = body;
    throw error;
  }

  return response.json();
}

export function getProducts() {
  return request("/api/v1/products");
}

export function getProduct(productId) {
  return request(`/api/v1/products/${encodeURIComponent(productId)}`);
}

export function createOrder(order) {
  return request("/api/v1/orders", {
    method: "POST",
    body: JSON.stringify(order)
  });
}

export function getOrder(orderId) {
  return request(`/api/v1/orders/${encodeURIComponent(orderId)}`);
}
