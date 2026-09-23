<template>
  <div class="page">
    <header>
      <nav aria-label="Main navigation">
        <RouterLink to="/" class="logo">
          REST Store
        </RouterLink>
      </nav>
    </header>

    <main>
      <RouterView />
    </main>
  </div>
</template>