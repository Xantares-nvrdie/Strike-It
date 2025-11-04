<script setup>
import { ref } from 'vue';

// --- DATA UNTUK POSTER ---
// Ganti URL ini dengan path ke gambar poster Anda di dalam folder /assets/
const events = ref([
  {
    id: 1,
    imageUrl: new URL('@/assets/poster1.png', import.meta.url).href,
    alt: 'Lomba Mancing Bakti Forkabi Untuk Negeri'
  },
  {
    id: 2,
    imageUrl: new URL('@/assets/poster2.png', import.meta.url).href,
    alt: 'Lomba Mancing HUT RI Ke-74 Warga Garon'
  },
  {
    id: 3,
    imageUrl: new URL('@/assets/poster3.png', import.meta.url).href,
    alt: 'Lomba Mancing Karang Taruna Taanimulya'
  }
]);


// Fungsi ini akan dipanggil saat tombol di-klik
const viewAllEvents = () => {
    console.log('Tombol "Lihat Semua Event" di-klik!');
  // Di aplikasi nyata, Anda mungkin akan menggunakan Vue Router di sini
  // untuk pindah halaman.
  // Contoh: router.push('/semua-event')
}
</script>

<template>
    <div class="antialiased bg-gray-50 font-outfit">
        
        <section class="py-20">
        <div class="max-w-6xl px-4 mx-auto sm:px-6 lg:px-8">
            
            <div class="mb-16 text-center">
            <h2 class="text-4xl font-medium text-black md:text-6xl">    
                Event & Perlombaan
            </h2>
            <p class="max-w-2xl mx-auto mt-5 text-lg leading-relaxed text-gray-600">
              Berbagai lomba dan event memancing seru dengan hadiah menarik menantimu!
            </p>
            </div>
            
            <div class="grid grid-cols-1 gap-8 md:grid-cols-3">
            
            <div 
                v-for="event in events" 
                :key="event.id"
                class="overflow-hidden transition duration-300 transform bg-white rounded-xl shadow-lg hover:shadow-2xl hover:-translate-y-1"
            >
                <img 
                :src="event.imageUrl" 
                :alt="event.alt" 
                class="object-cover w-full h-auto aspect-[3/4]"
                
                @error="(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/600x800/9CA3AF/FFFFFF?text=Poster+Not+Found'; }"
                />
            </div>
            
            </div>
            
            <div class="mt-16 text-center">
            <button 
                @click="viewAllEvents"
                class="px-10 py-4 text-sm font-bold tracking-wider text-white uppercase transition duration-300 ease-in-out bg-blue-600 rounded-full shadow-lg hover:bg-blue-700 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
            >
                Lihat Semua Event dan Perlombaan
            </button>
            </div>
            
        </div>
        </section>
        
    </div>
</template>

<style>
/* Catatan: Anda mungkin sudah mengimpor font 'Outfit' ini di file CSS global 
(seperti main.css atau App.vue). Jika ya, Anda tidak perlu 
mengimpornya lagi di sini.
*/
@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300..900&display=swap');

/* Pastikan body menggunakan font ini jika ini adalah page utama */
body {
    font-family: 'Outfit', sans-serif;
}
</style>
