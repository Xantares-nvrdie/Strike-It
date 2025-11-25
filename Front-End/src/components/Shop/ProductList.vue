<script setup>
import ProductCard from "./ProductCard.vue";
import { RouterLink } from "vue-router";
import { Icon } from "@iconify/vue";
import { computed, ref, watch } from "vue";

const props = defineProps({
  title: String,
  products: Array,
  displayMode: {
    type: String,
    default: "grid", // 'grid' (Pagination) atau 'row' (Limit 4)
  },
  categorySlug: {
    type: String,
    default: "",
  },
});

// --- PAGINATION STATE ---
const currentPage = ref(1);
const productsPerPage = 8;

// Reset halaman ke 1 jika kategori berubah (misal dari Joran ke Reel)
watch(
  () => props.categorySlug,
  () => {
    currentPage.value = 1;
  },
);

// Total Halaman
const totalPages = computed(() => {
  return Math.ceil(props.products.length / productsPerPage);
});

// Data untuk Mode GRID (Dipaginasi)
const gridProducts = computed(() => {
  const startIndex = (currentPage.value - 1) * productsPerPage;
  const endIndex = startIndex + productsPerPage;
  return props.products.slice(startIndex, endIndex);
});

// Data untuk Mode ROW (Hanya 4 item pertama)
const rowProducts = computed(() => {
  return props.products.slice(0, 4);
});

// Navigasi Halaman
function nextPage() {
  if (currentPage.value < totalPages.value) currentPage.value++;
}
function prevPage() {
  if (currentPage.value > 1) currentPage.value--;
}
function goToPage(n) {
  currentPage.value = n;
}
</script>

<template>
  <section
    class="w-full p-3 sm:p-5 bg-linear-131 mt-5 from-white/20 to-gray-50/20 rounded-[37px] shadow-lg outline outline-[2.5px] outline-white backdrop-blur-sm flex flex-col gap-4"
  >
    <div class="flex items-center justify-between w-full">
      <h2 class="text-stone-800 text-2xl font-bold font-outfit capitalize">
        {{ title }}
      </h2>

      <RouterLink
        v-if="displayMode === 'row'"
        :to="`/shop/category/${categorySlug}`"
        class="flex items-center gap-2 px-3 py-1.5 bg-white rounded-lg shadow-sm text-stone-800 text-xs font-semibold uppercase transition hover:bg-gray-100 hover:shadow-md group"
      >
        Lihat Semua
        <Icon
          icon="heroicons:arrow-right-20-solid"
          class="w-4 h-4 transition-transform group-hover:translate-x-0.5"
        />
      </RouterLink>

      <RouterLink
        v-else-if="displayMode === 'grid' && categorySlug"
        to="/shop"
        class="flex items-center gap-2 px-3 py-1.5 bg-white rounded-lg shadow-sm text-stone-800 text-xs font-semibold uppercase transition hover:bg-gray-100 hover:shadow-md group"
      >
        <Icon
          icon="heroicons:arrow-left-20-solid"
          class="w-4 h-4 transition-transform group-hover:-translate-x-0.5"
        />
        Kembali
      </RouterLink>
    </div>

    <ul
      v-if="displayMode === 'grid'"
      class="w-full grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
    >
      <li
        v-for="product in gridProducts"
        :key="product.id"
        class="flex flex-col"
      >
        <ProductCard :product="product" class="w-full h-full" />
      </li>
    </ul>

    <div v-else-if="displayMode === 'row'" class="w-full">
      <ul class="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <li
          v-for="product in rowProducts"
          :key="product.id"
          class="flex flex-col"
        >
          <ProductCard :product="product" class="w-full h-full" />
        </li>
      </ul>
    </div>

    <div
      v-if="displayMode === 'grid' && totalPages > 1"
      class="flex items-center justify-center w-full mt-6 gap-2"
    >
      <button
        @click="prevPage"
        :disabled="currentPage === 1"
        class="p-2 bg-white rounded-lg shadow hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <Icon
          icon="heroicons:arrow-left-20-solid"
          class="w-5 h-5 text-gray-700"
        />
      </button>

      <button
        v-for="n in totalPages"
        :key="n"
        @click="goToPage(n)"
        class="px-3 py-1 rounded-lg font-medium transition-colors shadow-sm"
        :class="
          n === currentPage
            ? 'bg-blue-600 text-white'
            : 'bg-white text-gray-700 hover:bg-gray-50'
        "
      >
        {{ n }}
      </button>

      <button
        @click="nextPage"
        :disabled="currentPage === totalPages"
        class="p-2 bg-white rounded-lg shadow hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <Icon
          icon="heroicons:arrow-right-20-solid"
          class="w-5 h-5 text-gray-700"
        />
      </button>
    </div>
  </section>
</template>
