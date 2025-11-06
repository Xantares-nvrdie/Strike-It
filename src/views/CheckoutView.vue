<script setup>
import { ref } from 'vue';
import { Icon } from '@iconify/vue';

// --- Data Reaktif untuk Form ---
const billingDetails = ref({
  firstName: '',
  lastName: '',
  companyName: '',
  // 1. Field ini sekarang digunakan untuk SEMUA pilihan lokasi
  //    (baik sewa maupun beli pickup)
  location: 'TOKO_JKT', // <-- Saya set default untuk 'beli'
  phone: '',
  email: '',
  notes: '',
  createAccount: false,
  streetAddress: '',
  city: '',
  province: '',
  postcode: '',
});

// --- Data Reaktif untuk Pembayaran ---
const selectedPayment = ref('bank_transfer');

// --- Data 'Pesanan Anda' ---
const order = ref({
  // ==========================================================
  // UBAH INI KE 'sewa' UNTUK MELIHAT FORM LOKASI PENGAMBILAN
  // ==========================================================
  transactionType: 'beli', // <-- Diatur ke 'beli' untuk demo

  items: [
    {
      id: 1,
      name: 'Joran Pancing Predator X87813PP',
      quantity: 1,
      image: 'https://placehold.co/100x100/E2E8F0/4A5568?text=Produk' 
    }
  ],
  total: 'Rp3.000.000,00'
});

// --- State untuk opsi pengiriman (jika 'beli') ---
// Diatur ke 'pickup' untuk demo
const deliveryOption = ref('pickup'); // 'pickup' or 'delivery'

// --- Fungsi untuk Submit ---
const submitCheckout = () => {
  console.log('Billing Details:', billingDetails.value);
  console.log('Payment Method:', selectedPayment.value);
  console.log('Transaction Type:', order.value.transactionType);
  if (order.value.transactionType === 'beli') {
    console.log('Delivery Option:', deliveryOption.value);
  }
};
</script>

