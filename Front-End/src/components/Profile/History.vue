<script setup>
import { ref, onMounted } from "vue";
import HistoryCard from "@/components/Profile/HistoryCard.vue";
import HistoryFilter from "@/components/Profile/HistoryFilter.vue";
import { Icon } from "@iconify/vue";
import api from "@/services/api.js";
import { useToast } from "vue-toastification";

const toast = useToast();
const isFilterVisible = ref(false);
const historyItems = ref([]);    
const allHistoryItems = ref([]); 

// Helper Formatter
const formatRupiah = (price) => {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(price).replace('IDR', 'Rp.');
};

const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('id-ID', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }).format(date);
};

// Mapping Status
const mapStatus = (item) => {
    // A. Booking (Sewa)
    if (item.spot_number) { 
        if (item.status === 'cancelled') return { id: 'dibatalkan', text: 'Dibatalkan', class: 'text-red-600 bg-red-50' };
        if (item.payment_status === 'paid') return { id: 'terbayar', text: 'Sewa Selesai', class: 'text-green-600 bg-green-50' };
        return { id: 'belum_dibayar', text: 'Belum Bayar', class: 'text-yellow-600 bg-yellow-50' };
    }
    // B. Order (Belanja)
    switch (item.status) {
        case 'pending': return { id: 'belum_dibayar', text: 'Menunggu Pembayaran', class: 'text-yellow-600 bg-yellow-50' };
        case 'processing': return { id: 'diproses', text: 'Sedang Dikemas', class: 'text-blue-600 bg-blue-50' };
        case 'shipped': return { id: 'dikirim', text: 'Dalam Pengiriman', class: 'text-orange-600 bg-orange-50' };
        case 'delivered': return { id: 'terbayar', text: 'Pesanan Diterima', class: 'text-green-600 bg-green-50' };
        case 'cancelled': return { id: 'dibatalkan', text: 'Dibatalkan', class: 'text-red-600 bg-red-50' };
        default: return { id: 'unknown', text: item.status, class: 'text-gray-500 bg-gray-50' };
    }
};

const fetchHistory = async () => {
  try {
    const [bookingRes, orderRes] = await Promise.all([
        api.getMyBookings(), 
        api.getMyOrders()    
    ]);

    // 1. Booking
    const bookings = bookingRes.data.map(item => {
      const statusInfo = mapStatus(item);
      return {
        id: `BOOK-${item.id}`, 
        originalId: item.id,
        type: 'booking',       
        title: `Sewa Tempat: ${item.location_name} (Spot ${item.spot_number})`,
        dateTime: formatDate(item.booking_start),
        rawDate: new Date(item.booking_start),
        price: formatRupiah(item.total_price),
        status: statusInfo.id,
        statusText: statusInfo.text,
        statusClass: statusInfo.class,
        
        // Data Review Booking
        targetId: item.id_location, // Location ID
        hasReviewed: Boolean(item.is_reviewed),
        isRatingVisible: false,
        rating: 0,
        reviewText: "",
      };
    });

    // 2. Order
    const orders = orderRes.data.map(item => {
       const statusInfo = mapStatus(item);
       let title = item.first_product_name || 'Produk';
       if (item.total_items > 1) title += ` (+ ${item.total_items - 1} barang lainnya)`;

       return {
         id: `ORD-${item.id}`,
         originalId: item.id,
         type: 'order', 
         title: title,
         dateTime: formatDate(item.created_at),
         rawDate: new Date(item.created_at),
         price: formatRupiah(item.total_amount),
         status: statusInfo.id,
         statusText: statusInfo.text,
         statusClass: statusInfo.class,
         
         // Data Review Order
         targetId: item.first_product_id, // Product ID (untuk di-review)
         hasReviewed: item.review_count > 0, // Cek dari backend
         isRatingVisible: false,
         rating: 0,
         reviewText: ""
       };
    });

    const combined = [...bookings, ...orders].sort((a, b) => b.rawDate - a.rawDate);
    allHistoryItems.value = combined;
    historyItems.value = combined;

  } catch (error) {
    toast.error("Gagal memuat riwayat.");
  }
};

// --- LOGIC TOGGLE & SUBMIT (UPDATED) ---

const toggleRating = (clickedItem) => {
    // 1. Validasi Pembayaran
    if (clickedItem.status !== 'terbayar') { // Status 'terbayar' kita set untuk paid/completed/delivered
        toast.warning("Selesaikan transaksi untuk memberi ulasan.");
        return;
    }
    
    // 2. Validasi Sudah Review
    if (clickedItem.hasReviewed) return;

    // 3. Buka Form
    const newVisibility = !clickedItem.isRatingVisible;
    historyItems.value.forEach(item => item.isRatingVisible = false);
    clickedItem.isRatingVisible = newVisibility;
};

const handleSubmitRating = async (item) => {
    if (item.rating === 0) {
        toast.warning("Mohon pilih bintang dulu");
        return;
    }

    try {
        // JIKA BOOKING -> API Review Lokasi
        if (item.type === 'booking') {
            await api.createReview({
                id_booking: item.originalId, 
                id_location: item.targetId, 
                rating: item.rating,
                comment: item.reviewText
            });
        } 
        // JIKA ORDER -> API Review Produk
        else if (item.type === 'order') {
            if (!item.targetId) {
                toast.error("Produk tidak ditemukan.");
                return;
            }
            // Panggil endpoint POST /products/:id/reviews
            await api.createProductReview(item.targetId, {
                rating: item.rating,
                comment: item.reviewText
            });
        }

        toast.success("Ulasan berhasil dikirim!");
        item.isRatingVisible = false;
        item.hasReviewed = true; 

    } catch (error) {
        toast.error(error.response?.data?.message || "Gagal kirim ulasan");
    }
};

const handleFiltersUpdate = (filters) => {
    let result = allHistoryItems.value;
    if (filters.statuses && filters.statuses.length > 0) {
        result = result.filter(item => filters.statuses.includes(item.status));
    }
    // ... date filter ...
    historyItems.value = result;
};

onMounted(() => { fetchHistory(); });
</script>

<template>
  <div class="w-full min-h-screen bg-gray-100 p-4 md:p-8 font-sans">
    <header class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold text-gray-800">Riwayat Pesanan</h1>
      <button @click="isFilterVisible = !isFilterVisible" class="lg:hidden bg-white text-blue-600 p-2 border border-blue-600 rounded-full shadow-sm">
        <Icon :icon="isFilterVisible ? 'ic:baseline-close' : 'ic:baseline-filter-list'" class="w-5 h-5" />
      </button>
    </header>

    <aside class="lg:hidden transition-all duration-300 ease-out" :class="isFilterVisible ? 'opacity-100 translate-y-0 max-h-screen' : 'opacity-0 -translate-y-4 max-h-0 overflow-hidden'">
      <HistoryFilter class="mb-6" @apply-filters="handleFiltersUpdate" />
    </aside>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <main class="lg:col-span-2 flex flex-col gap-4">
        <div v-if="historyItems.length === 0" class="p-8 text-center bg-white rounded-xl shadow">
             <p class="text-gray-500">Belum ada riwayat pesanan.</p>
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
