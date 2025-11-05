<script setup>
import { ref } from 'vue';
import HistoryCard from '@/components/Profile/HistoryCard.vue';
// 1. Impor komponen filter baru Anda
import HistoryFilter from '@/components/Profile/HistoryFilter.vue'; // <-- Sesuaikan path

// --- Data & Logika Kartu
const historyItems = ref([
    {
        id: 1,
        title: 'Sewa Tempat No. 5 - Pemancingan Lembah Hijau, Bandung',
        dateTime: '17 Sep 2025 11:21 WIB - 17 Sep 2025 13:21 WIB',
        price: 'Rp. 30.000',
        status: 'terbayar',
        statusText: 'Terbayar',
        isRatingVisible: false,
        rating: 0,
        reviewText: ''
    },
    {
        id: 2,
        title: 'Sewa Tempat No. 20 - Telaga Biru, Jakarta',
        dateTime: '21 Sep 2025 15:00 WIB - 21 Sep 2025 18:00 WIB',
        price: 'Rp. 20.000',
        status: 'terbayar',
        statusText: 'Terbayar',
        isRatingVisible: false,
        rating: 0,
        reviewText: ''
    },
    {
        id: 3,
        title: 'Sewa Tempat No. 8 - Tirta Kencana, Tanggerang',
        dateTime: '25 Sep 2025 11:21 WIB - 25 Sep 2025 13:21 WIB',
        price: 'Rp. 40.000',
        status: 'terbayar',
        statusText: 'Terbayar',
        isRatingVisible: false,
        rating: 0,
        reviewText: ''
    },
]);

const toggleRating = (clickedItem) => {
    // Simpan status visibilitas baru dari item yang diklik
    const newVisibility = !clickedItem.isRatingVisible;
    
    // Tutup semua form rating (reset semua item)
    historyItems.value.forEach(item => {
        item.isRatingVisible = false;
    });
    
    // Buka HANYA item yang diklik (jika sebelumnya tertutup)
    clickedItem.isRatingVisible = newVisibility;
};

// 2. Buat fungsi untuk "menangkap" data filter
const handleFiltersUpdate = (filters) => {
    console.log("Filter yang diterima dari komponen anak:", filters);
  //
  // Di sinilah Anda akan menjalankan logika filter Anda
  // Misalnya:
  // 1. Memfilter array 'historyItems.value' berdasarkan 'filters.statuses'
  // 2. Melakukan panggilan API baru dengan 'filters' sebagai parameter
  //
};

</script>

<template>
    <div class="w-full h-screen overflow-y-auto bg-gray-100 p-8 font-sans">
            
        <header class="flex justify-between items-center mb-6">
        </header>

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        <main class="lg:col-span-2 flex flex-col gap-4">
            <HistoryCard
            v-for="item in historyItems"
            :key="item.id"
            :item="item" 
            @toggle-rating="toggleRating(item)"
            @submit-rating="toggleRating(item)"
            />
        </main>

        <aside class="lg:col-span-1">
            <HistoryFilter
            class="sticky top-8"
            @apply-filters="handleFiltersUpdate"
            />
        </aside>
        </div>

    </div>
</template>
