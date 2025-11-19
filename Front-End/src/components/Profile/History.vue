<script setup>
import { ref } from "vue";
import HistoryCard from "@/components/Profile/HistoryCard.vue";
import HistoryFilter from "@/components/Profile/HistoryFilter.vue";
import { Icon } from "@iconify/vue";

const isFilterVisible = ref(false);

const historyItems = ref([
  {
    id: 1,
    title: "Sewa Tempat No. 5 - Pemancingan Lembah Hijau, Bandung",
    dateTime: "17 Sep 2025 11:21 WIB - 17 Sep 2025 13:21 WIB",
    price: "Rp. 30.000",
    status: "terbayar",
    statusText: "Terbayar",
    isRatingVisible: false,
    rating: 0,
    reviewText: "",
  },
  {
    id: 2,
    title: "Sewa Tempat No. 20 - Telaga Biru, Jakarta",
    dateTime: "21 Sep 2025 15:00 WIB - 21 Sep 2025 18:00 WIB",
    price: "Rp. 20.000",
    status: "terbayar",
    statusText: "Terbayar",
    isRatingVisible: false,
    rating: 0,
    reviewText: "",
  },
  {
    id: 3,
    title: "Sewa Tempat No. 8 - Tirta Kencana, Tanggerang",
    dateTime: "25 Sep 2025 11:21 WIB - 25 Sep 2025 13:21 WIB",
    price: "Rp. 40.000",
    status: "terbayar",
    statusText: "Terbayar",
    isRatingVisible: false,
    rating: 0,
    reviewText: "",
  },
  {
    id: 4,
    title: "Sewa Tempat No. 12 - Danau Indah, Bekasi",
    dateTime: "30 Sep 2025 09:00 WIB - 30 Sep 2025 12:00 WIB",
    price: "Rp. 25.000",
    status: "terbayar",
    statusText: "Terbayar",
    isRatingVisible: false,
    rating: 0,
    reviewText: "",
  },
  {
    id: 5,
    title: "Sewa Tempat No. 3 - Pemancingan Alam Asri, Depok",
    dateTime: "05 Oct 2025 14:00 WIB - 05 Oct 2025 17:00 WIB",
    price: "Rp. 35.000",
    status: "terbayar",
    statusText: "Terbayar",
    isRatingVisible: false,
    rating: 0,
    reviewText: "",
  },
  {
    id: 6,
    title: "Sewa Tempat No. 15 - Kolam Pancing Bahagia, Bogor",
    dateTime: "10 Oct 2025 10:00 WIB - 10 Oct 2025 13:00 WIB",
    price: "Rp. 28.000",
    status: "terbayar",
    statusText: "Terbayar",
    isRatingVisible: false,
    rating: 0,
    reviewText: "",
  },
  {
    id: 7,
    title: "Sewa Tempat No. 7 - Danau Serene, Cimahi",
    dateTime: "15 Oct 2025 13:00 WIB - 15 Oct 2025 16:00 WIB",
    price: "Rp. 32.000",
    status: "terbayar",
    statusText: "Terbayar",
    isRatingVisible: false,
    rating: 0,
    reviewText: "",
  },
  {
    id: 8,
    title: "Sewa Tempat No. 10 - Pemancingan Sari Rasa, Sukabumi",
    dateTime: "20 Oct 2025 08:00 WIB - 20 Oct 2025 11:00 WIB",
    price: "Rp. 22.000",
    status: "terbayar",
    statusText: "Terbayar",
    isRatingVisible: false,
    rating: 0,
    reviewText: "",
  },
]);

const toggleRating = (clickedItem) => {
  const newVisibility = !clickedItem.isRatingVisible;
  historyItems.value.forEach((item) => {
    item.isRatingVisible = false;
  });
  clickedItem.isRatingVisible = newVisibility;
};

const handleFiltersUpdate = (filters) => {
  console.log("Filter yang diterima dari komponen anak:", filters);

  if (window.innerWidth < 1024) {
    isFilterVisible.value = false;
  }
};
</script>

<template>
  <div
    class="w-full min-h-screen bg-gray-100 p-4 md:p-8 font-sans"
  >
    <header class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold text-gray-800">Riwayat Pesanan</h1>

      <button
        @click="isFilterVisible = !isFilterVisible"
        class="lg:hidden bg-white text-blue-600 p-2 border border-blue-600 rounded-full shadow-sm hover:bg-blue-50 flex items-center justify-center"
      >
        <Icon
          :icon="
            isFilterVisible ? 'ic:baseline-close' : 'ic:baseline-filter-list'
          "
          class="w-5 h-5"
        />
      </button>
    </header>

    <!-- 
      filter mobile
    -->
    <aside
      class="lg:hidden transition-all duration-300 ease-out"
      :class="
        isFilterVisible
          ? 'opacity-100 translate-y-0 max-h-screen'
          : 'opacity-0 -translate-y-4 max-h-0 overflow-hidden'
      "
    >
      <HistoryFilter class="mb-6" @apply-filters="handleFiltersUpdate" />
    </aside>

    <!-- 
        dekstop
    -->
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

      <aside class="hidden lg:block lg:col-span-1">
        <div class="sticky top-[88px]">
          <HistoryFilter @apply-filters="handleFiltersUpdate" />
        </div>
      </aside>
    </div>
  </div>
</template>
