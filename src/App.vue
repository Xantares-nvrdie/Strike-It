<template>
  <div>
    <Navigation />
    <LandingSection />
    <LocationPreview />
    <SubscriptionSection />
    <DiscountSection />
    <ReviewSection />
    <AppFooter />
  </div>
</template>

<script setup>
// Mengimpor semua komponen yang baru kita buat
import Navigation from './components/Navigation.vue'
import LandingSection from './components/LandingSection.vue'
import LocationPreview from './components/LocationPreview.vue'
import SubscriptionSection from './components/SubscriptionSection.vue'
import DiscountSection from './components/DiscountSection.vue'
import ReviewSection from './components/ReviewSection.vue'
import AppFooter from './components/Footer.vue'
</script>

<style>
/* Anda dapat menempatkan gaya global (seperti reset CSS dari file style.css)
  di sini atau di file style.css yang diimpor di main.js.
*/
</style>