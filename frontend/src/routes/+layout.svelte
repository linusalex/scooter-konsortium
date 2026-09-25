<script lang="ts">
  import Footer from '$lib/components/footer.svelte';
  import Header from '$lib/components/header.svelte';
  import '../app.css';
  let { children } = $props();
</script>

<svelte:head>
  <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet" />
  <link
    href="https://fonts.googleapis.com/css2?family=Nunito+Sans:wght@400;600;700&display=swap"
    rel="stylesheet"
  />
  <title>Scooter</title>
</svelte:head>

<div class="flex min-h-screen flex-col">
  <Header />
  <main class="flex grow">
    {@render children?.()}
  </main>
  <br />
  <footer>
    <!-- <Footer /> -->
  </footer>
</div>

<style>
</style>
