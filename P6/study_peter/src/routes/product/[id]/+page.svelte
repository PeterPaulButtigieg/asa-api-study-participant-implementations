<script>
  import { onMount } from 'svelte';
  import { page } from '$app/state';
  import { goto } from '$app/navigation';
  import { getProduct } from '$lib/api.js';

  let product = null;
  let quantity = 1;
  let error = '';

  onMount(async () => {
    try {
      const response = await getProduct(page.params.id);
      product = response.data;
    }
    catch (e) { error = e.message; }
  });

  function buy() {
    const allowed = Math.min(5, product.available_quantity);
    quantity = Math.max(1, Math.min(Number(quantity) || 1, allowed));
    goto(`/checkout?product=${product.id}&qty=${quantity}`);
  }
</script>

{#if error}
  <p class="error">{error}</p>
{:else if !product}
  <p>Loading product...</p>
{:else}
    <img src={product.image_url} alt={product.name} style="width: 500px" />
    <section>
      <h1>{product.name}</h1>
      <p>{product.description}</p>
      <h2>{product.currency} {product.price.toFixed(2)}</h2>
      <ul>{#each product.features as feature}<li>{feature}</li>{/each}</ul>
      <p>{product.available_quantity} currently available</p>

      <label>Quantity
        <input type="number" bind:value={quantity} min="1" max={Math.min(5, product.available_quantity)} />
      </label>
      <button onclick={buy} disabled={product.available_quantity < 1}>Buy Now</button>
    </section>
{/if}
