<script>
 import { onMount } from 'svelte';
 import { page } from '$app/state';
 import { goto } from '$app/navigation';
 import { getProduct, createOrder } from '$lib/api.js';

 let product = null;
 let quantity = 1;
 let error = '';
 let submitting=false;

 let form = {
   full_name: '', email: '', address_line: '', city: '', postcode: '',
   cardholder_name: '', card_number: '', expiry_date: '', security_code: ''
 };

 $: total = product ? product.price * quantity : 0;

 onMount(async () => {
   const id = page.url.searchParams.get('product');
   quantity = Number(page.url.searchParams.get('qty')) || 1;
   if (!id) { error = 'No product was selected.'; return; }

   try {
     const response = await getProduct(id);
     product = response.data;
     quantity = Math.max(1, Math.min(quantity, 5, product.available_quantity));
   } catch (e) { error = e.message; }
 });

 async function submitOrder() {
   error = ''; submitting = true;
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
     error = e.message;
     submitting = false;
   }
 }
</script>

<h1>Checkout</h1>
{#if error}<p class="error">{error}</p>{/if}

{#if product}
    <h2>Cart / order summary</h2>
    <p><strong>{product.name}</strong> × {quantity}</p>
    <p>Total: {product.currency} {total.toFixed(2)}</p>

  <form onsubmit={(e) => { e.preventDefault(); submitOrder(); }}>
    <h2>Customer</h2>
    <label>Full name <input required bind:value={form.full_name} /></label>
    <label>Email <input required type="email" bind:value={form.email} /></label>

    <h2>Delivery address</h2>
    <label class="wide">Address line <input required bind:value={form.address_line} /></label>
    <label>Town or city <input required bind:value={form.city} /></label>
    <label>Postal code <input required bind:value={form.postcode} /></label>

    <h2>Payment</h2>
    <label>Cardholder name <input required bind:value={form.cardholder_name} /></label>
    <label>Card number <input required minlength="12" maxlength="23" bind:value={form.card_number} /></label>
    <label>Expiry (MM/YY) <input required pattern="\d{2}/\d{2}" placeholder="12/30" bind:value={form.expiry_date} /></label>
    <label>CVV <input required pattern="\d{3,4}" maxlength="4" bind:value={form.security_code} /></label>
    <button class="wide" disabled={submitting}>{submitting ? 'Submitting...' : 'Place order'}</button>
  </form>
{/if}
