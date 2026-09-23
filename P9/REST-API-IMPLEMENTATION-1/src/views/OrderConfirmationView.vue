<script setup>
import { onMounted, ref } from "vue"
import { useRoute } from "vue-router"
import { getOrder } from "../api"

const route = useRoute()

const order = ref(null)
const error = ref("")

onMounted(async () => {
  try {
    const response = await getOrder(route.params.id)
    order.value = response.data
  } catch (e) {
    error.value = e.message
  }
})
</script>

<template>
  <h1>Order Successful</h1>

  <p v-if="error">{{ error }}</p>

  <div v-if="order">
    <p>{{ order.message }}</p>

    <p>
      <strong>Order:</strong>
      {{ order.id }}
    </p>

    <p>
      <strong>Status:</strong>
      {{ order.status }}
    </p>

    <hr>

    <p>Items: {{ order.item_count }}</p>

    <h3>
      Total: {{ order.total }} {{ order.currency }}
    </h3>

  </div>
</template>