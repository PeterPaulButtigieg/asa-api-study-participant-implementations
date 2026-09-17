<script>
  import { onMount } from 'svelte';
  import { page } from '$app/state';
  import { getOrder } from '$lib/api.js';

  let order = null;
  let error = '';

  onMount(async () => {
    try {
      const response = await getOrder(page.params.id);
      order = response.data;
    }
    catch (e) { error = e.message; }
  });
</script>

{#if error}
  <p class="error">{error}</p>
{:else if !order}
  <p>Loading order...</p>
{:else}
  <h1>Order successful</h1>
  <p>{order.message}</p>
  <p><strong>Order:</strong> {order.id}</p>
  <p><strong>Status:</strong> {order.status}</p>

  <table>
    <thead><tr><th>Product</th><th>Qty</th><th>Unit</th><th>Total</th></tr></thead>
    <tbody>
      {#each order.items as item}
        <tr>
          <td>{item.product_name}</td><td>{item.quantity}</td>
          <td>{item.currency} {item.unit_price.toFixed(2)}</td>
          <td>{item.currency} {item.line_total.toFixed(2)}</td>
        </tr>
      {/each}
    </tbody>
  </table>

  <h2>{order.item_count} item(s) — {order.currency} {order.total.toFixed(2)}</h2>
  <a class="button" href="/">Back to products</a>
{/if}
