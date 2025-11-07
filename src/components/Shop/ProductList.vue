<script setup>
import ProductCard from './ProductCard.vue';
import { RouterLink } from 'vue-router';
import { Icon } from '@iconify/vue';
import { computed, ref } from 'vue'; // 1. Tambahkan 'ref'

const props = defineProps({
    title: String,
    products: Array,
    displayMode: {
        type: String,
        default: 'grid'
    },
    categorySlug: {
        type: String,
        default: 'shop'
    }
});

// --- LOGIKA PAGINATION ---
const currentPage = ref(1);
const productsPerPage = 8; // 2 baris x 4 kolom = 8 produk per halaman

// Hitung total halaman
const totalPages = computed(() => {
    return Math.ceil(props.products.length / productsPerPage);
});

// Mode GRID ('Lihat Semua') sekarang di-slice berdasarkan halaman
const gridProducts = computed(() => {
    // 2. Ubah logic ini untuk mem-paginasi
    const startIndex = (currentPage.value - 1) * productsPerPage;
    const endIndex = startIndex + productsPerPage;
    return props.products.slice(startIndex, endIndex);
});

// Mode ROW ('Landing Page') tetap 1 baris (4 produk)
const rowProducts = computed(() => {
    return props.products.slice(0, 4);
});

// 3. Tambahkan fungsi untuk navigasi halaman
function nextPage() {
    if (currentPage.value < totalPages.value) {
        currentPage.value++;
    }
}
function prevPage() {
    if (currentPage.value > 1) {
        currentPage.value--;
    }
}
function goToPage(pageNumber) {
    currentPage.value = pageNumber;
}

</script>

<template>
    <section class="w-full p-3 sm:p-5 bg-linear-131 mt-5 from-white/20 to-gray-50/20 rounded-[37px] shadow-[5px_6px_22.899999618530273px_0px_rgba(0,0,0,0.13)] outline outline-[2.50px] outline-offset-[-2.50px] outline-white backdrop-blur-sm flex flex-col justify-start items-center gap-4">
        
        <div class="inline-flex items-center self-stretch justify-between">
            <h2 class="h-7 justify-start text-stone-800 text-2xl font-bold font-outfit capitalize leading-7">
                {{ title }}
            </h2>
            
            <RouterLink 
                :to="`/shop/${categorySlug}`" 
                class= "flex items-center justify-center gap-2 px-3 py-1.5 bg-white rounded-lg shadow-sm 
                        text-stone-800 text-xs font-semibold font-outfit uppercase 
                        transition-all hover:bg-gray-100 hover:shadow-md group"
            >
                Lihat Semua
                <Icon icon="heroicons:arrow-right-20-solid" class="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
            </RouterLink>
        </div>
        
        <!-- Mode GRID (Tampilan 'Lihat Semua' / Halaman Kategori) -->
        <ul v-if="displayMode === 'grid'" class="w-full p-2.5 grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            <li 
                v-for="product in gridProducts"
                :key="product.id"
                class="flex flex-col items-center justify-start" 
                >
                <ProductCard :product="product" class="w-full" />
            </li>
        </ul>
        
        <!-- Mode ROW (Tampilan 'Landing Page' / '/shop') -->
        <div v-else-if="displayMode === 'row'" class="w-full p-2.5">
            <ul class="w-full grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <li 
                    v-for="product in rowProducts"
                    :key="product.id"
                    class="flex flex-col items-center justify-start"
                    >
                    <ProductCard :product="product" class="w-full" />
                </li>
            </ul>
        </div>

        <!-- 4. BUAT PAGINATION MENJADI DINAMIS -->
        <div v-if="displayMode === 'grid' && totalPages > 1" class="flex items-center justify-center w-full mt-4">
            <div class="flex items-center gap-2">
                <button 
                    @click="prevPage"
                    :disabled="currentPage === 1"
                    class="px-4 py-2 text-sm font-medium text-gray-700 bg-white rounded-lg shadow-sm hover:bg-gray-50 disabled:opacity-50"
                >
                    <icon icon="heroicons:arrow-left-20-solid" class="w-4 h-4" />
                </button>
                
                <button
                    v-for="n in totalPages"
                    :key="n"
                    @click="goToPage(n)"
                    class="px-4 py-2 text-sm font-medium rounded-lg shadow-sm hover:bg-gray-50"
                    :class="{
                        'bg-blue-50 text-blue-600': n === currentPage,
                        'bg-white text-gray-700': n !== currentPage
                    }"
                >
                    {{ n }}
                </button>
                
                <button 
                    @click="nextPage"
                    :disabled="currentPage === totalPages"
                    class="px-4 py-2 text-sm font-medium text-gray-700 bg-white rounded-lg shadow-sm hover:bg-gray-50 disabled:opacity-50"
                >
                    <icon icon="heroicons:arrow-right-20-solid" class="w-4 h-4" />
                </button>
            </div>
        </div>

    </section>
</template>

