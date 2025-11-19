<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useRoute } from 'vue-router';
import FilterSidebar from '../components/Shop/FilterSidebar.vue';
import ProductList from '../components/Shop/ProductList.vue';
import { Icon } from '@iconify/vue';

import joran1 from '../assets/alatimg/joran1.png';
import joran2 from '../assets/alatimg/joran2.png';
import joran3 from '../assets/alatimg/joran3.png';
import reels1 from '../assets/alatimg/reels1.png';
import reels2 from '../assets/alatimg/reels2.png';
import reels3 from '../assets/alatimg/reels3.png';

const joranProducts = ref([
    {
        id: 1,
        category: 'joran',
        imageUrl: joran1,
        name: 'Joran Pancing Shimano FX Spinning 210cm',
        rating: 4,
        sold: 245,
        price: 'Rp 489.000',
        isForRent: true,
        isForSale: true
    },
    {
        id: 2,
        category: 'joran',
        imageUrl: joran2,
        name: 'Joran Carbon Fiber 180cm Kuat',
        rating: 5,
        sold: 178,
        price: 'Rp 350.000',
        isForRent: true,
        isForSale: false
    },
    {
        id: 5,
        category: 'joran',
        imageUrl: joran3,
        name: 'Joran Pancing Telescopic 150cm',
        rating: 3,
        sold: 95,
        price: 'Rp 220.000',
        isForRent: false,
        isForSale: true
    },
    {
        id: 6,
        category: 'joran',
        imageUrl: joran2,
        name: 'Joran Spinning Abu Garcia Veritas 2.0',
        rating: 4,
        sold: 130,
        price: 'Rp 600.000',
        isForRent: true,
        isForSale: true
    },
    {
        id: 7,
        category: 'joran',
        imageUrl: joran1,
        name: 'Joran Pancing Fiber Glass 200cm',
        rating: 2,
        sold: 60,
        price: 'Rp 180.000',
        isForRent: false,
        isForSale: true
    },
    {
        id: 8,
        category: 'joran',
        imageUrl: joran3,
        name: 'Joran Pancing Telescopic 240cm',
        rating: 5,
        sold: 300,
        price: 'Rp 750.000',
        isForRent: true,
        isForSale: true
    },
    {
        id: 9,
        category: 'joran',
        imageUrl: joran2,
        name: 'Joran Pancing Spinning Carbon 210cm',
        rating: 4,
        sold: 220,
        price: 'Rp 520.000',
        isForRent: true,
        isForSale: false
    },
    {
        id: 10,
        category: 'joran',
        imageUrl: joran1,
        name: 'Joran Pancing Fiber Glass 180cm',
        rating: 3,
        sold: 110,
        price: 'Rp 300.000',
        isForRent: false,
        isForSale: true
    },
    {
        id: 11,
        category: 'joran',
        imageUrl: joran3,
        name: 'Joran Pancing Spinning Abu Garcia Veritas 1.5',
        rating: 4,
        sold: 150,
        price: 'Rp 450.000',
        isForRent: true,
        isForSale: true
    },
    {
        id: 12,
        category: 'joran',
        imageUrl: joran1,
        name: 'Joran Pancing Telescopic 210cm',
        rating: 5,
        sold: 280,
        price: 'Rp 680.000',
        isForRent: true,
        isForSale: true
    },
    {
        id: 13,
        category: 'joran',
        imageUrl: joran2,
        name: 'Joran Pancing Carbon Fiber 200cm',
        rating: 4,
        sold: 200,
        price: 'Rp 550.000',
        isForRent: true,
        isForSale: false
    },
]);

const reelProducts = ref([
    {
        id: 3,
        category: 'reels',
        imageUrl: reels1,
        name: 'Reel Pancing Shimano Sienna 4000',
        rating: 5,
        sold: 512,
        price: 'Rp 550.000',
        isForRent: true,
        isForSale: true
    },
    {
        id: 4,
        category: 'reels',
        imageUrl: reels2,
        name: 'Reel Daiwa Crossfire 3000',
        rating: 4,
        sold: 320,
        price: 'Rp 420.000',
        isForRent: false,
        isForSale: true
    },
    {
        id: 4,
        category: 'reels',
        imageUrl: reels3,
        name: 'Reel Daiwa Crossfire 3000',
        rating: 4,
        sold: 320,
        price: 'Rp 420.000',
        isForRent: false,
        isForSale: true
    },
]);

