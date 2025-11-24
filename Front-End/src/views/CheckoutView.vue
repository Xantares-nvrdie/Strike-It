<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { Icon } from '@iconify/vue';
import api from '@/services/api.js';
import { useToast } from "vue-toastification";

const router = useRouter();
const toast = useToast();
const baseUrl = 'http://localhost:3000/uploads';

// --- STATE ---
const cartItems = ref([]);
const paymentMethods = ref([]); // State untuk menampung data dari Database
const isLoadingPayment = ref(false);
const isSubmitting = ref(false);
const selectedPayment = ref(null); // Menyimpan ID payment method yang dipilih

// Form Data
const billingDetails = ref({
  fullName: '',
  phone: '',
  email: '',
  address: '',
  city: '',
  province: '',
  postcode: '',
  notes: ''
});

// Diskon State
const voucherCode = ref('');
const discountAmount = ref(0);
const isVoucherApplied = ref(false);

// Fetch data
const loadData = async () => {
    try {
        // 1. Cek Keranjang
        const cartRes = await api.getCart();
        if (cartRes.data.length === 0) {
            toast.info("Keranjang kosong, silakan belanja dulu.");
            router.push('/shop');
            return;
        }
        cartItems.value = cartRes.data;

        // 2. Auto-fill Data User
        const userRes = await api.getMyProfile();
        const u = userRes.data;
        billingDetails.value.fullName = u.name;
        billingDetails.value.email = u.email;
        billingDetails.value.phone = '08123456789'; 
        billingDetails.value.address = u.address || '';

        // 3. Ambil Metode Pembayaran dari Database
        fetchPaymentMethods();

    } catch (error) {
        console.error(error);
        toast.error("Gagal memuat data checkout.");
    }
};

const fetchPaymentMethods = async () => {
    isLoadingPayment.value = true;
    try {
        const res = await api.getPaymentMethods();
        paymentMethods.value = res.data;
        
        // Auto-select metode pertama jika ada
        if (paymentMethods.value.length > 0) {
            selectedPayment.value = paymentMethods.value[0].id;
        }
    } catch (error) {
        console.error("Gagal load payment methods:", error);
    } finally {
        isLoadingPayment.value = false;
    }
};

onMounted(() => {
    loadData();
});

const cartTotal = computed(() => {
    return cartItems.value.reduce((sum, item) => sum + (Number(item.price) * item.quantity), 0);
});

const shippingCost = 20000; 

const grandTotal = computed(() => {
    const total = cartTotal.value + shippingCost - discountAmount.value;
    return total > 0 ? total : 0;
});

const getFullUrl = (path) => path ? (path.startsWith('http') ? path : `${baseUrl}/${path}`) : 'https://placehold.co/100';

const applyVoucher = async () => {
    if (!voucherCode.value) {
        toast.warning("Masukkan kode voucher!");
        return;
    }

    try {
        const res = await api.checkVoucher(voucherCode.value);
        
        if (res.data.valid) {
            const valStr = res.data.discount_value;
            
            if (valStr.includes('%')) {
                const percent = parseInt(valStr.replace('%', ''));
                discountAmount.value = cartTotal.value * (percent / 100);
            } else {
                discountAmount.value = parseInt(valStr);
            }

            isVoucherApplied.value = true;
            toast.success(`Voucher berhasil! Hemat Rp ${discountAmount.value.toLocaleString('id-ID')}`);
        }
    } catch (error) {
        discountAmount.value = 0;
        isVoucherApplied.value = false;
        toast.error(error.response?.data?.message || "Kode voucher tidak valid.");
    }
};

