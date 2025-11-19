<script setup>
import { ref } from 'vue';

const events = ref([
  {
    id: 1,
    imageUrl: new URL('@/assets/eventimg/poster1.png', import.meta.url).href,
    alt: 'Lomba Mancing Bakti Forkabi Untuk Negeri'
  },
  {
    id: 2,
    imageUrl: new URL('@/assets/eventimg/poster2.png', import.meta.url).href,
    alt: 'Lomba Mancing HUT RI Ke-74 Warga Garon'
  },
  {
    id: 3,
    imageUrl: new URL('@/assets/eventimg/poster3.png', import.meta.url).href,
    alt: 'Lomba Mancing Karang Taruna Taanimulya'
  }
]);

// Fungsi ini akan dipanggil saat tombol di-klik
const viewAllEvents = () => {
    console.log('Tombol "Lihat Semua Event" di-klik!');
}

// --- LOGIKA KARUSEL DITAMBAHKAN ---

// 1. State untuk melacak kartu aktif dan swipe
const activeIndex = ref(1);
const touchStartX = ref(0);
const touchStartY = ref(0);

function handleTouchStart(e) {
  touchStartX.value = e.touches[0].clientX;
  touchStartY.value = e.touches[0].clientY;
}

function handleTouchEnd(e) {
  const finalX = e.changedTouches[0].clientX;
  const finalY = e.changedTouches[0].clientY;

  const diffX = finalX - touchStartX.value;
  const diffY = finalY - touchStartY.value;

  // Abaikan jika swipe lebih dominan vertikal (untuk scrolling)
  if (Math.abs(diffY) > Math.abs(diffX)) {
    return;
  }

  const threshold = 50; // Jarak minimum swipe
  const totalEvents = events.value.length; // Diadaptasi untuk 'events'
  const currentTabIndex = activeIndex.value;

  if (Math.abs(diffX) > threshold) {
    if (diffX < 0) {
      // Swipe ke kiri (next)
      const nextIndex = (currentTabIndex + 1) % totalEvents;
      activeIndex.value = nextIndex;
    } else {
      // Swipe ke kanan (previous)
      const prevIndex = (currentTabIndex - 1 + totalEvents) % totalEvents;
      activeIndex.value = prevIndex;
    }
  }
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
            
            <!-- 2. SLIDER UNTUK MOBILE (md:hidden) -->
            <div class="md:hidden mt-12">
              <!-- Wrapper untuk menyembunyikan overflow -->
              <div class="overflow-hidden">
                <!-- Container yang bergerak (transform) -->
                <div
                  class="flex transition-transform duration-300 ease-in-out"
                  :style="{ transform: `translateX(-${activeIndex * 100}%)` }"
                  @touchstart="handleTouchStart"
                  @touchend="handleTouchEnd"
                >
                  <!-- Loop melalui event -->
                  <div
                    v-for="event in events"
                    :key="event.id"
                    class="w-full flex-shrink-0 flex justify-center p-4"
                  >
                    <!-- Kartu Event (diberi max-w-sm agar terpusat) -->
                    <div
                      class="overflow-hidden transition duration-300 transform bg-white rounded-xl shadow-lg hover:shadow-2xl hover:-translate-y-1 w-full max-w-sm"
                    >
                      <img 
                        :src="event.imageUrl" 
                        :alt="event.alt" 
                        class="object-cover w-full h-auto aspect-[3/4]"
                        @error="(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/600x800/9CA3AF/FFFFFF?text=Poster+Not+Found'; }"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <!-- Pagination Dots -->
              <div class="flex justify-center gap-2 py-4 mt-4">
                <button
                  v-for="(event, index) in events"
                  :key="index"
                  @click="activeIndex = index"
                  :class="
                    activeIndex === index ? 'bg-blue-600' : 'bg-gray-300'
                  "
                  class="size-3 rounded-full transition-colors"
                  :aria-label="`Go to event ${index + 1}`"
                ></button>
              </div>
            </div>

            <!-- 3. GRID UNTUK DESKTOP (hidden md:grid) -->
            <div class="hidden md:grid grid-cols-1 gap-8 md:grid-cols-3 mt-12">
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
            <router-link to="/event">
                <button 
                    @click="viewAllEvents"
                    class="px-10 py-4 text-sm font-bold tracking-wider text-white uppercase transition duration-300 ease-in-out bg-blue-600 rounded-full shadow-lg hover:bg-blue-700 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                >
                    Lihat Semua Event dan Perlombaan
                </button>
            </router-link>
            </div>
            
        </div>
        </section>
        
    </div>
</template>

<style>
@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300..900&display=swap');

body {
    font-family: 'Outfit', sans-serif;
}
</style>
