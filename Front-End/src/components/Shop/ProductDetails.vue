<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { Icon } from '@iconify/vue';
import api from '@/services/api.js';
import { useToast } from "vue-toastification";

const route = useRoute();
const router = useRouter();
const toast = useToast();

// State
const product = ref(null);
const mainImage = ref('');
const thumbnailImages = ref([]);
const quantity = ref(1);
const isSubmitting = ref(false);
const isAddedToCart = ref(false);

const baseUrl = 'http://localhost:3000/uploads';

// Helper URL Gambar
const getFullUrl = (path) => {
    if (!path) return 'https://placehold.co/600x600?text=No+Image';
    return path.startsWith('http') ? path : `${baseUrl}/${path}`;
};

// Computed Properties
const canRent = computed(() => product.value?.price_rent > 0);
const canBuy  = computed(() => product.value?.price_sale > 0);

// --- FETCH DATA ---
const fetchDetail = async () => {
    const id = route.params.id;
    try {
        const res = await api.getProductDetail(id);
        const p = res.data;
        const allImages = p.images || [];

        let mainImgPath = p.img;
        if (allImages.length > 0) {
            const mainObj = allImages.find(i => i.img_type === 'main');
            mainImgPath = mainObj ? mainObj.img_path : allImages[0].img_path;
        }

        product.value = p;
        mainImage.value = getFullUrl(mainImgPath);
        thumbnailImages.value = allImages.length > 0
            ? allImages.map(i => getFullUrl(i.img_path))
            : [getFullUrl(mainImgPath)];

    } catch (error) {
        toast.error("Gagal memuat produk.");
    }
};

// --- FUNGSI TOMBOL ---
const addToCart = async () => {
    if (isSubmitting.value) return;

    if (!canBuy.value) {
        toast.warning("Produk sewa hanya untuk showcase, tidak untuk checkout online.");
        return;
    }

    isSubmitting.value = true;
    try {
        await api.addToCart({
            id_product: product.value.id,
            quantity: quantity.value,
            transaction_type: 'beli'
        });

        isAddedToCart.value = true;
        toast.success("Masuk keranjang!");

    } catch (error) {
        if (error.response?.status === 401) {
            toast.info("Silakan Login terlebih dahulu.");
            router.push('/login');
        } else {
            toast.error("Gagal menambah ke keranjang.");
        }
    } finally {
        isSubmitting.value = false;
    }
};

const handleTransaction = async (type) => {
    if (isSubmitting.value) return;
    isSubmitting.value = true;

    try {
        await api.addToCart({
            id_product: product.value.id,
            quantity: quantity.value,
            transaction_type: type
        });

        router.push('/shop/checkout');

    } catch (error) {
        if (error.response?.status === 401) {
            toast.info("Silakan Login untuk melanjutkan transaksi.");
            router.push('/login');
        } else {
            toast.error("Terjadi kesalahan saat memproses.");
        }
    } finally {
        isSubmitting.value = false;
    }
};

function selectThumbnail(image) {
    mainImage.value = image;
}

onMounted(fetchDetail);
</script>