const submitCheckout = async () => {
    if (isSubmitting.value) return;
    
    // Validasi Payment
    if (!selectedPayment.value) {
        toast.warning("Silakan pilih metode pembayaran!");
        return;
    }
    
    // Validasi Form
    if (!billingDetails.value.address || !billingDetails.value.city || !billingDetails.value.phone) {
        toast.warning("Mohon lengkapi alamat dan nomor HP.");
        return;
    }

    isSubmitting.value = true;
    try {
        const fullAddress = `${billingDetails.value.address}, ${billingDetails.value.city}, ${billingDetails.value.province} ${billingDetails.value.postcode}`;

        const payload = {
            shipping_address: fullAddress,
            payment_method: selectedPayment.value, 
            notes: billingDetails.value.notes,
            shipping_cost: shippingCost,
            tax_amount: 0,
            discount_amount: discountAmount.value
        };

        const res = await api.createOrder(payload);
        
        toast.success(`Pesanan Berhasil! No: ${res.data.order_number}`);
        router.push('/history'); 

    } catch (error) {
        console.error(error);
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

        <!-- Form checkout -->
        <div class="flex-1 w-full text-black bg-white p-6 md:p-8 rounded-2xl shadow-lg">
          <h2 class="text-2xl font-semibold mb-6">Alamat Pengiriman</h2>
          
          <form @submit.prevent="submitCheckout" class="space-y-5">
            
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Nama Lengkap</label>
                <input type="text" v-model="billingDetails.fullName" class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none" placeholder="Nama Penerima">
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input type="email" v-model="billingDetails.email" class="w-full p-3 border border-gray-300 rounded-lg bg-gray-50" readonly>
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Nomor HP <span class="text-red-500">*</span></label>
                    <input type="tel" v-model="billingDetails.phone" class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none" required>
                </div>
            </div>

            <!-- Detail lokasi -->
            <div class="pt-4 border-t border-gray-100">
                <h3 class="text-lg font-medium text-gray-900 mb-3">Detail Lokasi</h3>
                <div class="space-y-4">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Alamat Jalan <span class="text-red-500">*</span></label>
                        <input type="text" v-model="billingDetails.address" class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none" required placeholder="Nama Jalan, No Rumah, RT/RW">
                    </div>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Kota <span class="text-red-500">*</span></label>
                            <input type="text" v-model="billingDetails.city" class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none" required>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Provinsi <span class="text-red-500">*</span></label>
                            <input type="text" v-model="billingDetails.province" class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none" required>
                        </div>
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Kode Pos <span class="text-red-500">*</span></label>
                        <input type="text" v-model="billingDetails.postcode" class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none" required>
                    </div>
                </div>
            </div>

            <!-- Catatan tambahan -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Catatan Tambahan</label>
              <textarea rows="3" v-model="billingDetails.notes" class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none" placeholder="Pesan khusus untuk kurir..."></textarea>
            </div>
          </form>
        </div>

        <div class="w-full lg:w-2/5 space-y-6">
          
        <!-- Ringkasan pesanan -->
          <div class="bg-white p-6 md:p-8 rounded-2xl shadow-lg space-y-6 sticky top-24">
            <h2 class="text-2xl text-black font-semibold">Pesanan Anda</h2>

            <div class="space-y-4 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
              <div v-for="item in cartItems" :key="item.id" class="flex justify-between items-center border-b border-gray-50 pb-3">
                <div class="flex items-center gap-3">
                  <img :src="getFullUrl(item.img)" class="w-14 h-14 rounded-md object-cover border border-gray-200 bg-gray-50">
                  <div>
                    <span class="font-medium text-gray-800 block truncate w-40 sm:w-32" :title="item.name">{{ item.name }}</span>
                    <span class="text-xs text-gray-500">x {{ item.quantity }}</span>
                  </div>
                </div>
                <span class="font-medium text-gray-700 text-sm">Rp {{ (item.price * item.quantity).toLocaleString('id-ID') }}</span>
              </div>
            </div>

            <!-- Kode voucher -->
            <div class="bg-gray-50 p-4 rounded-xl border border-gray-200">
                <label class="text-sm font-medium text-gray-700 mb-2 block">Kode Voucher</label>
                <div class="flex gap-2">
                    <input 
                        type="text" 
                        v-model="voucherCode"
                        :disabled="isVoucherApplied"
                        placeholder="Masukkan kode" 
                        class="flex-1 px-3 text-gray-800 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none disabled:bg-gray-100 uppercase"
                    >
                    <button 
                        @click="applyVoucher"
                        :disabled="isVoucherApplied"
                        class="px-4 py-2 bg-blue-600 text-white text-sm font-bold rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
                    >
                        {{ isVoucherApplied ? 'Terpakai' : 'Pakai' }}
                    </button>
                </div>
            </div>

            <!-- Pentotalan -->
            <div class="border-t border-gray-200 pt-4 space-y-2">
                <div class="flex justify-between text-sm text-gray-600">
                    <span>Subtotal</span>
                    <span>Rp {{ cartTotal.toLocaleString('id-ID') }}</span>
                </div>
                <div class="flex justify-between text-sm text-gray-600">
                    <span>Pengiriman (Flat)</span>
                    <span>Rp {{ shippingCost.toLocaleString('id-ID') }}</span>
                </div>
                
                <div v-if="discountAmount > 0" class="flex justify-between text-sm text-green-600 font-medium">
                    <span>Diskon Voucher</span>
                    <span>- Rp {{ discountAmount.toLocaleString('id-ID') }}</span>
                </div>

                <div class="flex justify-between items-center pt-2 border-t border-dashed mt-2">
                    <span class="text-lg font-semibold text-gray-900">Total</span>
                    <span class="text-xl font-bold text-blue-600">Rp {{ grandTotal.toLocaleString('id-ID') }}</span>
                </div>
            </div>

            <!-- Payment Method -->
            <div class="border-t border-gray-200 pt-6 space-y-3">
                <h3 class="font-medium text-gray-800">Metode Pembayaran</h3>
                
                <div v-if="isLoadingPayment" class="text-sm text-gray-500 animate-pulse">
                    Memuat metode pembayaran...
                </div>

                <label 
                    v-for="method in paymentMethods" 
                    :key="method.id"
                    class="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-blue-50 transition-colors" 
                    :class="{'border-blue-500 bg-blue-50': selectedPayment === method.id}"
                >
                    <input 
                        type="radio" 
                        :value="method.id" 
                        v-model="selectedPayment" 
                        class="h-4 w-4 text-blue-600"
                    >
                    <span class="ml-3 text-sm font-medium text-gray-700">{{ method.name }}</span>
                </label>

                <div v-if="!isLoadingPayment && paymentMethods.length === 0" class="text-red-500 text-xs">
                    Tidak ada metode pembayaran tersedia.
                </div>
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

<style scoped>
/* Custom Scrollbar untuk list item */
.custom-scrollbar::-webkit-scrollbar {
    width: 6px;
}
.custom-scrollbar::-webkit-scrollbar-track {
    background: #f1f1f1; 
}
.custom-scrollbar::-webkit-scrollbar-thumb {
    background: #cbd5e1; 
    border-radius: 10px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background: #94a3b8; 
}
</style>
