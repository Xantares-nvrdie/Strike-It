<script setup>
import ProductCard from './ProductCard.vue';
import { RouterLink } from 'vue-router'; // 1. Impor RouterLink

defineProps({
    title: String,
    products: Array,
    // --- TAMBAHKAN PROPS BARU DI BAWAH INI ---
    
    // 'displayMode' bisa 'grid' (untuk halaman full) atau 'row' (untuk di landing page)
    displayMode: {
        type: String,
        default: 'grid' // Default-nya adalah full grid
    },
    // 'categorySlug' adalah URL untuk link "Lihat Semua", cth: 'joran' atau 'reels'
    categorySlug: {
        type: String,
        default: 'shop' // Fallback jika tidak disediakan
    }
});

// Catatan: Untuk pagination, Anda perlu logic tambahan di sini
// seperti 'currentPage' dan 'computed property' untuk mem-filter 'products'.
// Placeholder pagination saya tambahkan di template.
</script>

<template>
    <section class="w-full p-5 bg-linear-131 mt-5 from-white/20 to-gray-50/20 rounded-[37px] shadow-[5px_6px_22.899999618530273px_0px_rgba(0,0,0,0.13)] outline outline-[2.50px] outline-offset-[-2.50px] outline-white backdrop-blur-sm flex flex-col justify-start items-center gap-4">
        
        <div class="inline-flex items-start self-stretch justify-between">
            <h2 class="h-7 justify-start text-stone-800 text-2xl font-bold font-outfit capitalize leading-7">
                {{ title }}
            </h2>
            <!-- 
                2. UBAH DARI <a> ke <RouterLink>
                Link ini sekarang dinamis. Jika categorySlug="joran", link akan ke "/shop/joran"
            -->
            <RouterLink :to="`/shop/${categorySlug}`" class="flex items-center justify-start gap-2 group">
                <span class="text-right justify-center text-stone-800 text-sm font-semibold font-outfit uppercase leading-5 transition-colors group-hover:text-blue-600">
                    Lihat Semua <!-- 3. Teks diganti sesuai referensi -->
                </span>
                <!-- Icon panah, ganti dengan iconify jika Anda mau -->
                <i class="w-3 h-3.5 text-right justify-center text-stone-800 text-sm font-black font-['Font_Awesome_5_Pro'] uppercase leading-4 transition-colors group-hover:text-blue-600"></i>
            </RouterLink>
        </div>
        
        <!-- 
            4. KONDISI TAMPILAN 'GRID' (FULL PAGE)
            Ini HANYA tampil jika displayMode="grid" (default)
        -->
        <ul v-if="displayMode === 'grid'" class="w-full p-2.5 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            <li 
                v-for="product in products"
                :key="product.id"
                class="flex flex-col items-center justify-start" 
                >
                <ProductCard :product="product" class="w-full" />
            </li>
        </ul>
        
        <!-- 
            5. KONDISI TAMPILAN 'ROW' (LANDING PAGE)
            Ini HANYA tampil jika displayMode="row"
            Ini adalah div yang bisa scroll horizontal
        -->
        <div v-else-if="displayMode === 'row'" class="w-full overflow-x-auto p-2.5">
            <ul class="flex flex-nowrap gap-4">
                <li 
                    v-for="product in products"
                    :key="product.id"
                    class="flex-shrink-0 w-64"
                    >
                    <ProductCard :product="product" class="w-full" />
                </li>
            </ul>
        </div>

        <!-- 
            6. PAGINATION (PAGE NUMBERING)
            Hanya tampil di mode 'grid'
        -->
        <div v-if="displayMode === 'grid'" class="flex items-center justify-center w-full mt-4">
            <!-- Ini adalah placeholder, ganti dengan logic pagination Anda -->
            <div class="flex items-center gap-2">
                <button class="px-4 py-2 text-sm font-medium text-gray-700 bg-white rounded-lg shadow-sm hover:bg-gray-50 disabled:opacity-50" disabled>&laquo; Prev</button>
                <span class="px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg">1</span>
                <button class="px-4 py-2 text-sm font-medium text-gray-700 bg-white rounded-lg shadow-sm hover:bg-gray-50">2</button>
                <button class="px-4 py-2 text-sm font-medium text-gray-700 bg-white rounded-lg shadow-sm hover:bg-gray-50">Next &raquo;</button>
            </div>
        </div>

    </section>
</template>
