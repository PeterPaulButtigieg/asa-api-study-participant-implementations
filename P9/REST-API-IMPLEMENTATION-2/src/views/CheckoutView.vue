<script setup>
import { onMounted, reactive, ref } from "vue"
import { useRoute, useRouter } from "vue-router"
import { createOrder, getProduct } from "../api"

const router = useRouter()
const route = useRoute()

const product = ref(null)
const error = ref("")
const quantity = Number(route.query.quantity)

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
    const result = await getProduct(route.query.product)
    product.value = result.data
  } catch (e) {
    error.value = e.message
  }
})


async function submit() {
  error.value = ""

  try {
    const result = await createOrder({
      product_id: product.value.id,
      quantity: quantity,

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

    router.push(`/order/${result.data.id}`)
  }
  catch (e) {
    error.value = e.message
  }
}
</script>

<template>
  <div v-if="product">
    <h1>Checkout</h1>

    <p
      v-if="error"
      class="error"
      role="alert"
    >
      {{ error }}. Please check the details and try again.
    </p>

    <aside
      aria-label="Order summary"
      style="
        background: #d9e2dc;
        padding: 14px;
        margin-bottom: 22px;
        border: 1px solid #888;
        display: flex;
        justify-content: space-between;
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
    </aside>

    <form
      @submit.prevent="submit"
      style="
        padding: 19px;
        background: white;
        border: 1px solid #aaa;
      "
    >
      <div style="display: flex; gap: 25px; margin-bottom: 22px">
        <section style="flex: 1">
          <h2>Customer details</h2>

          <label for="fullName">Full name</label>
          <input
            id="fullName"
            v-model="form.name"
            autocomplete="name"
            required
          >

          <label for="email">Email</label>
          <input
            id="email"
            v-model="form.email"
            type="email"
            autocomplete="email"
            required
          >
        </section>

        <section style="flex: 1">
          <h2>Delivery</h2>

          <label for="address">Address</label>
          <input
            id="address"
            v-model="form.address"
            autocomplete="street-address"
            required
          >

          <label for="city">Town / city</label>
          <input
            id="city"
            v-model="form.city"
            autocomplete="address-level2"
            required
          >

          <label for="postcode">Postcode</label>
          <input
            id="postcode"
            v-model="form.postcode"
            autocomplete="postal-code"
            required
          >
        </section>
      </div>

      <h2>Payment</h2>

      <div style="display: flex; gap: 14px; flex-wrap: wrap">
        <div>
          <label for="cardName">Cardholder name</label>
          <input
            id="cardName"
            v-model="form.cardName"
            autocomplete="cc-name"
            required
          >
        </div>

        <div>
          <label for="cardNumber">Card number</label>
          <input
            id="cardNumber"
            v-model="form.cardNumber"
            aria-describedby="cardHelp"
            autocomplete="cc-number"
            placeholder="4242 4242 4242 4242"
            required
          >
        </div>

        <div>
          <label for="expiry">Expiry Date</label>
          <input
            id="expiry"
            v-model="form.expiry"
            autocomplete="cc-exp"
            pattern="\d{2}/\d{2}"
            required
          >
        </div>

        <div>
          <label for="cvv">CVV</label>
          <input
            id="cvv"
            v-model="form.cvv"
            autocomplete="cc-csc"
            inputmode="numeric"
            pattern="\d{3,4}"
            required
          >
        </div>
      </div>

      <button
        style="
          margin-top: 22px;
          background: #52796f;
          padding: 10px 20px;
        "
      >
        Place Order
      </button>
    </form>
  </div>
</template>