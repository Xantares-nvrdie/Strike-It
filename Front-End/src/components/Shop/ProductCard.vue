<script setup>
import { Icon } from '@iconify/vue';
import { ref, computed, onMounted } from 'vue';
import api from '@/services/api.js';
import { useToast } from "vue-toastification";

const props = defineProps({
    product: Object 
});

const toast = useToast();
const isAddedToCart = ref(false);
const isSubmitting = ref(false);

// --- 1. FUNGSI CEK STATUS KERANJANG (Agar Icon tidak reset saat refresh) ---
const checkCartStatus = async () => {
    try {
        // Ambil data keranjang user saat ini
        const res = await api.getCart();
        const cartItems = res.data || [];
        
        // Cek apakah ID produk ini ada di dalam list keranjang
        const exists = cartItems.find(item => item.product_id === props.product.id);
        
        if (exists) {
            isAddedToCart.value = true;
        }
    } catch (error) {
        // Silent fail (misal user belum login, biarkan default false)
    }
};

const addToCart = async () => {
    if (isAddedToCart.value || isSubmitting.value) return;
    isSubmitting.value = true;

    try {
        // Default transaction 'beli'
        await api.addToCart({ 
            id_product: props.product.id, 
            quantity: 1,
            transaction_type: 'beli'
        });
        
        isAddedToCart.value = true;
        toast.success("Masuk keranjang!", { timeout: 1000 });
    } catch (error) {
        if (error.response?.status === 401) {
            toast.error("Silakan Login dahulu.");
        } else {
            toast.error("Gagal menambah.");
        }
    } finally {
        isSubmitting.value = false;
    }
};

const displayData = computed(() => {
    const p = props.product;
    const baseUrl = 'http://localhost:3000/uploads';
    
    const imgUrl = p.img ? (p.img.startsWith('http') ? p.img : `${baseUrl}/${p.img}`) : 'https://placehold.co/400';
    const priceVal = parseFloat(p.price_sale) || parseFloat(p.price_rent) || 0;
    
    const canBuy = parseFloat(p.price_sale) > 0;
    const canRent = parseFloat(p.price_rent) > 0;

    return {
        id: p.id,
        name: p.name,
        imageUrl: imgUrl,
        price: `Rp. ${priceVal.toLocaleString('id-ID')}`,
        priceSuffix: (!canBuy && canRent) ? ' /hari' : '',
        rating: Math.round(p.rating_average || 5),
        sold: p.sold_count || 0,
        isForRent: canRent,
        isForSale: canBuy
    };
});

// Jalankan pengecekan saat komponen tampil
onMounted(() => {
    checkCartStatus();
});
</script>

<template>
    <div class="block w-full group">
        <article class="bg-white/30 backdrop-blur-sm rounded-[37px] shadow-[5px_6px_22.9px_rgba(0,0,0,0.13)] 
                    outline outline-[2.5px] outline-offset-[-2.5px] outline-white 
                    flex flex-col items-center text-start hover:shadow-lg p-5 w-full gap-1 lg:gap-3 transition-shadow duration-300">
                
            <router-link :to="`/product/${displayData.id}`" class="w-full cursor-pointer">
                <img :src="displayData.imageUrl" :alt="displayData.name" class="object-cover w-full h-26 sm:h-48 rounded-2xl" />
            </router-link>

            <router-link :to="`/product/${displayData.id}`" class="w-full text-center cursor-pointer">
                <h3 class="mt-2 text-sm font-semibold leading-tight text-stone-900 font-outfit min-h-10 line-clamp-2 hover:text-blue-600 transition-colors">
                    {{ displayData.name }}
                </h3>
            </router-link>

            <div class="flex flex-col items-center justify-center mt-1 space-y-1 h-10">
                <div v-if="displayData.isForSale" class="flex flex-col items-center">
                    <div class="flex items-center justify-center gap-1 text-amber-400">
                        <i v-for="n in displayData.rating" :key="'full-' + n" class="text-sm fas fa-star"></i>
                        <i v-for="n in (5 - displayData.rating)" :key="'empty-' + n" class="text-sm text-gray-300 far fa-star"></i>
                    </div>
                    <span class="text-xs text-gray-500">{{ displayData.sold }} terjual</span>
                </div>

                <div v-else class="flex items-center justify-center">
                    <span class="text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                        Tersedia untuk Sewa
                    </span>
                </div>
            </div>

            <p class="mt-1 text-lg font-semibold text-stone-800">
                {{ displayData.price }} <span class="text-xs font-normal text-gray-500">{{ displayData.priceSuffix }}</span>
            </p>

            <div class="flex items-center justify-center gap-3 mt-1 h-7">
                <span v-if="displayData.isForRent" class="px-3 py-1 text-[10px] font-semibold text-blue-700 uppercase bg-blue-100 rounded-md">
                    Sewa
                </span>
                <span v-if="displayData.isForSale" class="px-3 py-1 text-[10px] font-semibold text-green-700 uppercase bg-green-100 rounded-md">
                    Beli
                </span>
            </div>

            <div class="flex flex-col items-center justify-center w-full space-y-0 sm:space-y-2 mt-2">
                <div class="flex gap-2 w-full">
                    <router-link :to="`/product/${displayData.id}`" class="flex-1">
                        <button type="button" class="w-full px-3 py-2 text-sm font-medium text-white transition bg-gradient-to-tr 
                                    from-blue-800 to-blue-500/90 rounded-lg font-outfit 
                                    hover:from-blue-700 hover:to-blue-400">
                            Lihat
                        </button>
                    </router-link>

                    <button 
                        v-if="displayData.isForSale" 
                        type="button" 
                        @click="addToCart"
                        :disabled="isSubmitting"
                        class="px-3 py-2 rounded-lg transition-colors flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                        :class="isAddedToCart ? 'bg-green-600 text-white' : 'bg-green-100 text-green-700 hover:bg-green-200'"
                        :title="isAddedToCart ? 'Sudah di keranjang' : 'Tambah ke Keranjang'"
                    >
                        <Icon :icon="isAddedToCart ? 'heroicons:check-badge-20-solid' : 'heroicons:shopping-cart-20-solid'" class="w-5 h-5" />
                    </button>
                </div>
            </div>
        </article>
    </div>
</template>
