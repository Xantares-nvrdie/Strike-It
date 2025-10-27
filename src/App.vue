<template>
  <div class="font-outfit antialiased">
    <Navigation />
    <main>
      <LandingSection />

      <LocationPreview />
      <PricingSection />
      <DiscountSection />
      <EventSection />
      <ReviewSection />
    </main>

    <Footer />
  </div>
</template>

<script setup>
import Navigation from './components/Navigation.vue';
import LandingSection from './components/LandingSection.vue';
import LocationPreview from './components/LocationPreview.vue';
import PricingSection from './components/PricingSection.vue';
import DiscountSection from './components/DiscountSection.vue';
import ReviewSection from './components/ReviewSection.vue';
import EventSection from './components/EventSection.vue';
import Footer from './components/Footer.vue'; 

</script>

<style>
.font-outfit {
  font-family: "Outfit", sans-serif;
}
</style>
