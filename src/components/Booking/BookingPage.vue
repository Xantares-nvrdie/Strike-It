<script setup>
import { ref, computed } from 'vue';
import { Icon } from '@iconify/vue';

const currentStep = ref(1);

const formDataStep1 = ref({
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
});

const seats = ref([
  { id: 'T1', status: 'available' }, { id: 'T2', status: 'available' }, { id: 'T3', status: 'occupied' },
  { id: 'T4', status: 'available' }, { id: 'T5', status: 'available' }, { id: 'T6', status: 'available' },
  { id: 'T7', status: 'occupied' }, { id: 'T8', status: 'available' }, { id: 'T9', status: 'available' },
  { id: 'B1', status: 'available' }, { id: 'B2', status: 'available' }, { id: 'B3', status: 'available' },
  { id: 'B4', status: 'available' }, { id: 'B5', status: 'occupied' }, { id: 'B6', status: 'available' },
  { id: 'B7', status: 'available' }, { id: 'B8', status: 'available' }, { id: 'B9', status: 'available' },
  { id: 'L1', status: 'available' }, { id: 'L2', status: 'available' }, { id: 'L3', status: 'available' },
  { id: 'R1', status: 'available' }, { id: 'R2', status: 'occupied' }, { id: 'R3', status: 'available' },
]);

const selectedSeatId = ref(null);

const paymentMethod = ref('creditCard');
const voucherCode = ref('');

const finalBookingData = ref({
  userInfo: null,
  selectedSeat: null,
});

const topSeats = computed(() => seats.value.filter(s => s.id.startsWith('T')));
const bottomSeats = computed(() => seats.value.filter(s => s.id.startsWith('B')));
const leftSeats = computed(() => seats.value.filter(s => s.id.startsWith('L')));
const rightSeats = computed(() => seats.value.filter(s => s.id.startsWith('R')));

const subtotal = computed(() => 30000);
const tax = computed(() => 3000);
const discount = computed(() => 0);
const grandTotal = computed(() => subtotal.value + tax.value - discount.value);

const goToStep = (step) => {
  currentStep.value = step;
};

const resetFlow = () => {
  currentStep.value = 1;
  formDataStep1.value = { firstName: '', lastName: '', email: '', phone: '' };
  selectedSeatId.value = null;
  paymentMethod.value = 'creditCard';
  finalBookingData.value = { userInfo: null, selectedSeat: null };
};

const handleStep1Submit = () => {
  finalBookingData.value.userInfo = { ...formDataStep1.value };
  goToStep(2);
};

const getSeatClass = (seat) => {
  if (seat.status === 'occupied') {
    return 'bg-red-500 text-white cursor-not-allowed';
  }
  if (selectedSeatId.value === seat.id) {
    return 'bg-blue-600 text-white';
  }
  return 'bg-white border border-gray-300 hover:bg-gray-100';
};

const selectSeat = (seat) => {
  if (seat.status !== 'occupied') {
    selectedSeatId.value = (selectedSeatId.value === seat.id) ? null : seat.id;
  }
};

const handleStep2Submit = () => {
  if (selectedSeatId.value) {
    finalBookingData.value.selectedSeat = selectedSeatId.value;
    goToStep(3);
  } else {
    alert('Silakan pilih kursi terlebih dahulu.');
  }
};

const handlePayment = () => {
  alert('Pembayaran Berhasil! Data Booking: ' + JSON.stringify(finalBookingData.value));
  resetFlow();
};

