// Note: You may build your own interface against this API, or use the helper functions below unchanged or as a starting point.

const API_URL = "http://192.168.1.165:8000";

export async function getProducts() {
  const response = await fetch(`${API_URL}/api/v1/products`, {
    headers: {
      Accessibility: "true",
    },
  });

  if (!response.ok) {
    throw new Error("Failed to load products");
  }

  return response.json();
}

export async function getProduct(id) {
  const response = await fetch(`${API_URL}/api/v1/products/${id}`, {
    headers: {
      Accessibility: "true",
    },
  });

  if (!response.ok) {
    throw new Error("Failed to load product");
  }

  return response.json();
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

  if (!response.ok) {
    throw new Error("Failed to place order");
  }

  return response.json();
}

export async function getOrder(id) {
  const response = await fetch(`${API_URL}/api/v1/orders/${id}`, {
    headers: {
      Accessibility: "true",
    },
  });

  if (!response.ok) {
    throw new Error("Failed to load order");
  }

  return response.json();
}
