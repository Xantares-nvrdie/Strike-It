<template>
  <div class="font-outfit antialiased">
    <main>
      <LandingSection />
      <LocationPreview />
      <PricingSection />
      <DiscountSection />
      <EventSection />
      <ReviewSection />
    </main>
  </div>
</template>

<script setup>
import LandingSection from "../components/Home/LandingSection.vue";
import LocationPreview from "../components/Home/LocationPreview.vue";
import PricingSection from "../components/Home/PricingSection.vue";
import DiscountSection from "../components/Home/DiscountSection.vue";
import ReviewSection from "../components/Home/ReviewSection.vue";
import EventSection from "../components/Home/EventSection.vue";
</script>

<style>
.font-outfit {
  font-family: "Outfit", sans-serif;
}
</style>
