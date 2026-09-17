//Note: You may build your own interface against this API, or use the helper functions below unchanged or as a starting point.

const API_URL = "http://192.168.1.128:8000";

async function handleResponse(response, fallbackMessage) {
  if (!response.ok) {
    let errorMessage = fallbackMessage;

    try {
      const data = await response.json();

      errorMessage =
        data.detail ||
        data.message ||
        data.error ||
        fallbackMessage;
    } catch {
      try {
        const text = await response.text();
        if (text) {
          errorMessage = text;
        }
      } catch {
        
      }
    }

    const error = new Error(errorMessage);
    error.status = response.status;
    error.statusText = response.statusText;

    throw error;
  }

  return response.json();
}

export async function getProducts() {
  const response = await fetch(`${API_URL}/api/v1/products`);
  return handleResponse(response, "Failed to load products");
}

export async function getProduct(id) {
  const response = await fetch(`${API_URL}/api/v1/products/${id}`);
  return handleResponse(response, "Failed to load product");
}

export async function createOrder(order) {
  const response = await fetch(`${API_URL}/api/v1/orders`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(order),
  });

  return handleResponse(response, "Failed to place order");
}

export async function getOrder(id) {
  const response = await fetch(`${API_URL}/api/v1/orders/${id}`);
  return handleResponse(response, "Failed to load order");
}
