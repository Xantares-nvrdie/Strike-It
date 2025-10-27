<template>
  <div class="font-outfit antialiased">
    <Navigation />
    <main>
      <LandingSection />

      <LocationPreview />
      <PricingSection />
      <DiscountSection />

      <ReviewSection />
    </main>

    <Footer />
  </div>
</template>

<script setup>
// 💡 IMPOR DISESUAIKAN DENGAN NAMA FILE DAN LOKASI ANDA
import Navigation from './components/Navigation.vue';
import LandingSection from './components/LandingSection.vue';
import LocationPreview from './components/LocationPreview.vue';
import PricingSection from './components/PricingSection.vue';
import DiscountSection from './components/DiscountSection.vue';
import ReviewSection from './components/ReviewSection.vue'; // Penilaian
import Footer from './components/Footer.vue'; // Komponen tambahan

// Catatan: Pastikan path impor (misalnya './components/...') sesuai dengan struktur folder Anda yang sebenarnya.
</script>

<style>
/* Dibiarkan kosong/minimal, karena styling utama ditangani oleh Tailwind CSS */
.font-outfit {
  font-family: "Outfit", sans-serif;
}
</style>