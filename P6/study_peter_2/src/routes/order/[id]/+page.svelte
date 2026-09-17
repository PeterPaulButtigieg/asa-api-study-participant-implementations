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
    } catch (e) {
      error = e.data?.detail || e.message;
    }
  });
</script>

{#if error}
  <p class="error" role="alert">{error}</p>
{:else if !order}
  <p role="status">Loading order...</p>
{:else}
  <section class="confirmation">
    <h1>Order successful</h1>
    <p class="status" role="status">{order.message}</p>
    <p><strong>Order ID:</strong> {order.id}</p>
    <p><strong>Status:</strong> {order.status}</p>

    <h2>Items</h2>
    <table>
      <thead>
        <tr><th>Product</th><th>Quantity</th><th>Unit price</th><th>Line total</th></tr>
      </thead>
      <tbody>
        {#each order.items as item}
          <tr>
            <td>{item.product_name}</td>
            <td>{item.quantity}</td>
            <td>{item.currency} {item.unit_price.toFixed(2)}</td>
            <td>{item.currency} {item.line_total.toFixed(2)}</td>
          </tr>
        {/each}
      </tbody>
    </table>

    <p><strong>Total items:</strong> {order.item_count}</p>
    <h2>Total: {order.currency} {order.total.toFixed(2)}</h2>
    <a class="button" href="/">Products</a>
  </section>
{/if}
