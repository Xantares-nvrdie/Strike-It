<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { Icon } from '@iconify/vue';
import api from '@/services/api.js';
import { useToast } from "vue-toastification";

const router = useRouter();
const toast = useToast();
const baseUrl = 'http://localhost:3000/uploads';

// State
const cartItems = ref([]);
const isSubmitting = ref(false);
const selectedPayment = ref('bank_transfer'); // Default ID: 2 (Bank Transfer)

// Form Data
const billingDetails = ref({
  firstName: '',
  lastName: '',
  phone: '',
  email: '',
  address: '',
  city: '',
  province: '',
  postcode: '',
  notes: ''
});

// --- FETCH DATA ---
const loadData = async () => {
    try {
        // 1. Ambil Profil User (Auto Fill)
        const userRes = await api.getMyProfile();
        const u = userRes.data;
        billingDetails.value.firstName = u.name.split(' ')[0];
        billingDetails.value.lastName = u.name.split(' ').slice(1).join(' ');
        billingDetails.value.email = u.email;
        billingDetails.value.phone = '08123456789'; // Dummy jika di db kosong

        // 2. Ambil Keranjang
        const cartRes = await api.getCart();
        if (cartRes.data.length === 0) {
            toast.info("Keranjang kosong, silakan belanja dulu.");
            router.push('/shop');
            return;
        }
        cartItems.value = cartRes.data;

    } catch (error) {
        console.error(error);
        toast.error("Gagal memuat data checkout.");
    }
};

onMounted(() => {
    loadData();
});

// --- COMPUTED ---
const cartTotal = computed(() => {
    return cartItems.value.reduce((sum, item) => sum + (Number(item.price) * item.quantity), 0);
});

const getFullUrl = (path) => path ? (path.startsWith('http') ? path : `${baseUrl}/${path}`) : 'https://placehold.co/100';

// --- SUBMIT ORDER ---
const submitCheckout = async () => {
    if (isSubmitting.value) return;
    
    // Validasi Sederhana
    if (!billingDetails.value.address || !billingDetails.value.city) {
        toast.warning("Mohon lengkapi alamat pengiriman.");
        return;
    }

    isSubmitting.value = true;
    try {
        // Gabungkan alamat jadi satu string lengkap
        const fullAddress = `${billingDetails.value.address}, ${billingDetails.value.city}, ${billingDetails.value.province} ${billingDetails.value.postcode}`;

        // Mapping Payment Method ke ID Database (Manual sementara)
        // 1: Debit, 2: Transfer, 3: QRIS, 4: COD
        let paymentId = 2; 
        if (selectedPayment.value === 'qris') paymentId = 3;
        if (selectedPayment.value === 'cod') paymentId = 4;

        const payload = {
            shipping_address: fullAddress,
            payment_method: paymentId,
            notes: billingDetails.value.notes,
            shipping_cost: 20000, // Flat rate contoh
            tax_amount: 0,
            discount_amount: 0
        };

        const res = await api.createOrder(payload);
        
        toast.success(`Pesanan Berhasil! No: ${res.data.order_number}`);
        // Redirect ke halaman History atau Success
        router.push('/history'); // Atau halaman sukses khusus

    } catch (error) {
        toast.error(error.response?.data?.message || "Gagal membuat pesanan.");
    } finally {
        isSubmitting.value = false;
    }
};
</script>

