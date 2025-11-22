<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { Icon } from '@iconify/vue';
import { useRoute, useRouter } from 'vue-router';
import api from '@/services/api.js';
import { useToast } from "vue-toastification";
import PaymentMethod from '@/components/Booking/PaymentMethod.vue';

const route = useRoute();
const router = useRouter();
const toast = useToast();

// --- STATE ---
const currentStep = ref(1);
const isSubmitting = ref(false);
const locationData = ref(null);
const userData = ref(null);
const seats = ref([]); 

// Booking Data
const duration = ref(parseInt(route.query.duration) || 2);
const selectedDate = ref(route.query.date || new Date().toISOString().split('T')[0]);
const selectedSeatId = ref(null);
const selectedSeatName = ref('');
const voucherCode = ref('');

// Helper
const baseUrl = 'http://localhost:3000/uploads';
const getToday = () => new Date().toISOString().split('T')[0];
const getFullUrl = (path) => path ? (path.startsWith('http') ? path : `${baseUrl}/${path}`) : 'https://placehold.co/600x400';

// Prices
const pricePerJam = computed(() => locationData.value?.price_per_hour || 0);
const formattedPrice = computed(() => pricePerJam.value.toLocaleString('id-ID'));
const subtotal = computed(() => pricePerJam.value * duration.value);
const taxRate = 0.10;
const tax = computed(() => Math.round(subtotal.value * taxRate));
const grandTotal = computed(() => subtotal.value + tax.value);

// --- FETCH DATA & SEATS ---
const fetchSeatsStatus = async () => {
    if (!locationData.value?.id || !selectedDate.value) return;
    try {
        const res = await api.getLocationSpots(locationData.value.id, selectedDate.value);
        seats.value = res.data; 
    } catch (error) {
        console.error("Gagal load kursi:", error);
        seats.value = []; 
    }
};

watch(selectedDate, () => {
    selectedSeatId.value = null;
    fetchSeatsStatus();
});

onMounted(async () => {
    const locId = route.params.id;
    if (!locId) { router.push('/location'); return; }

    try {
        // 1. Ambil Detail Lokasi
        const locRes = await api.getLocationDetail(locId);
        const loc = locRes.data;
        locationData.value = { ...loc, imageUrl: getFullUrl(loc.img) };

        // 2. Ambil Data User
        const userRes = await api.getMyProfile();
        userData.value = userRes.data;

        // 3. Load Status Kursi
        await fetchSeatsStatus();

    } catch (error) {
        toast.error("Gagal memuat data.");
    }
});

// --- LOGIC ---
const goToStep = (step) => currentStep.value = step;
const resetFlow = () => router.push('/location');

const handleStep1Submit = () => {
    if (!userData.value) return toast.error("Data user belum siap.");
    goToStep(2);
};

const selectSeat = (seat) => {
    if (seat.status === 'occupied') {
        toast.warning("Kursi ini sudah dipesan.");
        return;
    }
    if (selectedSeatId.value === seat.id) {
        selectedSeatId.value = null;
        selectedSeatName.value = '';
    } else {
        selectedSeatId.value = seat.id;
        selectedSeatName.value = seat.name;
    }
};

const handleStep2Submit = () => {
    if (!selectedSeatId.value) return toast.warning('Silakan pilih kursi terlebih dahulu.');
    goToStep(3);
};

const handlePayment = async () => {
    if (isSubmitting.value) return;
    isSubmitting.value = true;

    try {
        const payload = {
            id_location: locationData.value.id,
            booking_date: selectedDate.value,
            booking_start: `${selectedDate.value} 10:00:00`, 
            duration: duration.value,
            total_price: grandTotal.value,
            spot_number: selectedSeatName.value,
            first_name: userData.value.name.split(' ')[0],
            last_name: userData.value.name.split(' ').slice(1).join(' ') || '',
            email: userData.value.email,
            phone: '08123456789'
        };

        const response = await api.createBooking(payload);
        toast.success(`Booking Berhasil! Invoice: ${response.data.invoice}`);
        router.push('/history');

    } catch (error) {
        toast.error(error.response?.data?.message || "Gagal membuat booking.");
    } finally {
        isSubmitting.value = false;
    }
};

