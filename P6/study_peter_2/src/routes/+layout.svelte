<script>
  import '../app.css';
  let { children } = $props();
</script>

<header>
  <a class="brand" href="/">2 Things Store</a>
  <nav><a href="/">Products</a></nav>
</header>

<main>
  {@render children()}
</main>
