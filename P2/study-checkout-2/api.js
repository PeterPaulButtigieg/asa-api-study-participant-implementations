// Note: You may build your own interface against this API, or use the helper functions below unchanged or as a starting point.

const API_URL = "http://192.168.1.165:8000";

async function handleResponse(response, fallbackMessage) {
  const text = await response.text();

  let data;

  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = null;
  }

  if (!response.ok) {
    const errorMessage =
      data?.detail ||
      data?.message ||
      data?.error ||
      text ||
      fallbackMessage;

    const error = new Error(errorMessage);
    error.status = response.status;
    error.statusText = response.statusText;
    error.data = data;

    throw error;
  }

  return data;
}

export async function getProducts() {
  const response = await fetch(`${API_URL}/api/v1/products`, {
    headers: {
      Accessibility: "true",
    },
  });

  return handleResponse(response, "Failed to load products");
}

export async function getProduct(id) {
  const response = await fetch(`${API_URL}/api/v1/products/${id}`, {
    headers: {
      Accessibility: "true",
    },
  });

  return handleResponse(response, "Failed to load product");
}

export async function createOrder(order) {
  const response = await fetch(`${API_URL}/api/v1/orders`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accessibility: "true",
    },
    body: JSON.stringify(order),
  });

  return handleResponse(response, "Failed to place order");
}

export async function getOrder(id) {
  const response = await fetch(`${API_URL}/api/v1/orders/${id}`, {
    headers: {
      Accessibility: "true",
    },
  });

  return handleResponse(response, "Failed to load order");
}
