<script>
  import '../app.css';
  let { children } = $props();
</script>

<header>
  <a class="brand" href="/">The 2 Things Store</a>
  <a href="/">Products</a>
</header>

<main>
  {@render children()}
</main>
