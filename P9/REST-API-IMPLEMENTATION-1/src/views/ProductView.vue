<script setup>
import { onMounted, ref } from "vue"
import { useRoute, useRouter } from "vue-router"
import { getProduct } from "../api"

const route = useRoute()
const router = useRouter()

const product = ref(null)
const quantity = ref(1)
const error = ref("")
const loading = ref(true)

onMounted(async () => {
  try {
    const response = await getProduct(route.params.id)
    product.value = response.data
  } catch (e) {
    error.value = e.message
  }

  loading.value = false
})

function buy() {
  const max = Math.min(5, product.value.available_quantity)

  if (quantity.value < 1 || quantity.value > max) {
    error.value = `Quantity must be between 1 and ${max}`
    return
  }

  router.push(
    `/checkout?product=${product.value.id}&quantity=${quantity.value}`
  )
}
</script>

<template>
  <p v-if="loading">Loading...</p>
  <p v-if="error" style="color: darkred">{{ error }}</p>

  <div v-if="product">
    <div
      style="
        display: flex;
        gap: 30px;
        margin-top: 20px;
        background: white;
        padding: 20px;
        border: 1px solid #aaa;
      "
    >
      <div style="width: 45%">
        <img
          :src="product.image_url"
          :alt="product.name"
          style="
            width: 100%;
            max-height: 350px;
            object-fit: contain;
          "
        >
      </div>

      <div style="flex: 1">
        <h1 style="margin-top: 0">
          {{ product.name }}
        </h1>

        <p>
          {{ product.description }}
        </p>

        <h2 style="margin: 20px 0">
          {{ product.price }} {{ product.currency }}
        </h2>

        <h3>Features</h3>

        <ul>
          <li
            v-for="feature in product.features"
            :key="feature"
          >
            {{ feature }}
          </li>
        </ul>

        <p style="margin-top: 20px">
          <strong>Available:</strong>
          {{ product.available_quantity }}
        </p>

        <div
          v-if="product.available_quantity > 0"
          style="
            margin-top: 20px;
            padding-top: 15px;
            border-top: 1px solid #ccc;
          "
        >
          <label>
            Quantity
            <input
              v-model.number="quantity"
              type="number"
              min="1"
              :max="Math.min(5, product.available_quantity)"
              style="
                width: 60px;
                padding: 7px;
                margin-left: 8px;
              "
            >
          </label>

          <button
            @click="buy"
            style="
              display: block;
              margin-top: 15px;
              padding: 10px 20px;
              background: #536a92;
              color: white;
              border: 0;
              cursor: pointer;
            "
          >
            Buy Now
          </button>
        </div>

        <p v-else style="color: darkred">
          Out of stock
        </p>
      </div>
    </div>
  </div>
</template>