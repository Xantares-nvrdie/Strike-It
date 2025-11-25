<script setup>
import { ref, computed, onMounted, onUnmounted } from "vue";
import { useRoute } from "vue-router";
import FilterSidebar from "@/components/Shop/FilterSidebar.vue";
import ProductList from "@/components/Shop/ProductList.vue";
import { Icon } from "@iconify/vue";
import api from "@/services/api.js";

// --- STATE DATA ---
const products = ref([]);
const isLoading = ref(true);

// Tambahan: Simpan filter yang aktif dari Sidebar
const activeFilters = ref({
  alat: [],
  status: null,
  harga: { min: null, max: null },
});

const route = useRoute();
const currentCategorySlug = computed(() => route.params.categorySlug);

// --- FETCH DATA ---
const fetchProducts = async (filters = {}) => {
  isLoading.value = true;
  try {
    const params = {};

    // REVISI: Jangan filter kategori 'alat' di sini agar data tidak terbatas cuma 1 kategori.
    // Kita biarkan semua kategori termuat (atau filter harga/status saja),
    // lalu kita filter kategori spesifiknya menggunakan Computed Property di bawah.

    if (filters.harga?.min) params.minPrice = filters.harga.min;
    if (filters.harga?.max) params.maxPrice = filters.harga.max;

    if (filters.status) {
      params.type = filters.status; // 'Sewa' atau 'Beli'
    }

    const res = await api.getProducts(params);
    products.value = res.data;
  } catch (error) {
    console.error("Gagal load produk:", error);
  } finally {
    isLoading.value = false;
  }
};

// --- HELPER: MAPPING NAMA KATEGORI ---
const getCategoryName = (p) => {
  if (p.category_name) return p.category_name;
  // Fallback manual jika backend belum join table category
  if (p.id_category == 1) return "Joran";
  if (p.id_category == 2) return "Reel";
  if (p.id_category == 3) return "Umpan";
  if (p.id_category == 4) return "Kail";
  if (p.id_category == 5) return "Senar";
  return "Lainnya";
};

// --- LOGIKA FILTER CLIENT-SIDE (UTAMA) ---
const filteredProductsList = computed(() => {
  let result = products.value;

  // 1. Filter Kategori (Multiple Select)
  // Jika user memilih alat di sidebar, kita cek apakah produk ini termasuk di dalamnya
  if (activeFilters.value.alat && activeFilters.value.alat.length > 0) {
    result = result.filter((p) => {
      const catName = getCategoryName(p);
      // Cek apakah nama kategori produk ini ADA di dalam array pilihan user
      return activeFilters.value.alat.includes(catName);
    });
  }

  return result;
});

// --- LOGIKA GROUPING OTOMATIS ---
const groupedProducts = computed(() => {
  const groups = {};

  // REVISI: Gunakan 'filteredProductsList' bukan raw 'products'
  // Agar hasil grouping mengikuti filter sidebar
  filteredProductsList.value.forEach((p) => {
    const catName = getCategoryName(p);

    if (!groups[catName]) {
      groups[catName] = [];
    }
    groups[catName].push(p);
  });

  return groups;
});

// --- FILTER HALAMAN KATEGORI (DETAIL VIEW / URL) ---
const categoryFilteredProducts = computed(() => {
  if (!currentCategorySlug.value) return [];
  const slug = currentCategorySlug.value.toLowerCase();

  // Gunakan filteredProductsList juga agar filter sidebar (harga/status) tetap jalan di halaman detail
  return filteredProductsList.value.filter((p) => {
    const catName = getCategoryName(p);
    return (
      (catName && catName.toLowerCase() === slug) ||
      p.name.toLowerCase().includes(slug)
    );
  });
});

const pageTitle = computed(() => {
  if (!currentCategorySlug.value) return "Toko Strike It!";
  return (
    "Kategori: " +
    currentCategorySlug.value.charAt(0).toUpperCase() +
    currentCategorySlug.value.slice(1)
  );
});

// --- UI UTILS ---
const isFilterVisible = ref(false);
const showScrollToTop = ref(false);

const handleScroll = () => (showScrollToTop.value = window.scrollY > 200);
const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

