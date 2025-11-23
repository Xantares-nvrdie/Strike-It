<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useRoute } from 'vue-router'; // Penting: useRoute untuk baca parameter URL
import FilterSidebar from '@/components/Shop/FilterSidebar.vue';
import ProductList from '@/components/Shop/ProductList.vue';
import { Icon } from '@iconify/vue';
import api from '@/services/api.js';

const products = ref([]); 
const isLoading = ref(true);

const route = useRoute();
// Ambil slug kategori dari URL (misal: 'joran', 'reels')
const currentCategorySlug = computed(() => route.params.categorySlug);

// Fetch All Products
const fetchProducts = async (filters = {}) => {
    isLoading.value = true;
    try {
        const params = {};
        // Jika ada filter dari sidebar
        if (filters.alat && filters.alat.length > 0) params.category = filters.alat[0];
        if (filters.harga?.min) params.minPrice = filters.harga.min;
        if (filters.harga?.max) params.maxPrice = filters.harga.max;

        const res = await api.getProducts(params);
        products.value = res.data;
    } catch (error) {
        console.error("Gagal load produk:", error);
    } finally {
        isLoading.value = false;
    }
};

// --- LOGIKA FILTER KATEGORI ---

const joranProducts = computed(() => {
    // ID 1 = Joran (Sesuaikan dengan DB Anda)
    return products.value.filter(p => p.id_category == 1 || (p.name && p.name.toLowerCase().includes('joran')));
});

const reelProducts = computed(() => {
    // ID 2 = Reel (Sesuaikan dengan DB Anda)
    return products.value.filter(p => p.id_category == 2 || (p.name && p.name.toLowerCase().includes('reel')));
});

// Produk yang ditampilkan saat masuk ke halaman "Lihat Semua"
const categoryFilteredProducts = computed(() => {
    if (!currentCategorySlug.value) return [];
    
    const slug = currentCategorySlug.value.toLowerCase();
    
    if (slug === 'joran') return joranProducts.value;
    if (slug === 'reels') return reelProducts.value;
    
    // Fallback untuk kategori lain
    return products.value.filter(p => p.name.toLowerCase().includes(slug));
});

// Judul Halaman Dinamis
const pageTitle = computed(() => {
    if (currentCategorySlug.value === 'joran') return 'Kategori: Joran';
    if (currentCategorySlug.value === 'reels') return 'Kategori: Reels Pancing';
    return 'Semua Produk';
});

// --- UI UTILS ---
const isFilterVisible = ref(false);
const showScrollToTop = ref(false);

const handleScroll = () => showScrollToTop.value = window.scrollY > 200;
const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });
const handleFilter = (filterData) => {
    fetchProducts(filterData);
    isFilterVisible.value = false; 
};

onMounted(() => {
    fetchProducts();
    window.addEventListener('scroll', handleScroll);
});
onUnmounted(() => window.removeEventListener('scroll', handleScroll));
</script>

<template>
    <div class="relative w-screen flex-col min-h-screen bg-zinc-100">
        <div class="w-full p-2.5 flex flex-col justify-start items-stretch gap-20 relative z-30">
            <div class="self-stretch flex flex-col lg:flex-row justify-start items-start gap-2.5">
                
                <FilterSidebar class="hidden lg:block w-full lg:w-80 flex-shrink-0 sticky top-32 z-20" @close="handleFilter" />
                
                <main class="flex-1 min-w-0 py-9 inline-flex flex-col justify-start items-center gap-2.5 w-full">

                    <h1 class="text-4xl font-medium text-black md:text-6xl">
                        Toko Strike It!
                    </h1>
                    <p class="max-w-2xl mx-auto mt-5 text-lg text-center leading-relaxed text-gray-600">
                        Jelajahi koleksi perlengkapan memancing terbaik kami.
                    </p>
                    
                    <button @click="isFilterVisible = !isFilterVisible"
                        class="lg:hidden w-full h-16 p-4 bg-white rounded-xl shadow-md flex items-center justify-between cursor-pointer hover:shadow-lg">
                        <span class="text-xl font-semibold text-gray-800">Filter & Keranjang</span>
                        <Icon :icon="isFilterVisible ? 'heroicons:x-mark-20-solid' : 'heroicons:adjustments-horizontal-20-solid'" class="w-6 h-6 text-gray-600" />
                    </button>

                    <aside class="lg:hidden transition-all duration-300 ease-out w-full" :class="isFilterVisible ? 'opacity-100 translate-y-0 max-h-screen' : 'opacity-0 -translate-y-4 max-h-0 overflow-hidden'">
                        <FilterSidebar class="my-4" @close="handleFilter" />
                    </aside>

                    <div v-if="isLoading" class="py-20 text-gray-500 flex flex-col items-center">
                        <div class="animate-spin rounded-full h-8 w-8 border-t-2 border-blue-600 mb-2"></div>
                        Memuat produk...
                    </div>
                    
                    <div v-else-if="!currentCategorySlug" class="w-full flex flex-col gap-8">
                        
                        <ProductList 
                            v-if="joranProducts.length > 0"
                            title="Joran" 
                            :products="joranProducts" 
                            categorySlug="joran" 
                            displayMode="row" 
                        />
                        
                        <ProductList 
                            v-if="reelProducts.length > 0"
                            title="Reels Pancing" 
                            :products="reelProducts" 
                            categorySlug="reels" 
                            displayMode="row" 
                        />

                        <div v-if="products.length === 0" class="text-center py-10 text-gray-400 bg-white rounded-xl w-full">
                            Belum ada data produk.
                        </div>
                    </div>

                    <div v-else class="w-full">
                        <ProductList 
                            :title="pageTitle" 
                            :products="categoryFilteredProducts" 
                            :categorySlug="currentCategorySlug"
                            displayMode="grid" 
                        />
                    </div>

                </main>
            </div>
        </div>

        <transition name="fade">
            <button v-if="showScrollToTop" @click="scrollToTop" class="fixed bottom-6 right-6 lg:bottom-8 lg:right-8 p-3 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 z-50">
                <Icon icon="heroicons:arrow-up-20-solid" class="w-6 h-6" />
            </button>
        </transition>
    </div>
</template>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.3s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
