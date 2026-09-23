<script setup>
import { onMounted, reactive, ref } from "vue"
import { useRoute, useRouter } from "vue-router"
import { createOrder, getProduct } from "../api"

const route = useRoute()
const router = useRouter()

const product = ref(null)
const quantity = Number(route.query.quantity)
const error = ref("")

const form = reactive({
  name: "",
  email: "",
  address: "",
  city: "",
  postcode: "",
  cardName: "",
  cardNumber: "",
  expiry: "",
  cvv: ""
})

onMounted(async () => {
  try {
    const response = await getProduct(route.query.product)
    product.value = response.data
  } catch (e) {
    error.value = e.message
  }
})

async function submit() {
  try {
    const response = await createOrder({
      product_id: product.value.id,
      quantity,
      customer: {
        full_name: form.name,
        email: form.email
      },
      delivery_address: {
        address_line: form.address,
        city: form.city,
        postcode: form.postcode
      },
      payment: {
        cardholder_name: form.cardName,
        card_number: form.cardNumber,
        expiry_date: form.expiry,
        security_code: form.cvv
      }
    })

    router.push(`/order/${response.data.id}`)
  } catch (e) {
    error.value = e.message
  }
}
</script>

<template>
  <div v-if="product">

    <h1>Checkout</h1>

    <p v-if="error" style="color: darkred">
      {{ error }}
    </p>

    <div
      style="
        background: #ddd6c6;
        padding: 15px;
        margin-bottom: 20px;
        display: flex;
        justify-content: space-between;
        border: 1px solid #999;
      "
    >
      <div>
        <strong>{{ product.name }}</strong>
        <div>Quantity: {{ quantity }}</div>
      </div>

      <strong>
        {{ (product.price * quantity).toFixed(2) }}
        {{ product.currency }}
      </strong>
    </div>

    <form
      @submit.prevent="submit"
      style="
        background: white;
        padding: 20px;
        border: 1px solid #aaa;
      "
    >
      <div
        style="
          display: flex;
          gap: 30px;
          margin-bottom: 20px;
        "
      >
        <div style="flex: 1">
          <h3>Customer</h3>

          <label>Full name</label>
          <input v-model="form.name" required>

          <label>Email</label>
          <input v-model="form.email" type="email" required>
        </div>

        <div style="flex: 1">
          <h3>Delivery</h3>

          <label>Address</label>
          <input v-model="form.address" required>

          <label>Town / city</label>
          <input v-model="form.city" required>

          <label>Postcode</label>
          <input v-model="form.postcode" required>
        </div>
      </div>

      

      <h3>Payment</h3>

      <div style="display: flex; gap: 15px; flex-wrap: wrap">
        <div>
          <label>Cardholder name</label>
          <input v-model="form.cardName" required>
        </div>

        <div>
          <label>Card number</label>
          <input
            v-model="form.cardNumber"
            placeholder="4242 4242 4242 4242"
            required
          >
        </div>

        <div>
          <label>Expiry</label>
          <input
            v-model="form.expiry"
            placeholder="MM/YY"
            pattern="\d{2}/\d{2}"
            required
          >
        </div>

        <div>
          <label>CVV</label>
          <input
            v-model="form.cvv"
            pattern="\d{3,4}"
            required
          >
        </div>
      </div>

      <button
        style="
          margin-top: 20px;
          padding: 10px 22px;
          background: #536a92;
          color: white;
          border: 0;
        "
      >
        Place Order
      </button>
    </form>
  </div>
</template>