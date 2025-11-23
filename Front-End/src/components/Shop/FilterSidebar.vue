<script setup>
import { ref, reactive, defineEmits, onMounted, computed } from 'vue'
import { Icon } from '@iconify/vue'; 
import api from '@/services/api.js';
import { useToast } from "vue-toastification";

const emit = defineEmits(['close']);
const toast = useToast();

// --- TAB SYSTEM ---
const activeTab = ref('filter'); 

// --- DATA FILTER ---
const jenisAlat = ['Joran', 'Umpan', 'Kail', 'Senar', 'Reel']; 
const status = ['Sewa', 'Beli']; // Opsi Status
const selectedAlat = ref([]);
const selectedStatus = ref(null); // State untuk status terpilih
const filterHarga = reactive({ min: null, max: null });

// --- DATA CART ---
const cartItems = ref([]);
const baseUrl = 'http://localhost:3000/uploads';

const fetchCart = async () => {
    try {
        const res = await api.getCart();
        cartItems.value = res.data;
    } catch (error) {
        cartItems.value = []; 
    }
};

const removeItem = async (id) => {
    try {
        await api.removeFromCart(id);
        fetchCart(); 
        toast.success("Item dihapus");
    } catch (error) {
        toast.error("Gagal hapus item");
    }
};

const cartTotal = computed(() => {
    return cartItems.value.reduce((sum, item) => sum + (Number(item.price) * item.quantity), 0);
});

const getFullUrl = (path) => {
    if (!path) return 'https://placehold.co/100';
    return path.startsWith('http') ? path : `${baseUrl}/${path}`;
};

onMounted(() => {
    fetchCart();
});

// --- LOGIKA FILTER ---
function toggleAlat(alat) {
    const index = selectedAlat.value.indexOf(alat)
    if (index > -1) selectedAlat.value.splice(index, 1);
    else selectedAlat.value.push(alat);
}

function selectStatus(stat) {
    // Toggle status (klik lagi untuk unselect)
    if (selectedStatus.value === stat) selectedStatus.value = null;
    else selectedStatus.value = stat;
}

function tampilkanHasil() {
    emit('close', {
        alat: selectedAlat.value,
        status: selectedStatus.value, // Kirim status ke parent
        harga: filterHarga
    });
}

function resetFilter() {
    filterHarga.min = null;
    filterHarga.max = null;
    selectedAlat.value = [];
    selectedStatus.value = null;
}
</script>

