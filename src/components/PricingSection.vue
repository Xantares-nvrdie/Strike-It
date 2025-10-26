<template>
  <section class="min-h-screen bg-white text-center pt-24 pb-16">
    <div class="container-langganan-header px-4">
      <h2 class="text-4xl md:text-5xl font-medium text-black">Langganan</h2>
      <p class="mt-5 text-base text-gray-600 max-w-xl mx-auto leading-relaxed">
        Harga transparan, tanpa biaya tersembunyi. Bayar sekali di depan untuk paket pilihan Anda, nikmati mancing tanpa was-was.
      </p>
    </div>

    <div class="container-langganan-card mt-12 px-4">
      <div class="pricing-container flex flex-wrap justify-center gap-6">
        
        <PricingCard 
          title="Kawan Mancing" 
          subtitle="Mancing cerdas. Kantong puas." 
          price="75.000" 
          :features="['Anda dapat menghentikan atau membatalkan kapan saja.', 'Diskon 10% untuk sewa alat pancing.', 'Voucher makan di restoran/kantin.', 'Pemberian umpan dasar gratis saat kedatangan.']"
        />

        <PricingCard 
          title="Juragan Mancing" 
          subtitle="Untuk Para Hobiis Sejati, Pilihan Paling Populer." 
          price="100.000" 
          :features="['Anda dapat menghentikan atau membatalkan kapan saja.', 'Diskon 10% untuk sewa alat pancing.', 'Diskon 20% untuk pembelian umpan.', 'Pemberian umpan dasar gratis saat kedatangan.', 'Kesempatan mengikuti turnamen bulanan secara gratis.']"
          is-popular
        />

        <PricingCard 
          title="Jawara Mancing" 
          subtitle="Pengalaman Terbaik, Tanpa Batas dan Tanpa Kompromi." 
          price="150.000" 
          :features="['Anda dapat menghentikan atau membatalkan kapan saja.', 'Diskon 10% untuk sewa alat pancing.', 'Diskon 20% untuk pembelian umpan.', 'Kesempatan mengikuti turnamen bulanan secara gratis.', 'Satu sesi konsultasi mingguan dengan pemandu mancing profesional.']"
        />
        
      </div>
    </div>
  </section>
</template>

<script setup>
import PricingCard from './PricingCard.vue';
</script>