<template>
  <section class="min-h-screen w-screen bg-gray-100 p-4 md:p-8 pt-24">
    <div class="max-w-7xl mx-auto">
      <h1 class="text-3xl font-bold text-gray-900 mb-6">Checkout</h1>

      <div class="flex flex-col lg:flex-row gap-8 items-start">

        <div class="flex-1 w-full text-black bg-white p-6 md:p-8 rounded-2xl shadow-lg">
          <h2 class="text-2xl font-semibold mb-6">Alamat Pengiriman</h2>
          
          <form @submit.prevent="submitCheckout" class="space-y-5">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Nama Depan</label>
                <input type="text" v-model="billingDetails.firstName" class="w-full p-3 border border-gray-300 rounded-lg" readonly>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Nama Belakang</label>
                <input type="text" v-model="billingDetails.lastName" class="w-full p-3 border border-gray-300 rounded-lg" readonly>
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input type="email" v-model="billingDetails.email" class="w-full p-3 border border-gray-300 rounded-lg bg-gray-50" readonly>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Nomor HP <span class="text-red-500">*</span></label>
              <input type="tel" v-model="billingDetails.phone" class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
            </div>

            <div class="pt-4 border-t border-gray-100">
                <h3 class="text-lg font-medium text-gray-900 mb-3">Detail Lokasi</h3>
                <div class="space-y-4">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Alamat Jalan <span class="text-red-500">*</span></label>
                        <input type="text" v-model="billingDetails.address" class="w-full p-3 border border-gray-300 rounded-lg" required placeholder="Nama Jalan, No Rumah, RT/RW">
                    </div>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Kota <span class="text-red-500">*</span></label>
                            <input type="text" v-model="billingDetails.city" class="w-full p-3 border border-gray-300 rounded-lg" required>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Provinsi <span class="text-red-500">*</span></label>
                            <input type="text" v-model="billingDetails.province" class="w-full p-3 border border-gray-300 rounded-lg" required>
                        </div>
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Kode Pos <span class="text-red-500">*</span></label>
                        <input type="text" v-model="billingDetails.postcode" class="w-full p-3 border border-gray-300 rounded-lg" required>
                    </div>
                </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Catatan Tambahan</label>
              <textarea rows="3" v-model="billingDetails.notes" class="w-full p-3 border border-gray-300 rounded-lg" placeholder="Pesan khusus untuk kurir..."></textarea>
            </div>
          </form>
        </div>

        <div class="w-full lg:w-2/5">
          <div class="bg-white p-6 md:p-8 rounded-2xl shadow-lg space-y-6">
            <h2 class="text-2xl text-black font-semibold">Pesanan Anda</h2>

            <div class="space-y-4 max-h-60 overflow-y-auto pr-2">
              <div v-for="item in cartItems" :key="item.id" class="flex justify-between items-center border-b border-gray-50 pb-3">
                <div class="flex items-center gap-3">
                  <img :src="getFullUrl(item.img)" class="w-14 h-14 rounded-md object-cover border border-gray-200">
                  <div>
                    <span class="font-medium text-gray-800 block truncate w-32">{{ item.name }}</span>
                    <div class="flex items-center gap-2 mt-1">
                        <span class="text-xs text-gray-500">x {{ item.quantity }}</span>
                        <span class="px-1.5 py-0.5 text-[10px] font-bold uppercase rounded"
                            :class="item.transaction_type === 'sewa' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'">
                            {{ item.transaction_type }}
                        </span>
                    </div>
                  </div>
                </div>
                <span class="font-medium text-gray-700 text-sm">Rp {{ (item.price * item.quantity).toLocaleString('id-ID') }}</span>
              </div>
            </div>

            <div class="border-t border-gray-200 pt-4 space-y-2">
                <div class="flex justify-between text-sm text-gray-600">
                    <span>Subtotal</span>
                    <span>Rp {{ cartTotal.toLocaleString('id-ID') }}</span>
                </div>
                <div class="flex justify-between text-sm text-gray-600">
                    <span>Pengiriman</span>
                    <span>Rp 20.000</span>
                </div>
                <div class="flex justify-between items-center pt-2 border-t border-dashed">
                    <span class="text-lg font-semibold text-gray-900">Total</span>
                    <span class="text-xl font-bold text-blue-600">Rp {{ (cartTotal + 20000).toLocaleString('id-ID') }}</span>
                </div>
            </div>

            <div class="border-t border-gray-200 pt-6 space-y-3">
                <h3 class="font-medium text-gray-800">Metode Pembayaran</h3>
                
                <label class="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50" :class="{'border-blue-500 bg-blue-50': selectedPayment === 'bank_transfer'}">
                    <input type="radio" value="bank_transfer" v-model="selectedPayment" class="h-4 w-4 text-blue-600">
                    <span class="ml-3 text-sm font-medium text-gray-700">Bank Transfer (BCA/Mandiri)</span>
                </label>

                <label class="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50" :class="{'border-blue-500 bg-blue-50': selectedPayment === 'qris'}">
                    <input type="radio" value="qris" v-model="selectedPayment" class="h-4 w-4 text-blue-600">
                    <span class="ml-3 text-sm font-medium text-gray-700">QRIS (GoPay/OVO/Dana)</span>
                </label>

                <label class="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50" :class="{'border-blue-500 bg-blue-50': selectedPayment === 'cod'}">
                    <input type="radio" value="cod" v-model="selectedPayment" class="h-4 w-4 text-blue-600">
                    <span class="ml-3 text-sm font-medium text-gray-700">Cash on Delivery (COD)</span>
                </label>
            </div>

            <button 
                @click="submitCheckout" 
                :disabled="isSubmitting"
                class="w-full py-4 px-6 bg-green-600 text-white text-lg font-bold rounded-xl shadow-lg hover:bg-green-700 transition-transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {{ isSubmitting ? 'Memproses...' : 'BUAT PESANAN' }}
            </button>
          </div>
        </div>

      </div>
    </div>
  </section>
</template>
