<script>
  import { onMount } from 'svelte';
  import { getProducts } from '$lib/api.js';

  let products = [];
  let loading = true;
  let error = '';

  onMount(async () => {
    try {
      const response = await getProducts();
      products = response.data;
    } catch (e) {
      error = e.message;
    }
    loading = false;
  });
</script>

<section class="catalog-heading">
  <div>
    <h1>Products</h1>
  </div>

  {#if !loading && !error}
    <span>{products.length} products</span>
  {/if}
</section>

{#if loading}
  <p>Loading products...</p>
{:else if error}
  <p class="error">{error}</p>
{:else}
  <section class="">
    {#each products as product}
      <article class="card product-card">
        <div class="image-wrap">
          <img src={product.image_url} alt={product.name} />
        </div>

        <div class="card-content">
          <div class="title-price">
            <h2>{product.name}</h2>
            <strong>{product.currency} {product.price.toFixed(2)}</strong>
          </div>

          <p class="stock">{product.available_quantity} available</p>

          <div class="features">
            <h3>Features</h3>
            <ul>
              {#each product.features as feature}
                <li>{feature}</li>
              {/each}
            </ul>
          </div>
        </div>

        <div class="card-actions">
          <a class="button" href={`/product/${product.id}`}>View Product</a>
        </div>
      </article>
    {/each}
  </section>
{/if}

<style>
  .catalog-heading { display: flex; justify-content: space-between; align-items: end; margin-bottom: 22px; }
  .catalog-heading h1 { margin-bottom: 4px; }
  .catalog-heading p { margin: 0; }
  .product-card { display: flex; flex-direction: column; padding: 0; overflow: hidden; }
  .image-wrap { padding: 16px; border-bottom: 1px solid #ddd; background: white; }
  .product-card .image-wrap img { width: 100%; height: 190px; object-fit: contain; }
  .card-content { padding: 16px; flex: 1; }
  .title-price { display: flex; justify-content: space-between; align-items: start; gap: 12px; }
  .title-price h2 { margin: 0; }
  .stock { font-size: 14px; margin: 7px 0 14px; }
  .features h3 { font-size: 15px; margin: 0 0 5px; }
  .features ul { margin: 0; padding-left: 18px; }
  .card-actions { padding: 0 16px 16px; }
  .card-actions .button { display: block; text-align: center; }
  @media (max-width: 650px) { .catalog-heading > span { display: none; } .title-price { flex-direction: column; } }
</style>
