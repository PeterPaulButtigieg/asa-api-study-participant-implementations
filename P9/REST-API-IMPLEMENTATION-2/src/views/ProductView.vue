<script setup>
import { onMounted, ref } from "vue"
import { useRoute, useRouter } from "vue-router"
import { getProduct } from "../api"

const route = useRoute()
const router = useRouter()

const product = ref(null)
const quantity = ref(1)
const loading = ref(true)
const error = ref("")

onMounted(async () => {
  try {
    const result = await getProduct(route.params.id)
    product.value = result.data
  } catch (e) {
    error.value = e.message
  }

  loading.value = false
})


function buy() {
  const maximum = Math.min(product.value.available_quantity, 5)

  if (quantity.value < 1 || quantity.value > maximum) {
    error.value = `Choose a quantity between 1 and ${maximum}`
    return
  }

  router.push(
    `/checkout?product=${product.value.id}&quantity=${quantity.value}`
  )
}
</script>

<template>
  <p v-if="loading" role="status" aria-live="polite">
    Loading product...
  </p>

  <p v-if="error" class="error" role="alert">
    {{ error }}
  </p>

  <div v-if="product">



    <div
      style="
        display: flex;
        gap: 26px;
        background: white;
        margin-top: 18px;
        padding: 18px;
        border: 1px solid #999;
      "
    >
      <div style="width: 44%">
        <img
          :src="product.image_url"
          :alt="`${product.name} product`"
          style="
            width: 100%;
            height: 330px;
            object-fit: contain;
          "
        >
      </div>

      <section style="flex: 1">
        <h1 style="margin-top: 2px">
          {{ product.name }}
        </h1>

        <p>{{ product.description }}</p>

        <h2 style="margin: 18px 0">
          {{ product.price }} {{ product.currency }}
        </h2>

        <h3>Features</h3>

        <ul>
          <li v-for="feature in product.features" :key="feature">
            {{ feature }}
          </li>
        </ul>

        <p style="margin-top: 22px">
          <strong>In stock:</strong>
          {{ product.available_quantity }}
        </p>

        <div
          v-if="product.available_quantity > 0"
          style="
            border-top: 1px solid #bbb;
            padding-top: 14px;
            margin-top: 18px;
          "
        >
          <label for="quantity">
            Quantity
          </label>

          <input
            id="quantity"
            v-model.number="quantity"
            type="number"
            min="1"
            :max="Math.min(5, product.available_quantity)"
            style="width: 55px"
          >

          <button
            @click="buy"
            style="
              display: block;
              margin-top: 13px;
              background: #52796f;
            "
          >
            Buy Now
          </button>
        </div>

        <p v-else class="error">
          Out of stock
        </p>
      </section>
    </div>
  </div>
</template>