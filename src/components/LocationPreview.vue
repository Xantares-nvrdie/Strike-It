<script setup>
import { ref } from 'vue';

// 1. Komponen Ikon (Inline SVG untuk ArrowLeft)
const ArrowLeftIcon = {
  template: `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg>`
};

// 2. Komponen Ikon (Inline SVG untuk ArrowRight)
const ArrowRightIcon = {
  template: `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>`
};

// 3. Komponen Tombol Lokasi
const LocationButton = {
  props: {
    isSelected: {
      type: Boolean,
      default: false
    }
  },
  template: `
    <button
      :class="[
        'flex items-center justify-center w-24 h-10 px-4',
        'rounded-full shadow-lg cursor-pointer transition-all duration-200 ease-in-out',
        'text-sm font-semibold',
        isSelected 
          ? 'bg-blue-600 text-white shadow-blue-500/50' 
          : 'bg-white/10 text-gray-800 backdrop-blur-sm border border-gray-300 hover:bg-gray-100'
      ]"
    >
      <slot></slot>
    </button>
  `
};

// 4. Komponen Tombol Panah
const ArrowButton = {
  template: `
    <button
      class="
        flex items-center justify-center w-10 h-10 rounded-full 
        bg-gray-100/70 border border-gray-200 shadow-md 
        hover:bg-gray-200 transition-all duration-200
        text-gray-600
      "
    >
      <slot></slot>
    </button>
  `
};

// 5. Data Lokasi
const locations = ref(["Jakarta", "Bandung", "Bekasi", "Bogor", "Banten", "Surabaya"]);

</script>

<template>
  <div class="min-h-screen bg-gray-50 font-sans antialiased">
    <!-- HEADER SECTION -->
    <section class="bg-white text-center pt-24 pb-16">
      <div class="px-4 max-w-4xl mx-auto">
        <h2 class="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight">
          Lokasi Tempat Pemancingan
        </h2>
        <p class="mt-5 text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
          Jelajahi destinasi pemancingan terbaik di sekitar Anda. Temukan tempat favorit baru untuk petualangan memancing Anda selanjutnya, mulai dari kolam harian hingga galatama.
        </p>
      </div>

      <!-- LOCATION LIST -->
      <div class="mt-12 px-4">
        <!-- Menggunakan flex dan overflow-x-auto untuk responsivitas horizontal -->
        <ul class="flex items-center space-x-3 md:space-x-5 overflow-x-auto py-2 px-2 md:px-0 scrollbar-hide">
          
          <!-- Tombol Panah Kiri -->
          <li>
            <ArrowButton>
              <ArrowLeftIcon />
            </ArrowButton>
          </li>

          <!-- Tombol Lokasi (v-for) -->
          <li v-for="(location, index) in locations" :key="location" class="flex-shrink-0">
            <LocationButton :is-selected="index === 0">
              {{ location }}
            </LocationButton>
          </li>
          
          <!-- Tombol Panah Kanan -->
          <li>
            <ArrowButton>
              <ArrowRightIcon />
            </ArrowButton>
          </li>
        </ul>
      </div>

      <!-- IMAGE PREVIEW AND CTA -->
      <div class="flex flex-col items-center mt-10 mx-auto p-4">
        <img 
          src="./assets/preview.png" 
          alt="Preview Pemancingan" 
          class="w-full max-w-4xl h-72 object-cover rounded-t-2xl shadow-2xl transition duration-300 hover:shadow-3xl"
          @error="(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/800x400/9CA3AF/FFFFFF?text=Image+Not+Found'; }"
        />
        <button 
          class="w-full max-w-4xl py-4 bg-blue-600 text-white text-xl font-bold rounded-b-2xl 
                    hover:bg-blue-700 transition duration-300 ease-in-out shadow-xl hover:shadow-2xl 
                    tracking-wider uppercase"
        >
          Booking Sekarang
        </button>
      </div>
    </section>
  </div>
</template>

<style>
/* Custom CSS untuk menyembunyikan scrollbar horizontal di mobile (Digunakan oleh kelas .scrollbar-hide) */
.scrollbar-hide::-webkit-scrollbar {
    display: none;
}
.scrollbar-hide {
    -ms-overflow-style: none;  /* IE and Edge */
    scrollbar-width: none;  /* Firefox */
}
</style>
