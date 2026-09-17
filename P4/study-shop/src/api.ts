import type {
  CheckoutPayload,
  OrderResponse,
  ProductCollectionResponse,
  ProductResponse,
} from "./types";


const API_URL = "http://192.168.1.165:8000";


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


async function throwApiError(
  response: Response,
  message: string
): Promise<never> {
  const rawBody = await response.text();

  let body: unknown = rawBody;

  try {
    body = rawBody
      ? JSON.parse(rawBody)
      : null;
  } catch {
    body = rawBody;
  }

  throw new ApiError(
    message,
    response.status,
    body
  );
}


export async function getProducts():
  Promise<ProductCollectionResponse> {

  const response = await fetch(
    `${API_URL}/api/v1/products`
  );

  if (!response.ok) {
    return throwApiError(
      response,
      "Failed to load products"
    );
  }

  return response.json();
}


export async function getProduct(
  id: number
): Promise<ProductResponse> {

  const response = await fetch(
    `${API_URL}/api/v1/products/${id}`
  );

  if (!response.ok) {
    return throwApiError(
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
      },

      body: JSON.stringify(order),
    }
  );


  if (!response.ok) {
    return throwApiError(
      response,
      "Failed to place order"
    );
  }

  return response.json();
}


export async function getOrder(
  id: string
): Promise<OrderResponse> {

  const response = await fetch(
    `${API_URL}/api/v1/orders/${id}`
  );

  if (!response.ok) {
    return throwApiError(
      response,
      "Failed to load order"
    );
  }

  return response.json();
}