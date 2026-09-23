<script setup>
import { onMounted, ref } from "vue"
import { getProducts } from "../api"

const products = ref([])
const error = ref("")

onMounted(async () => {
  try {
    const response = await getProducts()
    products.value = response.data
  } catch (e) {
    error.value = e.message
  }
})
</script>

<template>
  <h1>Products</h1>

  <p v-if="error">{{ error }}</p>

  <div class="products">
    <div v-for="product in products" :key="product.id" class="product">
      <img :src="product.image_url" :alt="product.name">

      <h2>{{ product.name }}</h2>

      <p>
        {{ product.price }} {{ product.currency }}
      </p>

      <ul>
        <li v-for="feature in product.features" :key="feature">
          {{ feature }}
        </li>
      </ul>

      <RouterLink :to="`/product/${product.id}`">
        View Product
      </RouterLink>
    </div>
  </div>
</template>