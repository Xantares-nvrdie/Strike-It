<script setup>
import { ref, computed } from 'vue';
import ReviewCard from './ReviewCard.vue'; // <-- Impor komponen kartu

// Data Dummy untuk Ulasan (Sama seperti sebelumnya)
const reviews = ref([
  { id: 1, author: 'Jayesh Patil', title: 'CEO, Lironte', avatar: 'https://placehold.co/40x40/FF7F50/FFFFFF/png?text=JP', rating: 5, content: 'Layanan yang luar biasa! Tim mereka sangat profesional dan responsif. Benar-benar melampaui ekspektasi kami.' },
  { id: 2, author: 'Ullamcorper Leo', title: 'Marketing, AquaLink', avatar: 'https://placehold.co/40x40/6495ED/FFFFFF/png?text=UL', rating: 4, content: 'Pengalaman yang baik secara keseluruhan. Tempatnya strategis dan ikannya banyak. Mungkin area parkir bisa diperluas sedikit.' },
  { id: 3, author: 'Dina Sari', title: 'Manager, FishCo', avatar: 'https://placehold.co/40x40/90EE90/FFFFFF/png?text=DS', rating: 5, content: 'Sangat direkomendasikan! Fasilitasnya bersih dan terawat dengan baik. Stafnya juga sangat ramah dan membantu.' },
  { id: 4, author: 'Arif Hidayat', title: 'Owner, FishFarm', avatar: 'https://placehold.co/40x40/FFD700/FFFFFF/png?text=AH', rating: 4, content: 'Spot yang bagus. Ikannya narik terus. Sayang kemarin pas ke sana lagi ramai banget, jadi kurang nyaman. Tapi tetap oke.' },
  { id: 5, author: 'Dewi Lestari', title: 'Fisherman, Local', avatar: 'https://placehold.co/40x40/DA70D6/FFFFFF/png?text=DL', rating: 5, content: 'Sebagai pemancing lokal, saya akui ini salah satu tempat terbaik. Airnya bersih dan ikannya sehat-sehat. Selalu puas mancing di sini.' },
  { id: 6, author: 'Budi Santoso', title: 'CEO, MitraLaut', avatar: 'https://placehold.co/40x40/ADD8E6/FFFFFF/png?text=BS', rating: 3, content: 'Tempatnya cukup oke untuk mancing santai. Ikannya ada, walaupun ukurannya tidak terlalu besar. Pengalaman standar, tidak ada yang spesial tapi juga tidak mengecewakan.' },
  { id: 7, author: 'Citra Kirana', title: 'Fisherwoman, Pro', avatar: 'https://placehold.co/40x40/F08080/FFFFFF/png?text=CK', rating: 5, content: 'Spot favorit! Selalu dapat tarikan babon di sini. Suasananya tenang dan sangat terawat. Sempurna untuk profesional.' },
  { id: 8, author: 'Dimas Aditama', title: 'Enthusiast', avatar: 'https://placehold.co/40x40/20B2AA/FFFFFF/png?text=DA', rating: 2, content: 'Sayang sekali, pengalaman saya kurang memuaskan. Tempatnya perlu lebih dirawat kebersihannya. Saya juga sedang kurang beruntung, 3 jam belum ada tarikan. Semoga ke depannya bisa lebih baik.' },
  { id: 9, author: 'Dimas Aditama', title: 'Enthusiast', avatar: 'https://placehold.co/40x40/20B2AA/FFFFFF/png?text=DA', rating: 2, content: 'Ada beberapa hal yang bisa ditingkatkan. Harga tiketnya terasa agak mahal untuk fasilitas yang didapat. Ikannya juga agak sulit dipancing hari itu. Potensinya ada, semoga bisa lebih baik.' },
  { id: 10, author: 'Dimas asdkjasbd', title: 'Enthusiast', avatar: 'https://placehold.co/40x40/20B2AA/FFFFFF/png?text=DA', rating: 4, content: 'Lumayan buat pemula. Tempatnya gampang diakses. Banyak ikan kecil, jadi seru buat belajar. Mungkin saungnya perlu ditambah.' },
  { id: 11, author: 'Asep Aditama', title: 'Enthusiast', avatar: 'https://placehold.co/40x40/20B2AA/FFFFFF/png?text=DA', rating: 2, content: 'Pelayanannya perlu ditingkatkan agar lebih ramah. Foto di iklan terlihat lebih bagus dari kenyataannya. Semoga ada perbaikan.' },
  { id: 12, author: 'Jamal Aditama', title: 'Enthusiast', avatar: 'https://placehold.co/40x40/20B2AA/FFFFFF/png?text=DA', rating: 3, content: 'Lokasinya sebenarnya bagus dan strategis. Sayang sekali kurang terawat, ada sampah di beberapa titik. Kalau dirapikan dan peraturannya diperjelas, pasti jadi spot yang bagus.' },
  { id: 13, author: 'Azka Aditama', title: 'Enthusiast', avatar: 'https://placehold.co/40x40/20B2AA/FFFFFF/png?text=DA', rating: 4, content: 'Tempatnya oke, fasilitas toilet dan mushola bersih. Ikannya lumayan, tapi agak susah dapet yang besar. Cocok buat santai.' },
]);

