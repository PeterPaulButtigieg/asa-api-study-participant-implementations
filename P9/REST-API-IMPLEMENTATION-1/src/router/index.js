import { createRouter, createWebHistory } from "vue-router";

import ProductsView from "../views/ProductsView.vue";
import ProductView from "../views/ProductView.vue";
import CheckoutView from "../views/CheckoutView.vue";
import OrderConfirmationView from "../views/OrderConfirmationView.vue";

const routes = [
  {
    path: "/",
    name: "products",
    component: ProductsView
  },
  {
    path: "/products/:id",
    name: "product",
    component: ProductView
  },
  {
    path: "/checkout",
    name: "checkout",
    component: CheckoutView
  },
  {
    path: "/orders/:id",
    name: "order",
    component: OrderConfirmationView
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;