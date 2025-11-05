<template>
  <div class="font-outfit antialiased">
    <Navigation v-if="!$route.meta.hideNavbar" />
    <main>
      <router-view />
    </main>

    <Footer />
  </div>
</template>

<script setup>
import Navigation from './components/Layout/Navigation.vue';
import Footer from './components/Layout/Footer.vue'; 

</script>

<style>
.font-outfit {
  font-family: "Outfit", sans-serif;
}
</style>
