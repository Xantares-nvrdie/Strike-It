<template>
  <section class="min-h-screen bg-white pt-24 pb-24 px-4">
    <div class="heading-penilaian mb-12 text-center">
      <h2 class="text-4xl md:text-5xl font-medium text-black">Penilaian Pelanggan</h2>
    </div>
    
    <div class="container-card-penilaian grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
      
      <ReviewCard 
        name="Iqbal Rizky" 
        comment="Pengalaman memancing yang luar biasa! Tempatnya bersih, stafnya ramah, dan ikannya melimpah. Saya pasti akan kembali lagi!"
      />
      <ReviewCard 
        name="Bintang Fajar" 
        comment="Pengalaman memancing yang luar biasa! Tempatnya bersih, stafnya ramah, dan ikannya melimpah. Saya pasti akan kembali lagi!"
      />
      <ReviewCard 
        name="Iqbal Rizky" 
        comment="Pengalaman memancing yang luar biasa! Tempatnya bersih, stafnya ramah, dan ikannya melimpah. Saya pasti akan kembali lagi!"
      />
      <ReviewCard 
        name="Iqbal Rizky" 
        comment="Pengalaman memancing yang luar biasa! Tempatnya bersih, stafnya ramah, dan ikannya melimpah. Saya pasti akan kembali lagi!"
      />
      <ReviewCard 
        name="Iqbal Rizky" 
        comment="Pengalaman memancing yang luar biasa! Tempatnya bersih, stafnya ramah, dan ikannya melimpah. Saya pasti akan kembali lagi!"
      />
      <ReviewCard 
        name="Iqbal Rizky" 
        comment="Pengalaman memancing yang luar biasa! Tempatnya bersih, stafnya ramah, dan ikannya melimpah. Saya pasti akan kembali lagi!"
      />
    </div>
  </section>
</template>

<script setup>
import ReviewCard from './ReviewCard.vue';
</script>