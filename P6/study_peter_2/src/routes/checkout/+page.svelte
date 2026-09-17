<script>
 import { onMount } from 'svelte';
 import { page } from '$app/state';
 import { goto } from '$app/navigation';
 import { getProduct, createOrder } from '$lib/api.js';

 let product = null;
 let quantity = 1;
 let error = '';
 let suggestions = [];
 let sending = false;

 let form = {
   full_name:'', email:'', address_line:'', city:'', postcode:'',
   cardholder_name:'', card_number:'', expiry_date:'', security_code:''
 };

 $: total = product ? product.price * quantity : 0;

 onMount(async () => {
   const id = page.url.searchParams.get('product');
   quantity = Number(page.url.searchParams.get('qty')) || 1;
   if (!id) { error = 'No product selected.'; return; }

   try {
     const response = await getProduct(id);
     product = response.data;
     quantity = Math.min(Math.max(quantity, 1), 5, product.available_quantity);
   } catch (e) {
     error = e.data?.detail || e.message;
   }
 });

 function readApiError(e) {
   suggestions = [];
   const body = e.data;

   if (Array.isArray(body?.detail)) {
     error = body.detail.map((x) => x.msg || 'Invalid input').join('. ');
   } else error = body?.detail || e.message;

   const nudges = body?.accessibility?.nudges || [];
   suggestions = nudges
     .filter((n) => n.success_criterion === '3.3.3' || n.type === 'error-suggestion')
     .map((n) => n.message || n.values?.[0])
     .filter(Boolean);
 }

 async function submitOrder() {
   sending = true; error = ''; suggestions = [];

   const order = {
     product_id: product.id,
     quantity,
     customer: { full_name: form.full_name, email: form.email },
     delivery_address: { address_line: form.address_line, city: form.city, postcode: form.postcode },
     payment: {
       cardholder_name: form.cardholder_name,
       card_number: form.card_number,
       expiry_date: form.expiry_date,
       security_code: form.security_code
     }
   };

   try {
     const result = await createOrder(order);
     goto(`/order/${result.data.id}`);
   } catch (e) {
     readApiError(e);
     sending = false;
   }
 }
</script>

<h1>Checkout</h1>
<p>Complete the details below to place the order.</p>

{#if error}
  <div class="error" role="alert">
    <strong>There was a problem.</strong>
    <div>{error}</div>
    {#if suggestions.length}
      <ul>{#each suggestions as suggestion}<li>{suggestion}</li>{/each}</ul>
    {/if}
  </div>
{/if}

{#if product}
  <section class="summary" aria-labelledby="order-summary-title">
    <h2 id="order-summary-title">Order summary</h2>
    <p><strong>{product.name}</strong> × {quantity}</p>
    <p>Total: <strong>{product.currency} {total.toFixed(2)}</strong></p>
  </section>

  <form onsubmit={(event) => { event.preventDefault(); submitOrder(); }}>
    <h2>Customer information</h2>
    <label>Full name <input required autocomplete="name" bind:value={form.full_name} /></label>
    <label>Email address <input required type="email" autocomplete="email" bind:value={form.email} /></label>

    <h2>Delivery address</h2>
    <label class="wide">Address line <input required autocomplete="street-address" bind:value={form.address_line} /></label>
    <label>Town or city <input required autocomplete="address-level2" bind:value={form.city} /></label>
    <label>Postal code <input required autocomplete="postal-code" bind:value={form.postcode} /></label>

    <h2>Payment</h2>
    <label>Cardholder name <input required autocomplete="cc-name" bind:value={form.cardholder_name} /></label>
    <label>Card number <input required minlength="12" maxlength="23" inputmode="numeric" autocomplete="cc-number" bind:value={form.card_number} /></label>
    <label>Expiry date <input required pattern="\d{2}/\d{2}" placeholder="MM/YY" autocomplete="cc-exp" bind:value={form.expiry_date} /></label>
    <label>CVV <input required pattern="\d{3,4}" maxlength="4" inputmode="numeric" autocomplete="cc-csc" bind:value={form.security_code} /></label>

    <button class="wide" disabled={sending}>{sending ? 'Placing order...' : 'Place order'}</button>
  </form>
{/if}