<template>
  <section class="min-h-screen w-full bg-gray-100 p-4 md:p-8">
    <div class="max-w-7xl mx-auto">
      
      <h1 class="text-3xl font-bold text-gray-900 mb-6">Checkout</h1>

      <div class="flex flex-col lg:flex-row gap-8 items-start">

        <div class="flex-1 w-full bg-white p-6 md:p-8 rounded-2xl shadow-lg">
          <h2 class="text-2xl font-semibold mb-6">Billing Detail</h2>
          
          <form @submit.prevent="submitCheckout" class="space-y-5">
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label for="firstName" class="block text-sm font-medium text-gray-700 mb-1">
                  Nama Depan <span class="text-red-500">*</span>
                </label>
                <input type="text" id="firstName" v-model="billingDetails.firstName" class="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" required>
              </div>
              <div>
                <label for="lastName" class="block text-sm font-medium text-gray-700 mb-1">
                  Nama Belakang
                </label>
                <input type="text" id="lastName" v-model="billingDetails.lastName" class="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
              </div>
            </div>

            <div>
              <label for="companyName" class="block text-sm font-medium text-gray-700 mb-1">
                Company Name (Opsional)
              </label>
              <input type="text" id="companyName" v-model="billingDetails.companyName" class="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
            </div>

            <div v-if="order.transactionType === 'sewa'">
              <label for="sewaLocation" class="block text-sm font-medium text-gray-700 mb-1">
                Pilih Lokasi Pengambilan (Sewa) <span class="text-red-500">*</span>
              </label>
              <select id="sewaLocation" v-model="billingDetails.location" class="w-full p-3 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="SEWA_INA">Lokasi Sewa Indonesia (INA)</option>
                <option value="SEWA_MYS">Lokasi Sewa Malaysia (MYS)</option>
              </select>
            </div>

            <div v-if="order.transactionType === 'beli'" class="space-y-3">
              <label class="block text-sm font-medium text-gray-700">
                Opsi Pengambilan (Beli) <span class="text-red-500">*</span>
              </label>
              <div class="flex flex-col sm:flex-row gap-4">
                <label class="flex-1 p-4 border rounded-lg cursor-pointer" :class="deliveryOption === 'pickup' ? 'border-blue-500 bg-blue-50' : 'border-gray-300'">
                  <input type="radio" name="delivery" value="pickup" v-model="deliveryOption" class="h-4 w-4 text-blue-600">
                  <span class="ml-2 font-medium text-gray-800">Pickup di Tempat</span>
                </label>
                <label class="flex-1 p-4 border rounded-lg cursor-pointer" :class="deliveryOption === 'delivery' ? 'border-blue-500 bg-blue-50' : 'border-gray-300'">
                  <input type="radio" name="delivery" value="delivery" v-model="deliveryOption" class="h-4 w-4 text-blue-600">
                  <span class="ml-2 font-medium text-gray-800">Pengiriman</span>
                </label>
              </div>
            </div>

            <div v-if="order.transactionType === 'beli' && deliveryOption === 'pickup'">
              <label for="pickupLocation" class="block text-sm font-medium text-gray-700 mb-1">
                Pilih Lokasi Pickup <span class="text-red-500">*</span>
              </label>
              <select id="pickupLocation" v-model="billingDetails.location" class="w-full p-3 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="TOKO_JKT">Toko Jakarta</option>
                <option value="TOKO_BDG">Toko Bandung</option>
                <option value="TOKO_SBY">Toko Surabaya</option>
              </select>
            </div>
            
            <div v-if="order.transactionType === 'beli' && deliveryOption === 'delivery'" class="space-y-5 border-t border-gray-200 pt-5">
              <h3 class="text-lg font-semibold text-gray-900">Alamat Pengiriman</h3>
              <div>
                <label for="streetAddress" class="block text-sm font-medium text-gray-700 mb-1">
                  Alamat Jalan <span class="text-red-500">*</span>
                </label>
                <input type="text" id="streetAddress" v-model="billingDetails.streetAddress" class="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" required>
              </div>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label for="city" class="block text-sm font-medium text-gray-700 mb-1">
                    Kota <span class="text-red-500">*</span>
                  </label>
                  <input type="text" id="city" v-model="billingDetails.city" class="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" required>
                </div>
                <div>
                  <label for="province" class="block text-sm font-medium text-gray-700 mb-1">
                    Provinsi <span class="text-red-500">*</span>
                  </label>
                  <input type="text" id="province" v-model="billingDetails.province" class="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" required>
                </div>
              </div>
              <div>
                <label for="postcode" class="block text-sm font-medium text-gray-700 mb-1">
                  Kode Pos <span class="text-red-500">*</span>
                </label>
                <input type="text" id="postcode" v-model="billingDetails.postcode" class="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" required>
              </div>
            </div>

            <div>
              <label for="phone" class="block text-sm font-medium text-gray-700 mb-1">
                Nomor Kontak <span class="text-red-500">*</span>
              </label>
              <input type="tel" id="phone" v-model="billingDetails.phone" class="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" required>
            </div>

            <div>
              <label for="email" class="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input type="email" id="email" v-model="billingDetails.email" class="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
            </div>

            <div>
              <label for="notes" class="block text-sm font-medium text-gray-700 mb-1">
                Informasi Tambahan
              </label>
              <textarea id="notes" rows="4" v-model="billingDetails.notes" class="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Catatan tentang order anda"></textarea>
            </div>

            <div class="flex items-center">
              <input type="checkbox" id="createAccount" v-model="billingDetails.createAccount" class="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500">
              <label for="createAccount" class="ml-2 block text-sm text-gray-900">
                Create an account?
              </label>
            </div>

          </form>
        </div>

        <div class="w-full lg:w-2/5">
          <div class="bg-white p-6 md:p-8 rounded-2xl shadow-lg space-y-6">
            <h2 class="text-2xl font-semibold">Pesanan Anda</h2>

            <div class="space-y-4">
              <div class="flex justify-between items-center text-sm font-medium text-gray-500 mb-2">
                <span>PRODUK</span>
                <span>SUB TOTAL</span>
              </div>
              
              <div v-for="item in order.items" :key="item.id" class="flex justify-between items-center">
                <div class="flex items-center gap-3">
                  <img :src="item.image" alt="Produk" class="w-14 h-14 rounded-md object-cover">
                  <div>
                    <span class="font-medium text-gray-800">{{ item.name }}</span>
                    <span class="block text-sm text-gray-500">x {{ item.quantity }}</span>
                    
                    <span v-if="order.transactionType === 'sewa'" class="mt-1 inline-block text-xs font-semibold text-green-700 bg-green-100 px-2 py-0.5 rounded">
                      SEWA
                    </span>
                    <span vf-if="order.transactionType === 'beli'" class="mt-1 inline-block text-xs font-semibold text-red-700 bg-red-100 px-2 py-0.5 rounded">
                      BELI
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div classtr="border-t border-gray-200 pt-4 flex justify-between items-center">
              <span class="text-lg font-semibold text-gray-900">Order Total</span>
              <span class="text-xl font-bold text-gray-900">{{ order.total }}</span>
            </div>

            <div class="border-t border-gray-200 pt-6 space-y-4">
              <div class="p-4 rounded-lg" :class="selectedPayment === 'bank_transfer' ? 'bg-gray-50 border border-blue-500' : 'bg-gray-50'">
                <label class="flex items-start cursor-pointer">
                  <input type="radio" name="paymentMethod" value="bank_transfer" v-model="selectedPayment" class="h-5 w-5 text-blue-600 mt-0.5">
                  <div classs="ml-3">
                    <span class="font-semibold text-gray-800 ml-3">Direct Bank Transfer</span>
                    <p class="text-sm text-gray-600 mt-2">
                      Make your payment directly into our bank account...
                    </p>
                  </div>
                </label>
              </div>
              <div class="p-4 rounded-lg" :class="selectedPayment === 'cod' ? 'bg-gray-50 border border-blue-500' : 'bg-gray-50'">
                <label class="flex items-center cursor-pointer">
                  <input type="radio" name="paymentMethod" value="cod" v-model="selectedPayment" class="h-5 w-5 text-blue-600">
                  <span class="ml-3 font-semibold text-gray-800">Cash on Delivery</span>
                </label>
              </div>
              <div class="p-4 rounded-lg" :class="selectedPayment === 'qris' ? 'bg-gray-50 border border-blue-500' : 'bg-gray-50'">
                <label class="flex items-center cursor-pointer">
                  <input type="radio" name="paymentMethod" value="qris" v-model="selectedPayment" class="h-5 w-5 text-blue-600">
                  <span class="ml-3 font-semibold text-gray-800">QRIS</span>
                  <a href="#" class="ml-2 text-xs text-blue-600 hover:underline">(What's QRIS?)</a>
                  <Icon icon="logos:paypal" class="w-14 ml-auto" />
                </label>
              </div>
            </div>

            <button @click="submitCheckout" class="w-full py-4 px-6 bg-green-500 text-white text-lg font-semibold rounded-lg shadow-md hover:bg-green-600 transition-colors">
              PESAN
            </button>
          </div>
        </div>

      </div>
    </div>
  </section>
</template>
