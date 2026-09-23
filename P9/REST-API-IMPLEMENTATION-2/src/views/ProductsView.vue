<script setup>
import { onMounted, ref } from "vue"
import { getProducts } from "../api"

const products = ref([])
const error = ref("")

onMounted(async () => {
  try {
    let response = await getProducts()
    products.value = response.data
  }
  catch (e) {
    error.value = e.message
  }
})
</script>

<template>
  <h1>Products</h1>

  <p v-if="error" class="error" role="alert">
    {{ error }}
  </p>

  <div class="products">
    <article
      v-for="product in products"
      :key="product.id"
      class="product"
    >
      <img
        :src="product.image_url"
        :alt="product.name"
      >

      <h2>{{ product.name }}</h2>

      <p class="price">
        {{ product.price }} {{ product.currency }}
      </p>

      <ul>
        <li v-for="item in product.features" :key="item">
          {{ item }}
        </li>
      </ul>

      <RouterLink
        :to="`/product/${product.id}`"
        :aria-label="`View Product - ${product.name}`"
      >
        View
      </RouterLink>
    </article>
  </div>
</template>