<template>
    <section v-if="product" class="w-full min-h-screen flex flex-col justify-start items-start bg-zinc-100 pt-[100px] px-4 md:px-10">
        <div class="w-full p-5 bg-zinc-100 flex flex-col lg:flex-row justify-center items-start gap-10 rounded-lg">    

            <div class="flex-1 w-full bg-zinc-100 shadow-[0px_10px_1px_rgba(221,_221,_221,_1),_0_10px_20px_rgba(204,_204,_204,_1)] p-5 rounded-lg flex flex-col justify-center">
                <img :src="mainImage" :alt="product.name" class="max-w-[513px] max-h-[497px] w-full object-cover mx-auto rounded-lg aspect-square">
                <div v-if="thumbnailImages.length > 1" class="flex flex-row items-center mt-10 gap-4 overflow-x-auto whitespace-nowrap px-4 py-2 bg-zinc-100">
                    <img 
                        v-for="(image, index) in thumbnailImages" 
                        :key="index"
                        :src="image" 
                        class="w-[100px] h-[100px] object-cover rounded-lg cursor-pointer flex-shrink-0 border-2 transition-all duration-200 border-transparent hover:border-blue-600" 
                        :class="{'border-blue-600': image === mainImage}" 
                        @click="selectThumbnail(image)"
                    >
                </div>
            </div>

            <div class="flex-1 w-full bg-zinc-200 p-5 rounded-lg text-black">
                <h1 class="text-2xl font-medium">{{ product.name }}</h1>

                <div class="mt-4 flex flex-col gap-2">
                    <div v-if="canBuy" class="flex items-center gap-3 p-3 bg-green-50 rounded-lg border border-green-100">
                        <span class="text-xs font-bold bg-green-600 text-white px-2 py-1 rounded uppercase tracking-wider">BELI</span>
                        <span class="text-3xl font-bold text-green-700">Rp. {{ Number(product.price_sale).toLocaleString('id-ID') }}</span>
                    </div>
                    <div v-if="canRent" class="flex items-center gap-3 p-2 bg-blue-50 rounded-lg border border-blue-100 opacity-75">
                        <span class="text-[10px] font-bold bg-blue-600 text-white px-2 py-0.5 rounded uppercase tracking-wider">SEWA</span>
                        <span class="text-lg font-medium text-blue-700">Rp. {{ Number(product.price_rent).toLocaleString('id-ID') }} 
                            <span class="text-sm font-normal text-gray-500">/hari</span>
                        </span>
                    </div>
                </div>

                <div class="mt-4 text-gray-700 whitespace-pre-line leading-relaxed">
                    {{ product.description }}
                </div>

                <ul class="list-disc ml-5 mt-4 space-y-2 text-sm text-gray-600">
                    <li>Spesifikasi: {{ product.specification || '-' }}</li>
                </ul>

                <!-- SHOWCASE NOTICE UNTUK PRODUK SEWA ONLY -->
                <div v-if="canRent && !canBuy" class="mt-5 text-blue-700 font-medium bg-blue-100 p-3 rounded-lg text-sm">
                    Produk hanya dapat disewa di lokasi / tempat. Tidak tersedia untuk checkout online.
                </div>

                <div class="mt-4" v-if="canBuy">
                    <p v-if="product.stock > 0" class="inline-flex items-center gap-2 text-green-700 font-medium bg-green-100 px-3 py-1 rounded-full text-sm">
                        <Icon icon="tabler:checkbox" class="w-5 h-5"/> Stok Tersedia: {{ product.stock }}
                    </p>
                    <p v-else class="inline-flex items-center gap-2 text-red-600 font-medium bg-red-100 px-3 py-1 rounded-full text-sm">
                        <Icon icon="healthicons:no-outline-24px" class="w-5 h-5"/> Stok Habis
                    </p>
                </div>

                <div class="flex flex-col sm:flex-row gap-4 mt-8">
                    <div class="w-full sm:w-[100px]">
                        <input 
                            type="number" 
                            v-model="quantity" 
                            min="1" 
                            :max="canBuy ? product.stock : 100"
                            class="w-full p-3 bg-white border border-gray-300 rounded-xl text-center text-gray-900 focus:ring-2 focus:ring-blue-500 font-bold text-lg"
                            :disabled="canBuy && product.stock <= 0"
                        >
                    </div>
                    
                    <div class="flex flex-col sm:flex-row gap-3 w-full">
                        <button 
                            v-if="canBuy"
                            @click="handleTransaction('beli')"
                            :disabled="product.stock <= 0 || isSubmitting"
                            class="flex-1 px-6 py-3 bg-green-600 text-white rounded-xl font-bold shadow-lg hover:bg-green-700 transition-transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            <Icon icon="mdi:cart-arrow-right" class="w-5 h-5" />
                            Beli Sekarang
                        </button>

                        <!-- Tombol sewa hanya muncul bila produk bisa BELI + SEWA -->
                        <button 
                            v-if="canRent && canBuy"
                            @click="handleTransaction('sewa')"
                            :disabled="isSubmitting"
                            class="flex-1 px-6 py-3 bg-blue-600 text-white rounded-xl font-bold shadow-lg hover:bg-blue-700 transition-transform active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                            <Icon icon="mdi:clock-time-four-outline" class="w-5 h-5" />
                            Sewa Sekarang
                        </button>
                    </div>
                </div>
                
                <button 
                    v-if="canBuy"
                    @click="addToCart"
                    :disabled="product.stock <= 0 || isSubmitting"
                    class="mt-3 w-full py-2 text-sm font-medium text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                    <Icon :icon="isAddedToCart ? 'mdi:check' : 'mdi:cart-plus'" class="w-5 h-5" />
                    {{ isAddedToCart ? 'Sudah di Keranjang' : 'Tambah ke Keranjang' }}
                </button>
            </div>
        </div>
    </section>

    <div v-else class="h-screen flex flex-col justify-center items-center text-gray-500 gap-4">
        <div class="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-600"></div>
        <p class="font-medium">Memuat produk...</p>
    </div>
</template>
