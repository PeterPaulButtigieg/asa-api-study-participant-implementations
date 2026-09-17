import type {
  CheckoutPayload,
  OrderResponse,
  ProductCollectionResponse,
  ProductResponse,
} from "./types";


const API_URL = "http://192.168.1.165:8000";

const accessibilityHeaders = {
  Accessibility: "true",
};


export class ApiError extends Error {
  status: number;
  body: unknown;

  constructor(
    message: string,
    status: number,
    body: unknown
  ) {
    super(message);

    this.name = "ApiError";
    this.status = status;
    this.body = body;
  }
}


async function readError(
  response: Response,
  fallbackMessage: string
): Promise<never> {
  const text = await response.text();

  let body: unknown = text;

  if (text) {
    try {
      body = JSON.parse(text);
    } catch {
    }
  } else {
    body = null;
  }

  throw new ApiError(
    fallbackMessage,
    response.status,
    body
  );
}


export async function getProducts():
  Promise<ProductCollectionResponse> {

  const response = await fetch(
    `${API_URL}/api/v1/products`,
    {
      headers: accessibilityHeaders,
    }
  );

  if (!response.ok) {
    return readError(
      response,
      "Failed to load products"
    );
  }

  return response.json();
}


export async function getProduct(
  productId: number
): Promise<ProductResponse> {

  const response = await fetch(
    `${API_URL}/api/v1/products/${productId}`,
    {
      headers: accessibilityHeaders,
    }
  );

  if (!response.ok) {
    return readError(
      response,
      "Failed to load product"
    );
  }

  return response.json();
}


export async function createOrder(
  order: CheckoutPayload
): Promise<OrderResponse> {

  const response = await fetch(
    `${API_URL}/api/v1/orders`,
    {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
        Accessibility: "true",
      },

      body: JSON.stringify(order),
    }
  );

  if (!response.ok) {
    return readError(
      response,
      "Failed to place order"
    );
  }

  return response.json();
}


export async function getOrder(
  orderId: string
): Promise<OrderResponse> {

  const response = await fetch(
    `${API_URL}/api/v1/orders/${orderId}`,
    {
      headers: accessibilityHeaders,
    }
  );

  if (!response.ok) {
    return readError(
      response,
      "Failed to load order"
    );
  }

  return response.json();
}