// --- UI HELPERS ---
function increaseDuration() { duration.value++; }
function decreaseDuration() { if (duration.value > 1) duration.value--; }

const topSeats = computed(() => seats.value.filter(s => s.name.startsWith('T')));
const bottomSeats = computed(() => seats.value.filter(s => s.name.startsWith('B')));
const leftSeats = computed(() => seats.value.filter(s => s.name.startsWith('L')));
const rightSeats = computed(() => seats.value.filter(s => s.name.startsWith('R')));

const getSeatClass = (seat) => {
    if (seat.status === 'occupied') return 'bg-red-500 text-white cursor-not-allowed border-red-600';
    if (selectedSeatId.value === seat.id) return 'bg-blue-600 text-white border-blue-700';
    return 'bg-white border border-gray-300 hover:bg-gray-100';
};

const getStepClass = (step) => {
    if (step < currentStep.value) return 'bg-green-500 text-white';
    if (step === currentStep.value) return 'bg-blue-600 text-white';
    return 'bg-gray-200 text-gray-500';
};
</script>

<template>
  <div class="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
    <div class="flex flex-col items-center">

      <div class="flex items-center justify-center w-full max-w-xl mb-12">
        <div class="flex items-center">
          <div :class="getStepClass(1)" class="w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold transition-all">
            <Icon v-if="currentStep > 1" icon="mdi:check" class="w-6 h-6" />
            <span v-else>1</span>
          </div>
        </div>
        <div class="flex-auto border-t-2 transition-all duration-500" :class="currentStep > 1 ? 'border-green-500' : 'border-gray-200'"></div>
        <div class="flex items-center">
          <div :class="getStepClass(2)" class="w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold transition-all">
            <Icon v-if="currentStep > 2" icon="mdi:check" class="w-6 h-6" />
            <span v-else>2</span>
          </div>
        </div>
        <div class="flex-auto border-t-2 transition-all duration-500" :class="currentStep > 2 ? 'border-green-500' : 'border-gray-200'"></div>
        <div class="flex items-center">
          <div :class="getStepClass(3)" class="w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold transition-all">
            <span>3</span>
          </div>
        </div>
      </div>

      <div class="w-full flex justify-center">

        <div v-if="currentStep === 1 && locationData" class="bg-zinc-100 border-white shadow-md border-4 rounded-[2rem] p-8 w-full max-w-4xl">
          <h2 class="text-2xl font-semibold text-center text-gray-800 mb-2">Informasi Booking</h2>
          <p class="text-center text-gray-500 mb-8">Pastikan detail pesanan Anda benar</p>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div class="bg-[#eeeeee] border-4 border-white rounded-2xl overflow-hidden shadow flex flex-col">
              <img :src="locationData.imageUrl" class="w-full h-64 object-cover">
              <div class="p-6 bg-transparent flex-1">
                <h3 class="text-xl text-black font-semibold mb-2">{{ locationData.name }}</h3>
                <p class="text-gray-600 mb-4">{{ locationData.city }}</p>
                <p class="text-2xl font-bold text-blue-600">Rp. {{ formattedPrice }}<span class="text-lg font-normal text-gray-500"> / jam</span></p>
                
                <div class="mt-6 space-y-3">
                    <label class="font-medium text-gray-700">Durasi Booking</label>
                    <div class="flex justify-between items-center bg-gray-100 rounded-lg p-2">
                        <button @click="decreaseDuration" class="size-10 bg-red-500 text-white rounded-full text-2xl font-bold disabled:bg-gray-300" :disabled="duration <= 1">-</button>
                        <span class="text-xl font-bold text-gray-900">{{ duration }} jam</span>
                        <button @click="increaseDuration" class="size-10 bg-green-500 text-white rounded-full text-2xl font-bold">+</button>
                    </div>
                </div>
                <div class="space-y-3 mt-4">
                    <label class="font-medium text-gray-700">Pilih Tanggal</label>
                    <input type="date" v-model="selectedDate" :min="getToday()" class="w-full bg-gray-100 rounded-lg p-3 font-medium text-gray-900 border-none outline-none" />
                </div>
              </div>
            </div>

            <form @submit.prevent="handleStep1Submit" class="flex flex-col h-full">
              <div class="bg-[#eeeeee] border-4 border-white rounded-2xl space-y-6 p-6 mb-6 flex-1">
                <div class="p-4 bg-blue-50 border border-blue-200 rounded-lg text-blue-800 text-sm mb-4 flex items-start gap-2">
                    <Icon icon="mdi:information" class="size-5 shrink-0 mt-0.5"/>
                    <span>Data diri diambil otomatis dari akun Anda.</span>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700">Nama Lengkap</label>
                  <input :value="userData?.name" disabled class="mt-1 block w-full px-4 py-3 border border-gray-300 bg-gray-100 text-gray-500 rounded-lg cursor-not-allowed">
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700">Email</label>
                  <input :value="userData?.email" disabled class="mt-1 block w-full px-4 py-3 border border-gray-300 bg-gray-100 text-gray-500 rounded-lg cursor-not-allowed">
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700">Nomor Telp</label>
                  <input type="tel" value="08123456789" class="mt-1 block w-full px-4 py-3 border border-gray-300 text-black rounded-lg focus:ring-blue-500 focus:border-blue-500">
                </div>
              </div>
              <div class="mt-auto flex flex-col space-y-3">
                <button type="submit" class="w-full bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg hover:bg-blue-700 transition duration-300">Lanjut Pilih Kursi</button>
                <button type="button" @click="resetFlow" class="w-full bg-red-500 text-white font-semibold py-3 px-6 rounded-lg hover:bg-red-600 transition duration-300">Batalkan</button>
              </div>
            </form>
          </div>
        </div>

        <div v-if="currentStep === 1 && !locationData" class="text-center py-20">
            <div class="animate-spin rounded-full h-10 w-10 border-t-2 border-blue-600 mx-auto"></div>
            <p class="mt-4 text-gray-600">Memuat data...</p>
        </div>

        <div v-if="currentStep === 2" class="bg-zinc-100 border-white shadow-md border-4 rounded-[2rem] p-8 w-full max-w-4xl">
          <h2 class="text-2xl font-semibold text-center text-gray-800 mb-2">Pilih Kursi</h2>
          <p class="text-center text-gray-500 mb-8">Silakan pilih spot memancing yang tersedia</p>

          <div class="flex flex-col items-center w-full">
            <div class="flex flex-wrap justify-center gap-1 sm:gap-2 mb-2">
              <div v-for="seat in topSeats" :key="seat.id" @click="selectSeat(seat)" :class="getSeatClass(seat)"
                class="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded-lg shadow cursor-pointer transition-all">
                <Icon icon="mdi:storefront" class="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
            </div>

            <div class="flex justify-between w-full px-2 sm:px-4">
              <div class="flex flex-col gap-1 sm:gap-2">
                <div v-for="seat in leftSeats" :key="seat.id" @click="selectSeat(seat)" :class="getSeatClass(seat)"
                  class="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded-lg shadow cursor-pointer transition-all">
                  <Icon icon="mdi:storefront" class="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
              </div>
              <div class="border-4 border-gray-300 rounded-lg w-2/3 h-32 sm:h-48 flex items-center justify-center bg-blue-50 text-blue-500 text-base sm:text-xl font-semibold text-center">
                Area Pemancingan
              </div>
              <div class="flex flex-col gap-1 sm:gap-2">
                <div v-for="seat in rightSeats" :key="seat.id" @click="selectSeat(seat)" :class="getSeatClass(seat)"
                  class="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded-lg shadow cursor-pointer transition-all">
                  <Icon icon="mdi:storefront" class="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
              </div>
            </div>

            <div class="flex flex-wrap justify-center gap-1 sm:gap-2 mt-2">
              <div v-for="seat in bottomSeats" :key="seat.id" @click="selectSeat(seat)" :class="getSeatClass(seat)"
                class="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded-lg shadow cursor-pointer transition-all">
                <Icon icon="mdi:storefront" class="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
            </div>
          </div>

          <div class="flex flex-col items-center space-y-4 sm:flex-row sm:space-y-0 sm:justify-center sm:space-x-6 mt-8">
            <div class="flex items-center space-x-2"><div class="w-6 h-6 rounded bg-blue-600 border border-blue-700"></div><span class="text-gray-800">Dipilih: {{ selectedSeatName || '-' }}</span></div>
            <div class="flex items-center space-x-2"><div class="w-6 h-6 rounded bg-white border border-gray-300"></div><span class="text-gray-800">Tersedia</span></div>
            <div class="flex items-center space-x-2"><div class="w-6 h-6 rounded bg-red-500 border border-red-600"></div><span class="text-gray-800">Tidak Tersedia</span></div>
          </div>

          <div class="mt-8 flex flex-col-reverse sm:flex-row sm:justify-between gap-3">
            <button @click="goToStep(1)" class="bg-gray-300 text-gray-800 font-semibold py-3 px-8 rounded-lg hover:bg-gray-400 transition duration-300">Kembali</button>
            <button @click="handleStep2Submit" class="bg-blue-600 text-white font-semibold py-3 px-8 rounded-lg hover:bg-blue-700 transition duration-300">Selanjutnya</button>
          </div>
        </div>

        <div v-if="currentStep === 3" class="w-full max-w-5xl">
          <h2 class="text-3xl font-semibold text-center text-gray-800 mb-8">Pembayaran</h2>
          <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div class="lg:col-span-2 space-y-8">
                <PaymentMethod /> 
                <div class="bg-zinc-100 border-white shadow-md border-4 rounded-[2rem] p-4 sm:p-8 w-full max-w-4xl">
                    <h3 class="text-xl text-black font-semibold mb-4">Voucher Booking</h3>
                    <div class="flex flex-col sm:flex-row gap-3 sm:gap-4">
                        <input v-model="voucherCode" type="text" class="flex-grow px-4 py-3 border border-gray-300 rounded-lg text-black focus:outline-none focus:ring-blue-500 focus:border-blue-500" placeholder="Masukkan kode anda disini">
                        <button class="bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg hover:bg-blue-700 transition duration-300 w-full sm:w-auto">Konfirmasi</button>
                    </div>
                </div>
            </div>

            <div class="lg:col-span-1">
              <div class="bg-zinc-100 border-white shadow-md border-4 rounded-[2rem] p-4 sm:p-8 w-full max-w-4xl">
                <h3 class="text-xl font-semibold mb-6 border-b pb-4">Detail Pembayaran</h3>
                <div class="space-y-4">
                  <div class="flex justify-between"><span class="text-gray-600">Spot</span><span class="font-medium text-gray-800">{{ selectedSeatName }}</span></div>
                  <div class="flex justify-between"><span class="text-gray-600">Subtotal</span><span class="font-medium text-gray-800">Rp. {{ subtotal.toLocaleString('id-ID') }}</span></div>
                  <div class="flex justify-between"><span class="text-gray-600">Pajak (10%)</span><span class="font-medium text-gray-800">Rp. {{ tax.toLocaleString('id-ID') }}</span></div>
                  <div class="border-t border-dashed my-4"></div>
                  <div class="flex justify-between text-lg font-semibold"><span>Grand Total</span><span>Rp. {{ grandTotal.toLocaleString('id-ID') }}</span></div>
                </div>
                <button @click="handlePayment" :disabled="isSubmitting" class="w-full bg-green-500 text-white font-bold py-3 px-6 rounded-lg hover:bg-green-700 transition duration-300 mt-6 disabled:opacity-50">
                  {{ isSubmitting ? 'Memproses...' : `Bayar Rp. ${grandTotal.toLocaleString('id-ID')}` }}
                </button>
                <button @click="goToStep(2)" class="w-full bg-gray-200 text-gray-700 font-semibold py-3 px-6 rounded-lg hover:bg-gray-300 transition duration-300 mt-3">Kembali</button>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>
