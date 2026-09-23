//Note: You may build your own interface against this API, or use the helper functions below unchanged or as a starting point.

const API_BASE_URL = "http://192.168.1.165:8000";

async function request(path, options = {}) {
  const headers = new Headers(options.headers || {});

  if (options.body !== undefined && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    let message = `Request failed (${response.status})`;

    try {
      const body = await response.json();

      if (body.detail) {
        if (Array.isArray(body.detail)) {
          message = body.detail
            .map((error) => error.msg)
            .join(", ");
        } else {
          message = String(body.detail);
        }
      }
    } catch {
      // Response was not JSON.
    }

    throw new Error(message);
  }

  return response.json();
}

export function getProducts() {
  return request("/api/v1/products");
}

export function getProduct(productId) {
  return request(
    `/api/v1/products/${encodeURIComponent(productId)}`
  );
}

export function createOrder(order) {
  return request("/api/v1/orders", {
    method: "POST",
    body: JSON.stringify(order),
  });
}

export function getOrder(orderId) {
  return request(
    `/api/v1/orders/${encodeURIComponent(orderId)}`
  );
}
