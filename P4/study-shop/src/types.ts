export type Product = {
  id: number;
  name: string;
  description: string;
  price: number;
  currency: string;
  image_url: string;
  available_quantity: number;
  features: string[];
};


export type ProductCollectionResponse = {
  data: Product[];
  links: unknown[];
};


export type ProductResponse = {
  data: Product;
  links: unknown[];
};


export type CheckoutPayload = {
  product_id: number;
  quantity: number;

  customer: {
    full_name: string;
    email: string;
  };

  delivery_address: {
    address_line: string;
    city: string;
    postcode: string;
  };

  payment: {
    cardholder_name: string;
    card_number: string;
    expiry_date: string;
    security_code: string;
  };
};


export type OrderItem = {
  product_id: number;
  product_name: string;
  quantity: number;
  unit_price: number;
  line_total: number;
  currency: string;
};


export type OrderData = {
  id: string;
  status: string;
  message: string;
  items: OrderItem[];
  item_count: number;
  total: number;
  currency: string;
};


export type OrderResponse = {
  data: OrderData;
  links: unknown[];
};


export type Cart = {
  product: Product;
  quantity: number;
};