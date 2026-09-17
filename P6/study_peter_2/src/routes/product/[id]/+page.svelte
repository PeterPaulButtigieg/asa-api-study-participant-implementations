<script>
  import { onMount } from 'svelte';
  import { page } from '$app/state';
  import { goto } from '$app/navigation';
  import { getProduct } from '$lib/api.js';

  let product;
  let quantity = 1;
  let error = '';

  onMount(async () => {
    try {
      const result = await getProduct(page.params.id);
      product = result.data;
    } catch (e) {
      error = typeof e.data?.detail === 'string' ? e.data.detail : e.message;
    }
  });

  function buyNow() {
    const max = Math.min(product.available_quantity, 5);
    let q = Number(quantity);
    if (!q || q < 1) q = 1;
    if (q > max) q = max;
    quantity = q;

    goto(`/checkout?product=${product.id}&qty=${q}`);
  }
</script>

{#if error}
  <p class="error" role="alert">{error}</p>
{:else if !product}
  <p role="status">Loading product...</p>
{:else}
  <article class="">
    <div class="product-photo">
      <img src={product.image_url} alt={product.name} />
    </div>

    <section class="product-info">
      <h1>{product.name}</h1>
      <p>{product.description}</p>
      <p class="price"><strong>{product.currency} {product.price.toFixed(2)}</strong></p>

      <h2>Features</h2>
      <ul>
        {#each product.features as feature}<li>{feature}</li>{/each}
      </ul>

      <p><strong>Availability:</strong> {product.available_quantity} in stock</p>
      <label>
        Quantity
        <input type="number" min="1" max={Math.min(5, product.available_quantity)} bind:value={quantity} />
      </label>

      <button onclick={buyNow} disabled={product.available_quantity < 1}>Buy now</button>
    </section>
  </article>
{/if}
