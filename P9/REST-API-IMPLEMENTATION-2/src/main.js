import { createApp } from "vue"
import { createRouter, createWebHistory } from "vue-router"

import App from "./App.vue"
import ProductsView from "./views/ProductsView.vue"
import ProductView from "./views/ProductView.vue"
import CheckoutView from "./views/CheckoutView.vue"
import OrderConfirmationView from "./views/OrderConfirmationView.vue"

import "./style.css"

const routes = [
  { path: "/", component: ProductsView },
  { path: "/product/:id", component: ProductView },
  { path: "/checkout", component: CheckoutView },
  { path: "/order/:id", component: OrderConfirmationView }
]

const router = createRouter({
  routes,
  history: createWebHistory()
})

createApp(App)
  .use(router)
  .mount("#app")