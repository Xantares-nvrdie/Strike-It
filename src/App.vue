<template>
  <div class="font-outfit antialiased">
    <Navigation />
    <main>
      <router-view />
    </main>

    <Footer />
  </div>
</template>

<script setup>
import Navigation from './components/Navigation.vue';
import Footer from './components/Footer.vue'; 

</script>

<style>
.font-outfit {
  font-family: "Outfit", sans-serif;
}
</style>