const allProducts = ref([
    ...joranProducts.value,
    ...reelProducts.value
]);

const route = useRoute();

const currentCategory = computed(() => route.params.categorySlug);

const filteredProducts = computed(() => {
    if (currentCategory.value) {
        return allProducts.value.filter(p => p.category === currentCategory.value);
    }
    return [];
});

const pageTitle = computed(() => {
    if (currentCategory.value === 'joran') return 'Joran';
    if (currentCategory.value === 'reels') return 'Reels Pancing';
    return 'Produk';
});

// --- PERUBAHAN DIMULAI ---

// FILTER MOBILE
// Mengganti isFilterOpen dengan isFilterVisible agar konsisten dengan Code 1
const isFilterVisible = ref(false);
// Menghapus fungsi openFilter dan closeFilter
// const openFilter = () => { isFilterOpen.value = true; };
// const closeFilter = () => { isFilterOpen.value = false; };

// --- PERUBAHAN SELESAI ---


const showScrollToTop = ref(false);

const handleScroll = () => {
    showScrollToTop.value = window.scrollY > 200; // Tampilkan setelah scroll 200px
};

const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
};

onMounted(() => {
    window.addEventListener('scroll', handleScroll);
});

onUnmounted(() => {
    window.removeEventListener('scroll', handleScroll);
});

</script>

<template>
    <div class="relative w-screen flex-col min-h-screen bg-zinc-100">
        <div class="w-full p-2.5 flex flex-col justify-start items-stretch gap-20 relative z-30">
            <div class="self-stretch flex flex-col lg:flex-row justify-start items-start gap-2.5">
                <FilterSidebar class="hidden lg:block w-full lg:w-80 flex-shrink-0 sticky top-32 z-20" />
                <main class="flex-1 min-w-0 py-9 inline-flex flex-col justify-start items-center gap-2.5 w-full">

                    <h1 class="text-4xl font-medium text-black md:text-6xl">
                        Toko Strike It!
                    </h1>
                    <p class="max-w-2xl mx-auto mt-5 text-lg text-center leading-relaxed text-gray-600">
                        Jelajahi koleksi perlengkapan memancing terbaik kami yang dirancang untuk memenuhi
                        kebutuhan setiap pemancing, dari pemula hingga profesional.
                    </p>
                    <button @click="isFilterVisible = !isFilterVisible"
                        class="lg:hidden w-full h-16 p-4 bg-white rounded-xl shadow-md flex items-center justify-between cursor-pointer transition-all duration-200 hover:shadow-lg">
                        <span class="text-xl font-semibold text-gray-800">Filter</span>
                        <Icon
                            :icon="isFilterVisible ? 'heroicons:x-mark-20-solid' : 'heroicons:adjustments-horizontal-20-solid'"
                            class="w-6 h-6 text-gray-600" />
                    </button>

                    <aside class="lg:hidden transition-all duration-300 ease-out w-full" :class="isFilterVisible
                            ? 'opacity-100 translate-y-0 max-h-screen'
                            : 'opacity-0 -translate-y-4 max-h-0 overflow-hidden'
                        ">
                        <FilterSidebar class="my-4" @close="isFilterVisible = false" />
                    </aside>
                    <div v-if="!currentCategory" class="w-full flex-col gap-2.5">
                        <ProductList title="Joran" :products="joranProducts" categorySlug="joran" displayMode="row" _ />
                        <ProductList title="Reels Pancing" :products="reelProducts" categorySlug="reels"
                            displayMode="row" />
                        _
                    </div>

                    <div v-else class="w-full">
                        <ProductList :title="pageTitle" :products="filteredProducts" :categorySlug="currentCategory"
                            displayMode="grid" />
                    </div>

                </main>

            </div>

        </div>

        <transition name="fade">
            <button v-if="showScrollToTop" @click="scrollToTop"
                class="fixed bottom-6 right-6 lg:bottom-8 lg:right-8 p-3 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-all duration-300 z-50 flex items-center justify-center">
                <Icon icon="heroicons:arrow-up-20-solid" class="w-6 h-6" />
            </button>
        </transition>
    </div>
</template>

<style scoped>
/* Transisi untuk tombol scroll-to-top */
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}
</style>