// Pisahkan ulasan menjadi 3 kolom secara otomatis
const column1Reviews = computed(() => reviews.value.filter((_, i) => i % 3 === 0));
const column2Reviews = computed(() => reviews.value.filter((_, i) => i % 3 === 1));
const column3Reviews = computed(() => reviews.value.filter((_, i) => i % 3 === 2));
</script>

<template>
  <div id="penilaian" class="relative w-full overflow-hidden antialiased bg-gray-50 font-outfit">
    
    <div 
      class="absolute top-0 left-0 z-10 w-full h-48 pointer-events-none bg-gradient-to-b from-gray-50 via-gray-50 to-transparent"
    ></div>
    
    <div class="relative z-20 py-20 text-center">
      <h2 class="text-4xl font-medium text-black md:text-6xl">Penilaian</h2>
      <p class="max-w-xl mx-auto mt-5 text-base leading-relaxed text-gray-600">
        Terima kasih atas ulasan positif dari para pengguna setia Strike It!
      </p>
    </div>

    <div class="relative w-full max-w-7xl mx-auto h-[50rem] overflow-hidden">
      <div class="absolute inset-0 grid grid-cols-1 gap-6 px-6 md:grid-cols-3">
        
        <div class="flex flex-col gap-6 animate-scroll-down"> <ReviewCard v-for="review in column1Reviews" :key="review.id" :review="review" />
          <ReviewCard v-for="review in column1Reviews" :key="`${review.id}-dup`" :review="review" />
        </div>
        
        <div class="flex flex-col gap-6 animate-scroll-up"> <ReviewCard v-for="review in column2Reviews" :key="review.id" :review="review" />
          <ReviewCard v-for="review in column2Reviews" :key="`${review.id}-dup`" :review="review" />
        </div>
        
        <div class="flex flex-col gap-6 animate-scroll-down"> <ReviewCard v-for="review in column3Reviews" :key="review.id" :review="review" />
          <ReviewCard v-for="review in column3Reviews" :key="`${review.id}-dup`" :review="review" />
        </div>

      </div>
    </div>
    
    <div 
      class="absolute bottom-0 left-0 z-10 w-full h-48 pointer-events-none bg-gradient-to-t from-blue-700 to-transparent"
    ></div>
    
  </div>
</template>

<style scoped>
/* 1. KEYFRAME UNTUK NAIK (scroll-up) */
@keyframes scroll-up {
  from {
    transform: translateY(0);
  }
  to {
    transform: translateY(-50%); /* Bergerak ke -50% (akhir set pertama) */
  }
}

/* 2. KEYFRAME BARU UNTUK TURUN (scroll-down) */
@keyframes scroll-down {
  from {
    transform: translateY(-50%); /* Mulai dari -50% (awal set kedua) */
  }
  to {
    transform: translateY(0); /* Bergerak ke 0 (awal set pertama) */
  }
}

/* 3. KELAS ANIMASI (Kecepatan sama: 45s) */
.animate-scroll-up {
  animation: scroll-up 45s linear infinite;
}

.animate-scroll-down {
  animation: scroll-down 45s linear infinite;
}

/* 4. EFEK HOVER UNTUK MEMPERLAMBAT (JADI PAUSE) */
/* Saat kolom (atau kartu di dalamnya) di-hover, 
  animasi akan "paused", yang sesuai dengan "aga ngelambat".
*/
.animate-scroll-up:hover,
.animate-scroll-down:hover {
  animation-play-state: paused;
}
</style>
