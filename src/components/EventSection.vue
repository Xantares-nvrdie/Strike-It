<script setup>
import { ref } from 'vue';

// --- DATA UNTUK POSTER ---
// Ganti URL ini dengan path ke gambar poster Anda di dalam folder /assets/
const events = ref([
    {
        id: 1,
        imageUrl: '../assets/lomba-poster-1.png', // Ganti dengan path Anda
        alt: 'Lomba Mancing Bakti Forkabi Untuk Negeri'
    },
    {
        id: 2,
        imageUrl: '../assets/lomba-poster-2.png', // Ganti dengan path Anda
        alt: 'Lomba Mancing HUT RI Ke-74 Warga Garon'
    },
    {
        id: 3,
        imageUrl: '../assets/lomba-poster-3.png', // Ganti dengan path Anda
        alt: 'Lomba Mancing Karang Taruna Tanimulya'
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
            <h2 class="text-4xl font-bold text-gray-900 md:text-5xl">
                Event & Perlombaan
            </h2>
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