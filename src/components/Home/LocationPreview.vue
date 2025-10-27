<script setup>
import { ref } from 'vue';

const locations = ref(["Jakarta", "Bandung", "Bekasi", "Bogor", "Banten", "Surabaya"]);

const selectedIndex = ref(0);
const next = () => {
  // Gunakan operator modulo (%) untuk looping kembali ke 0 jika sudah di akhir
  selectedIndex.value = (selectedIndex.value + 1) % locations.value.length;
};

// Fungsi untuk tombol 'prev' (panah kiri)
const prev = () => {
  // Logika ini untuk looping kembali ke item terakhir jika sedang di 0
  selectedIndex.value = (selectedIndex.value - 1 + locations.value.length) % locations.value.length;
};
</script>

<template>
  <div class="min-h-screen antialiased bg-gray-50 font-outfit">
    <section class="pt-24 pb-16 text-center bg-white">
      <div class="max-w-4xl px-4 mx-auto">
        <h2 class="text-4xl font-medium text-black md:text-6xl">
          Lokasi Tempat Pemancingan
        </h2>
        <p class="max-w-2xl mx-auto mt-5 text-lg leading-relaxed text-gray-600">
          Jelajahi destinasi pemancingan terbaik di sekitar Anda. Temukan tempat favorit baru untuk petualangan memancing Anda selanjutnya, mulai dari kolam harian hingga galatama.
        </p>
      </div>

      <div class="px-4 mt-12">
        <ul class="flex items-center px-2 py-2 space-x-3 overflow-x-auto md:space-x-5 md:px-0 scrollbar-hide justify-center">
          
          <li>
            <button
              @click="prev" class="flex items-center justify-center w-10 h-10 text-gray-600 transition-all duration-200 border border-gray-200 rounded-full shadow-md bg-gray-100/70 hover:bg-gray-200"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg>
            </button>
          </li>

          <li v-for="(location, index) in locations" :key="location" class="flex-shrink-0">
            <button
              @click="selectedIndex = index" :class="[
                'flex items-center justify-center w-24 h-10 px-4',
                'rounded-full shadow-lg cursor-pointer transition-all duration-200 ease-in-out',
                'text-sm font-semibold',

                index === selectedIndex 
                  ? 'bg-blue-600 text-white shadow-blue-500/50' 
                  : 'bg-white/10 text-gray-800 backdrop-blur-sm border border-gray-300 hover:bg-gray-100'
              ]"
            >
              {{ location }}
            </button>
          </li>
          
          <li>
            <button
              @click="next" class="flex items-center justify-center w-10 h-10 text-gray-600 transition-all duration-200 border border-gray-200 rounded-full shadow-md bg-gray-100/70 hover:bg-gray-200"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>
            </button>
          </li>
        </ul>
      </div>

      <div class="flex flex-col items-center p-4 mx-auto mt-10">
        <img 
          src="../../assets/preview.png" 
          alt="Preview Pemancingan" 
          class="object-cover w-full max-w-4xl transition duration-300 shadow-2xl h-72 rounded-t-2xl hover:shadow-3xl"
          @error="(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/800x400/9CA3AF/FFFFFF?text=Image+Not+Found'; }"
        />
        <button 
          class="w-full max-w-4xl py-4 text-xl font-bold tracking-wider text-white uppercase transition duration-300 ease-in-out bg-blue-600 shadow-xl font-outfit rounded-b-2xl hover:bg-blue-700 hover:shadow-2xl"
        >
          Booking Sekarang
        </button>
      </div>
    </section>
  </div>
</template>

<style>
@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300..900&display=swap');

body {
  font-family: 'Outfit', sans-serif;
}
/* Custom CSS untuk menyembunyikan scrollbar horizontal di mobile (Digunakan oleh kelas .scrollbar-hide) */
.scrollbar-hide::-webkit-scrollbar {
    display: none;
}
.scrollbar-hide {
    -ms-overflow-style: none;  /* IE and Edge */
    scrollbar-width: none;  /* Firefox */
}
</style>