<template>
    <aside class="p-6 bg-white rounded-3xl shadow-lg flex flex-col gap-5 h-full max-h-[85vh] overflow-y-auto">
        
        <div class="flex border-b border-gray-100 pb-2 mb-2">
            <button 
                @click="activeTab = 'filter'"
                class="flex-1 py-2 text-sm font-bold text-center transition-colors"
                :class="activeTab === 'filter' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-800'"
            >
                Filter
            </button>
            <button 
                @click="{ activeTab = 'cart'; fetchCart(); }"
                class="flex-1 py-2 text-sm font-bold text-center transition-colors flex items-center justify-center gap-2"
                :class="activeTab === 'cart' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-800'"
            >
                Keranjang
                <span v-if="cartItems.length" class="bg-red-500 text-white text-[10px] px-1.5 rounded-full">{{ cartItems.length }}</span>
            </button>
        </div>

        <form v-if="activeTab === 'filter'" class="flex flex-col w-full gap-5" @submit.prevent="tampilkanHasil" @reset.prevent="resetFilter">
            <div class="flex items-center justify-between pb-4 border-b border-gray-100">
                <h2 class="text-xl font-bold text-gray-900">Filter</h2>
                <div class="flex items-center gap-4">
                    <button type="reset" class="text-base font-bold text-blue-600 transition-colors hover:text-blue-700">Hapus</button>
                    <button type="button" @click="emit('close')" class="lg:hidden p-1 text-gray-500 hover:text-gray-800">
                        <Icon icon="heroicons:x-mark-20-solid" class="w-6 h-6" />
                    </button>
                </div>
            </div>
            
            <div class="flex flex-col gap-3">
                <h3 class="text-lg font-semibold text-gray-800">Jenis Alat</h3>
                <div class="flex flex-wrap gap-2.5">
                    <button 
                        v-for="jenis in jenisAlat"
                        :key="jenis"
                        type="button"
                        @click="toggleAlat(jenis)"
                        :class="[
                            'px-4 py-2 text-sm font-medium rounded-lg transition-colors border',
                            selectedAlat.includes(jenis)
                                ? 'bg-blue-600 text-white border-blue-600'
                                : 'bg-gray-100 text-gray-800 border-gray-200 hover:bg-gray-200 hover:border-gray-300'
                        ]"
                    >
                        {{ jenis }}
                    </button>
                </div>
            </div>
            
            <div class="flex flex-col gap-3">
                <h3 class="text-lg font-semibold text-gray-800">Harga</h3>
                <div class="flex items-center gap-2">
                    <div class="relative flex-1">
                        <input type="number" v-model.number="filterHarga.min" placeholder="Min" class="w-full pl-8 pr-2 py-2 border border-gray-300 text-black rounded-lg text-sm focus:ring-blue-500 focus:border-blue-500"/>
                        <Icon icon="heroicons:currency-dollar-20-solid" class="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                    </div>
                    <span class="text-gray-500">-</span>
                    <div class="relative flex-1">
                        <input type="number" v-model.number="filterHarga.max" placeholder="Max" class="w-full pl-8 pr-2 py-2 border border-gray-300 text-black rounded-lg text-sm focus:ring-blue-500 focus:border-blue-500"/>
                        <Icon icon="heroicons:currency-dollar-20-solid" class="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                    </div>
                </div>
            </div>
            
            <div class="flex flex-col gap-3">
                <h3 class="text-lg font-semibold text-gray-800">Status</h3>
                <div class="flex flex-wrap gap-2.5">
                    <button 
                        v-for="stat in status"
                        :key="stat"
                        type="button"
                        @click="selectStatus(stat)"
                        :class="[
                            'px-4 py-2 text-sm font-medium rounded-lg transition-colors border',
                            selectedStatus === stat
                                ? 'bg-blue-600 text-white border-blue-600'
                                : 'bg-gray-100 text-gray-800 border-gray-200 hover:bg-gray-200 hover:border-gray-300'
                        ]"
                    >
                        {{ stat }}
                    </button>
                </div>
            </div>
            
            <button 
                type="submit"
                class="w-full px-4 py-2 bg-gradient-to-tr from-blue-800 to-blue-500/90 rounded-xl inline-flex justify-center items-center gap-2.5 text-white text-base font-medium font-['Outfit'] hover:from-blue-700 hover:to-blue-400 transition duration-300"
            >
                Tampilkan Hasil
            </button>
        </form>

        <div v-else class="flex flex-col h-full">
            <div v-if="cartItems.length === 0" class="flex flex-col items-center justify-center py-10 text-gray-400 flex-1">
                <Icon icon="heroicons:shopping-cart" class="w-12 h-12 mb-2 opacity-50" />
                <p class="text-sm">Keranjang kosong</p>
            </div>
            <div v-else class="flex flex-col gap-4 flex-1 overflow-y-auto pr-1">
                <div v-for="item in cartItems" :key="item.id" class="flex gap-3 bg-gray-50 p-3 rounded-xl border border-gray-100 relative group">
                    <img :src="getFullUrl(item.img)" class="w-16 h-16 object-cover rounded-lg bg-white border border-gray-200">
                    <div class="flex-1 min-w-0 flex flex-col justify-between">
                        <div>
                            <h4 class="text-sm font-bold text-gray-900 truncate">{{ item.name }}</h4>
                            <div class="flex items-center gap-2 mt-1">
                                <p class="text-xs text-gray-500">Qty: {{ item.quantity }}</p>
                            </div>
                        </div>
                        <div class="flex items-center justify-between mt-1">
                            <span class="text-sm font-bold text-blue-600">Rp {{ (item.price * item.quantity).toLocaleString('id-ID') }}</span>
                            <button @click="removeItem(item.id)" class="p-1.5 rounded-lg text-red-400 hover:text-red-600 hover:bg-red-50 transition-colors">
                                <Icon icon="heroicons:trash" class="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <div v-if="cartItems.length > 0" class="mt-auto pt-4 border-t border-gray-100">
                <div class="flex justify-between items-center mb-4">
                    <span class="text-sm font-medium text-gray-600">Total</span>
                    <span class="text-lg font-bold text-gray-900">Rp {{ cartTotal.toLocaleString('id-ID') }}</span>
                </div>
                <router-link to="/shop/checkout" class="block w-full py-3 bg-green-600 text-white text-center rounded-xl font-bold shadow-lg hover:bg-green-700 transition-transform active:scale-95">
                    Checkout
                </router-link>
            </div>
        </div>

    </aside>
</template>