const handleFilter = (filterData) => {
  // 1. Simpan state filter untuk Logic Computed
  activeFilters.value = filterData;

  // 2. Fetch ulang ke server (untuk filter Harga & Status)
  // Note: Kategori (alat) akan dihandle otomatis oleh computed 'filteredProductsList' setelah data sampai
  fetchProducts(filterData);

  isFilterVisible.value = false;
};

onMounted(() => {
  fetchProducts();
  window.addEventListener("scroll", handleScroll);
});

onUnmounted(() => {
  window.removeEventListener("scroll", handleScroll);
});
</script>

<template>
  <div class="relative w-screen flex-col min-h-screen bg-zinc-100">
    <div
      class="w-full p-2.5 flex flex-col justify-start items-stretch gap-20 relative z-30"
    >
      <div
        class="self-stretch flex flex-col lg:flex-row justify-start items-start gap-2.5"
      >
        <FilterSidebar
          class="hidden lg:block w-full lg:w-80 flex-shrink-0 sticky top-32 z-20"
          @close="handleFilter"
        />

        <main
          class="flex-1 min-w-0 py-9 inline-flex flex-col justify-start items-center gap-2.5 w-full"
        >
          <h1 class="text-4xl font-medium text-black md:text-6xl text-center">
            {{ pageTitle }}
          </h1>
          <p
            v-if="!currentCategorySlug"
            class="max-w-2xl mx-auto mt-5 text-lg text-center leading-relaxed text-gray-600"
          >
            Jelajahi koleksi perlengkapan memancing terbaik kami.
          </p>

          <button
            @click="isFilterVisible = !isFilterVisible"
            class="lg:hidden w-full h-16 p-4 bg-white rounded-xl shadow-md flex items-center justify-between cursor-pointer hover:shadow-lg"
          >
            <span class="text-xl font-semibold text-gray-800"
              >Filter & Keranjang</span
            >
            <Icon
              :icon="
                isFilterVisible
                  ? 'heroicons:x-mark-20-solid'
                  : 'heroicons:adjustments-horizontal-20-solid'
              "
              class="w-6 h-6 text-gray-600"
            />
          </button>

          <aside
            class="lg:hidden transition-all duration-300 ease-out w-full"
            :class="
              isFilterVisible
                ? 'opacity-100 translate-y-0 max-h-screen'
                : 'opacity-0 -translate-y-4 max-h-0 overflow-hidden'
            "
          >
            <FilterSidebar class="my-4" @close="handleFilter" />
          </aside>

          <div
            v-if="isLoading"
            class="py-20 text-gray-500 flex flex-col items-center"
          >
            <div
              class="animate-spin rounded-full h-8 w-8 border-t-2 border-blue-600 mb-2"
            ></div>
            Memuat produk...
          </div>

          <div
            v-else-if="!currentCategorySlug"
            class="w-full flex flex-col gap-8"
          >
            <div
              v-for="(items, categoryName) in groupedProducts"
              :key="categoryName"
            >
              <ProductList
                v-if="items.length > 0"
                :title="categoryName"
                :products="items"
                :categorySlug="categoryName.toLowerCase()"
                displayMode="row"
              />
            </div>

            <div
              v-if="filteredProductsList.length === 0"
              class="text-center py-10 text-gray-400 bg-white rounded-xl w-full p-8"
            >
              <p class="text-lg font-semibold">Produk tidak ditemukan.</p>
              <p class="text-sm">Coba atur ulang filter Anda.</p>
            </div>
          </div>

          <div v-else class="w-full">
            <ProductList
              :title="pageTitle"
              :products="categoryFilteredProducts"
              :categorySlug="currentCategorySlug"
              displayMode="grid"
            />

            <div
              v-if="categoryFilteredProducts.length === 0"
              class="text-center py-10 text-gray-500"
            >
              Tidak ada produk di kategori ini dengan filter tersebut.
            </div>
          </div>
        </main>
      </div>
    </div>

    <transition name="fade">
      <button
        v-if="showScrollToTop"
        @click="scrollToTop"
        class="fixed bottom-6 right-6 lg:bottom-8 lg:right-8 p-3 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 z-50"
      >
        <Icon icon="heroicons:arrow-up-20-solid" class="w-6 h-6" />
      </button>
    </transition>
  </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
