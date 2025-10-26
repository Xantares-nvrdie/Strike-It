<template>
  <div>
    <Navigation />
    <LandingSection />
    <LocationPreview />
    <SubscriptionSection />
    <DiscountSection />
    <ReviewSection />
    <AppFooter />

    <!-- Test Tailwind -->
    <h1 class="text-7xl font-bold text-red-500">
      Hello Tailwind + Vue 🎉
    </h1>
  </div>
</template>

<script setup>
import Navigation from './components/Navigation.vue'
import LandingSection from './components/LandingSection.vue'
import LocationPreview from './components/LocationPreview.vue'
import SubscriptionSection from './components/SubscriptionSection.vue'
import DiscountSection from './components/DiscountSection.vue'
import ReviewSection from './components/ReviewSection.vue'
import AppFooter from './components/Footer.vue'
</script>

<style>
/* CSS global optional */
</style>