const getStepClass = (step) => {
  if (step < currentStep.value) {
    return 'bg-green-500 text-white';
  } else if (step === currentStep.value) {
    return 'bg-blue-600 text-white';
  } else {
    return 'bg-gray-200 text-gray-500';
  }
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
        
        <div v-if="currentStep === 1" class="bg-[#eeeeee] border-4 border-white rounded-2xl p-8 shadow-lg w-full max-w-4xl">
          <h2 class="text-2xl font-semibold text-center text-gray-800 mb-2">Informasi Booking</h2>
          <p class="text-center text-gray-500 mb-8">Isi detail informasi di bawah ini</p>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div class="bg-[#eeeeee] border-4 border-white rounded-2xl overflow-hidden shadow">
              <img src="../../assets/locationimg/jakarta.jpg" alt="Lokasi Strike It" class="w-full h-64 object-cover">
              <div class="p-6 bg-transparent">
                <h3 class="text-xl text-black font-semibold mb-2">Strike it</h3>
                <p class="text-gray-600 mb-4">Jakarta, Indonesia</p>
                <p class="text-2xl font-bold text-blue-600">Rp. 15.000,00 <span class="text-lg font-normal text-gray-500">per 1 jam</span></p>
              </div>
            </div>

            <form @submit.prevent="handleStep1Submit">
              <div class="bg-[#eeeeee] border-4 border-white rounded-2xl space-y-6 col-span-1 p-6 mb-6">
                <div>
                  <label for="firstName" class="block text-sm font-medium text-gray-700">Nama Depan</label>
                  <input v-model="formDataStep1.firstName" type="text" id="firstName" class="mt-1 block w-full px-4 py-3 border border-gray-300 text-black rounded-lg focus:outline-none focus:ring-blue-500 focus:border-blue-500" placeholder="Isi disini ...">
                </div>
                <div>
                  <label for="lastName" class="block text-sm font-medium text-gray-700">Nama Belakang</label>
                  <input v-model="formDataStep1.lastName" type="text" id="lastName" class="mt-1 block w-full px-4 py-3 border border-gray-300 text-black rounded-lg focus:outline-none focus:ring-blue-500 focus:border-blue-500" placeholder="Isi disini ...">
                </div>
                <div>
                  <label for="email" class="block text-sm font-medium text-gray-700">Email</label>
                  <input v-model="formDataStep1.email" type="email" id="email" class="mt-1 block w-full px-4 py-3 border border-gray-300 text-black rounded-lg focus:outline-none focus:ring-blue-500 focus:border-blue-500" placeholder="Isi disini ...">
                </div>
                <div>
                  <label for="phone" class="block text-sm font-medium text-gray-700">Nomor Telp</label>
                  <input v-model="formDataStep1.phone" type="tel" id="phone" class="mt-1 block w-full px-4 py-3 border border-gray-300 text-black rounded-lg focus:outline-none focus:ring-blue-500 focus:border-blue-500" placeholder="Isi disini ...">
                </div>
              </div>
              
              <div class="mt-8 flex flex-col space-y-3">
                <button type="submit" class="w-full bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg hover:bg-blue-700 transition duration-300">
                  Lanjutkan Pembayaran
                </button>
                <button type="button" @click="resetFlow" class="w-full bg-red-500 text-white font-semibold py-3 px-6 rounded-lg hover:bg-red-600 transition duration-300">
                  Batalkan
                </button>
              </div>
            </form>
          </div>
        </div>

        <div v-if="currentStep === 2" class="bg-[#eeeeee] border-4 border-white rounded-2xl p-8 shadow-lg w-full max-w-4xl">
          <h2 class="text-2xl font-semibold text-center text-gray-800 mb-2">Pilih Kursi</h2>
          <p class="text-center text-gray-500 mb-8">Kindly follow the instructions below</p>

          <div class="flex flex-col items-center">
            <div class="flex space-x-2 mb-2">
              <div v-for="seat in topSeats" :key="seat.id" 
                   @click="selectSeat(seat)"
                   :class="getSeatClass(seat)"
                   class="w-10 h-10 flex items-center justify-center rounded-lg shadow cursor-pointer transition-all">
                <Icon icon="mdi:storefront" class="w-6 h-6" />
              </div>
            </div>

            <div class="flex justify-between w-full px-4">
              <div class="flex flex-col space-y-2">
                <div v-for="seat in leftSeats" :key="seat.id" 
                     @click="selectSeat(seat)"
                     :class="getSeatClass(seat)"
                     class="w-10 h-10 flex items-center justify-center rounded-lg shadow cursor-pointer transition-all">
                  <Icon icon="mdi:storefront" class="w-6 h-6" />
                </div>
              </div>

              <div class="border-4 border-gray-300 rounded-lg w-3/4 h-48 flex items-center justify-center text-gray-500 text-xl font-semibold">
                Area Pemancingan
              </div>

              <div class="flex flex-col space-y-2">
                <div v-for="seat in rightSeats" :key="seat.id" 
                     @click="selectSeat(seat)"
                     :class="getSeatClass(seat)"
                     class="w-10 h-10 flex items-center justify-center rounded-lg shadow cursor-pointer transition-all">
                  <Icon icon="mdi:storefront" class="w-6 h-6" />
                </div>
              </div>
            </div>
            
            <div class="flex space-x-2 mt-2">
              <div v-for="seat in bottomSeats" :key="seat.id" 
                   @click="selectSeat(seat)"
                   :class="getSeatClass(seat)"
                   class="w-10 h-10 flex items-center justify-center rounded-lg shadow cursor-pointer transition-all">
                <Icon icon="mdi:storefront" class="w-6 h-6" />
              </div>
            </div>
          </div>

          <div class="flex justify-center space-x-6 mt-8">
            <div class="flex items-center space-x-2">
              <div class="w-10 h-10 flex items-center justify-center rounded-lg bg-blue-600 text-white"><Icon icon="mdi:storefront" class="w-6 h-6" /></div>
              <span class="text-gray-700">Dipilih</span>
            </div>
            <div class="flex items-center space-x-2">
              <div class="w-10 h-10 flex items-center justify-center rounded-lg bg-white border border-gray-300"><Icon icon="mdi:storefront" class="w-6 h-6" /></div>
              <span class="text-gray-700">Tersedia</span>
            </div>
            <div class="flex items-center space-x-2">
              <div class="w-10 h-10 flex items-center justify-center rounded-lg bg-red-500 text-white"><Icon icon="mdi:storefront" class="w-6 h-6" /></div>
              <span class="text-gray-700">Terisi</span>
            </div>
          </div>

          <div class="mt-8 flex justify-between">
            <button @click="goToStep(1)" class="bg-gray-300 text-gray-800 font-semibold py-3 px-8 rounded-lg hover:bg-gray-400 transition duration-300">
              Kembali
            </button>
            <button @click="handleStep2Submit" class="bg-blue-600 text-white font-semibold py-3 px-8 rounded-lg hover:bg-blue-700 transition duration-300">
              Selanjutnya
            </button>
          </div>
        </div>

        <div v-if="currentStep === 3" class="w-full max-w-5xl">
          <h2 class="text-3xl font-semibold text-center text-gray-800 mb-8">Pembayaran</h2>

          <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            <div class="lg:col-span-2 space-y-8">
              <div class="bg-[#eeeeee] border-4 border-white rounded-2xl p-6 shadow-lg">
                <h3 class="text-xl font-semibold mb-6">Metode Pembayaran</h3>
                <div class="space-y-4">
                  <label class="flex items-center p-4 border rounded-lg cursor-pointer" :class="{'border-blue-500 ring-2 ring-blue-500': paymentMethod === 'creditCard'}">
                    <input type="radio" v-model="paymentMethod" value="creditCard" class="form-radio text-blue-600">
                    <span class="ml-4 text-lg font-medium text-gray-800">Kartu Kredit</span>
                    <div class="ml-auto flex space-x-2">
                      <img src="https://upload.wikimedia.org/wikipedia/commons/a/a4/Visa_Inc._logo.svg" alt="Visa" class="h-6">
                      <img src="https://upload.wikimedia.org/wikipedia/commons/b/b7/MasterCard_Logo.svg" alt="Mastercard" class="h-6">
                    </div>
                  </label>
                  
                  <div v-if="paymentMethod === 'creditCard'" class="pl-8 space-y-4 pt-4">
                    <div>
                      <label class="block text-sm font-medium text-gray-700">Nomor Kartu</label>
                      <input type="text" class="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg text-black focus:outline-none focus:ring-blue-500 focus:border-blue-500" placeholder="0000 0000 0000 0000">
                    </div>
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div class="md:col-span-2">
                        <label class="block text-sm font-medium text-gray-700">Nama Dalam Kartu</label>
                        <input type="text" class="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg text-black focus:outline-none focus:ring-blue-500 focus:border-blue-500" placeholder="Nama Anda">
                      </div>
                      <div>
                        <label class="block text-sm font-medium text-gray-700">Tanggal Kadaluarsa (BB/TT)</label>
                        <input type="text" class="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg text-black focus:outline-none focus:ring-blue-500 focus:border-blue-500" placeholder="MM/YY">
                      </div>
                      <div>
                        <label class="block text-sm font-medium text-gray-700">Kode Keamanan</label>
                        <input type="text" class="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg text-black focus:outline-none focus:ring-blue-500 focus:border-blue-500" placeholder="CVC">
                      </div>
                    </div>
                  </div>

                  <label class="flex items-center p-4 border rounded-lg cursor-pointer" :class="{'border-blue-500 ring-2 ring-blue-500': paymentMethod === 'qris'}">
                    <input type="radio" v-model="paymentMethod" value="qris" class="form-radio text-blue-600">
                    <span class="ml-4 text-lg font-medium text-gray-800">QRIS</span>
                    <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/1/11/QRIS_logo.svg/1200px-QRIS_logo.svg.png" alt="QRIS" class="h-6 ml-auto">
                  </label>
                   <div v-if="paymentMethod === 'qris'" class="pl-8 pt-4">
                     <p class="text-gray-600">Silakan scan kode QR yang akan muncul setelah Anda menekan tombol "Bayar".</p>
                   </div>
                </div>
              </div>

              <div class="bg-[#eeeeee] border-4 border-white rounded-2xl p-6 shadow-lg">
                <h3 class="text-xl font-semibold mb-4">Voucher Booking</h3>
                <div class="flex space-x-4">
                  <input v-model="voucherCode" type="text" class="flex-grow px-4 py-3 border border-gray-300 rounded-lg text-black focus:outline-none focus:ring-blue-500 focus:border-blue-500" placeholder="Masukkan kode anda disini">
                  <button class="bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg hover:bg-blue-700 transition duration-300">
                    Konfirmasi
                  </button>
                </div>
              </div>
            </div>

            <div class="lg:col-span-1">
              <div class="bg-[#eeeeee] border-4 border-white rounded-2xl p-6 shadow-lg sticky top-8">
                <h3 class="text-xl font-semibold mb-6 border-b pb-4">Detail Pembayaran</h3>
                <div class="space-y-4">
                  <div class="flex justify-between">
                    <span class="text-gray-600">Subtotal</span>
                    <span class="font-medium text-gray-800">Rp. {{ subtotal.toLocaleString('id-ID') }}</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-gray-600">Discount</span>
                    <span class="font-medium text-gray-800">Rp. {{ discount.toLocaleString('id-ID') }}</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-gray-600">Pajak</span>
                    <span class="font-medium text-gray-800">Rp. {{ tax.toLocaleString('id-ID') }}</span>
                  </div>
                  <div class="border-t border-dashed my-4"></div>
                  <div class="flex justify-between text-lg font-semibold">
                    <span>Grand Total</span>
                    <span>Rp. {{ grandTotal.toLocaleString('id-ID') }}</span>
                  </div>
                </div>
                
                <div class="mt-6">
                  <label class="block text-sm font-medium text-gray-700">Catatan (Opsional)</label>
                  <textarea class="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg text-black focus:outline-none focus:ring-blue-500 focus:border-blue-500" rows="3" placeholder="Catatan tentang order anda"></textarea>
                </div>

                <button @click="handlePayment" class="w-full bg-blue-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-blue-700 transition duration-300 mt-6">
                  Bayar Rp. {{ grandTotal.toLocaleString('id-ID') }}
                </button>
                <button @click="goToStep(2)" class="w-full bg-gray-200 text-gray-700 font-semibold py-3 px-6 rounded-lg hover:bg-gray-300 transition duration-300 mt-3">
                  Kembali
                </button>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>