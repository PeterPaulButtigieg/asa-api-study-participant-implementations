<script>
  import { onMount } from 'svelte';
  import { getProducts } from '$lib/api.js';

  let products = [];
  let loading = true;
  let error = '';

  onMount(async () => {
    try {
      const result = await getProducts();
      products = result.data || [];
    } catch (e) {
      error = e.data?.detail || e.message;
    }
    loading = false;
  });
</script>

<section class="page-top">
  <div>
    <h1>Products</h1>
    <p>Small selection.</p>
  </div>
  {#if !loading && !error}<span>{products.length} products</span>{/if}
</section>

{#if loading}
  <p role="status">Loading products...</p>
{:else if error}
  <p class="error" role="alert">{error}</p>
{:else}
  <section aria-label="Available products">
    {#each products as product}
      <article class="card">
        <div class="card-image">
          <img src={product.image_url} alt={product.name} />
        </div>
        <div class="card-info">
          <div class="card-heading">
            <h2>{product.name}</h2>
            <strong>{product.currency} {product.price.toFixed(2)}</strong>
          </div>
          <ul class="features">
            {#each product.features as feature}
              <li>{feature}</li>
            {/each}
          </ul>
          <a class="button" href={`/product/${product.id}`}>View {product.name}</a>
        </div>
      </article>
    {/each}
  </section>
{/if}
