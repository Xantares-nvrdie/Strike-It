<script setup>
import { ref, onMounted } from "vue";
import HistoryCard from "@/components/Profile/HistoryCard.vue";
import HistoryFilter from "@/components/Profile/HistoryFilter.vue";
import { Icon } from "@iconify/vue";
import api from "@/services/api.js";
import { useToast } from "vue-toastification"; // 1. Import Toast

// Inisialisasi Toast
const toast = useToast();

const isFilterVisible = ref(false);
const historyItems = ref([]);    
const allHistoryItems = ref([]); 

// Helpers Formatter
const formatRupiah = (price) => {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(price).replace('IDR', 'Rp.');
};

const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('id-ID', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }).format(date);
};

const mapStatus = (item) => {
  if (item.status === 'cancelled') return { id: 'dibatalkan', text: 'Dibatalkan' };
  if (item.payment_status === 'paid' || item.status === 'completed') return { id: 'terbayar', text: 'Terbayar' };
  return { id: 'belum_dibayar', text: 'Belum Dibayar' };
};

// --- FETCH DATA ---
const fetchHistory = async () => {
  try {
    const response = await api.getMyBookings();
    
    const mappedData = response.data.map(item => {
      const statusInfo = mapStatus(item);
      return {
        // ... data lain sama ...
        id: item.id,
        locationId: item.id_location,
        title: `Sewa Tempat No. ${item.spot_number} - ${item.location_name}`,
        dateTime: formatDate(item.booking_start),
        rawDate: item.booking_start,
        price: formatRupiah(item.total_price),
        status: statusInfo.id, 
        statusText: statusInfo.text,
        
        // BARU: Tangkap status review dari backend
        // Backend kirim 1 atau 0, kita ubah jadi Boolean (true/false)
        hasReviewed: Boolean(item.is_reviewed), 
        
        isRatingVisible: false,
        rating: 0,
        reviewText: "",
      };
    });

    allHistoryItems.value = mappedData;
    historyItems.value = mappedData;
  } catch (error) {
    // ... error handling
  }
};

// UPDATE SUBMIT RATING
const handleSubmitRating = async (item) => {
    if (item.rating === 0) {
        toast.warning("Mohon pilih bintang dulu");
        return;
    }

    try {
        const payload = {
            id_booking: item.id,
            id_location: item.locationId, 
            rating: item.rating,
            comment: item.reviewText
        };

        await api.createReview(payload);
        toast.success("Ulasan berhasil dikirim!");
        
        // LOGIKA BARU:
        // 1. Tutup form
        item.isRatingVisible = false;
        // 2. Tandai item ini sudah direview agar tombol berubah jadi "Selesai"
        item.hasReviewed = true; 

    } catch (error) {
        const msg = error.response?.data?.message || "Gagal kirim ulasan";
        toast.error(msg);
    }
};

// --- LOGIKA UI LAINNYA ---
const toggleRating = (clickedItem) => {
    // Cek apakah status completed/terbayar sebelum buka form rating?
    if (clickedItem.status !== 'terbayar') {
        toast.warning("Anda hanya bisa mengulas pesanan yang sudah selesai/terbayar.");
        return;
    }

    const newVisibility = !clickedItem.isRatingVisible;
    historyItems.value.forEach(item => item.isRatingVisible = false);
    clickedItem.isRatingVisible = newVisibility;
};

const handleFiltersUpdate = (filters) => {
  let result = allHistoryItems.value;

  if (filters.statuses && filters.statuses.length > 0) {
    result = result.filter(item => filters.statuses.includes(item.status));
  }

  if (filters.startDate && filters.endDate) {
    const start = new Date(filters.startDate).setHours(0,0,0,0);
    const end = new Date(filters.endDate).setHours(23,59,59,999);
    result = result.filter(item => {
      const itemTime = new Date(item.rawDate).getTime();
      return itemTime >= start && itemTime <= end;
    });
  } else if (filters.time) {
    const now = new Date();
    if (filters.time === 'hari_ini') {
      result = result.filter(item => new Date(item.rawDate).toDateString() === now.toDateString());
    } else if (filters.time === 'minggu_ini') {
      const oneWeekAgo = new Date(now);
      oneWeekAgo.setDate(now.getDate() - 7);
      result = result.filter(item => new Date(item.rawDate) >= oneWeekAgo);
    } else if (filters.time === 'bulan_ini') {
      result = result.filter(item => {
          const d = new Date(item.rawDate);
          return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
      });
    }
  }
  historyItems.value = result;
  if (window.innerWidth < 1024) isFilterVisible.value = false;
};

onMounted(() => {
  fetchHistory();
});
</script>

<template>
  <div class="w-full min-h-screen bg-gray-100 p-4 md:p-8 font-sans">
    <header class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold text-gray-800">Riwayat Pesanan</h1>
      <button @click="isFilterVisible = !isFilterVisible" class="lg:hidden bg-white text-blue-600 p-2 border border-blue-600 rounded-full shadow-sm">
        <Icon :icon="isFilterVisible ? 'ic:baseline-close' : 'ic:baseline-filter-list'" class="w-5 h-5" />
      </button>
    </header>

    <aside class="lg:hidden transition-all duration-300 ease-out" 
          :class="isFilterVisible ? 'opacity-100 translate-y-0 max-h-screen' : 'opacity-0 -translate-y-4 max-h-0 overflow-hidden'">
      <HistoryFilter class="mb-6" @apply-filters="handleFiltersUpdate" />
    </aside>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <main class="lg:col-span-2 flex flex-col gap-4">
        <div v-if="historyItems.length === 0" class="p-8 text-center bg-white rounded-xl shadow">
              <p class="text-gray-500">Tidak ada pesanan yang ditemukan.</p>
        </div>

        <HistoryCard
          v-for="item in historyItems"
          :key="item.id"
          :item="item"
          @toggle-rating="toggleRating(item)"
          @submit-rating="handleSubmitRating(item)"
        />
      </main>

      <aside class="hidden lg:block lg:col-span-1">
        <div class="sticky top-[88px]">
          <HistoryFilter @apply-filters="handleFiltersUpdate" />
        </div>
      </aside>
    </div>
  </div>
</template>
