// Based on the supplied helper, but errors keep the server response as well.
const API_URL = "http://192.168.1.165:8000";

async function request(path, options = {}) {
  const headers = new Headers(options.headers || {});
  headers.set("Accessibility", "true");

  if (options.body !== undefined && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  const response = await fetch(`${API_URL}${path}`, { ...options, headers });
  let body;

  try {
    body = await response.json();
  } catch {
    body = { detail: `Request failed (${response.status})` };
  }

  if (!response.ok) {
    let msg = `Request failed (${response.status})`;
    if (typeof body?.detail === 'string') msg = body.detail;
    else if (Array.isArray(body?.detail) && body.detail.length) {
      msg = body.detail.map((x) => x.msg || x.message || 'Invalid value').join(', ');
    }

    const error = new Error(msg);
    error.status = response.status;
    error.data = body;
    error.accessibility = body?.accessibility || null;
    throw error;
  }

  return body;
}

export function getProducts() {
  return request("/api/v1/products");
}

export function getProduct(id) {
  return request(`/api/v1/products/${encodeURIComponent(id)}`);
}

export function createOrder(order) {
  return request("/api/v1/orders", {
    method: "POST",
    body: JSON.stringify(order)
  });
}

export function getOrder(id) {
  return request(`/api/v1/orders/${encodeURIComponent(id)}`);
}
