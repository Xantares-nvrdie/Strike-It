<script setup>
// ref: untuk membuat variabel reaktif (angka/string yang bisa berubah di layar).
// computed: untuk kalkulasi otomatis (misal: harga x durasi).
import { ref, computed } from "vue";
// useRouter: Hook navigasi untuk memindahkan user ke halaman lain (halaman checkout).
import { useRouter } from "vue-router";

// Terima props dari parent (Logic Integrasi Tetap Ada)
// Komponen ini menerima data dari 'LocationDetailView.vue' atau parent lainnya.
const props = defineProps({
  // Harga dasar per jam. Jika tidak dikirim parent, default Rp 15.000.
  price: { type: Number, default: 15000 },
  // ID Lokasi pemancingan. Wajib ada (required) karena digunakan
  // sebagai parameter URL saat lanjut ke halaman booking berikutnya.
  locationId: { type: Number, required: true },
});

const router = useRouter(); // Inisialisasi instance router untuk navigasi
const duration = ref(2); // Durasi awal memancing di-set default 2 jam.

// Fungsi durasi
function increaseDuration() {
  duration.value++;
} // Menambah durasi memancing sebanyak 1 jam
function decreaseDuration() {
  if (duration.value > 1) duration.value--;
} // Mengurangi durasi, tapi dijaga agar tidak bisa kurang dari 1 jam (validasi).

// Menghitung Total Harga = Harga per jam (props) x Durasi (state).
// Menggunakan .toLocaleString('id-ID') untuk format Rupiah (titik pemisah ribuan).
const totalPrice = computed(() =>
  (props.price * duration.value).toLocaleString("id-ID")
);
const formattedPrice = computed(() => props.price.toLocaleString("id-ID")); // Memformat harga dasar untuk tampilan UI saja.

// Date logic
// Helper function untuk mendapatkan tanggal hari ini dalam format 'YYYY-MM-DD'.
// Diperlukan karena input HTML type="date" hanya menerima format ini.
const getToday = () => new Date().toISOString().split("T")[0];
const selectedDate = ref(getToday()); // Variabel reaktif untuk tanggal pilihan user. Defaultnya hari ini.

// Fungsi Lanjut Booking
const handleBooking = () => {
  // Mengarahkan user ke halaman Booking Form/Checkout.
  // Mengirimkan data (durasi & tanggal) via Query Parameters URL.
  // Contoh URL hasil: /location/5/book?date=2025-11-25&duration=3
  router.push({
    path: `/location/${props.locationId}/book`, // Path dinamis berdasarkan ID Lokasi
    query: {
      date: selectedDate.value, // Kirim tanggal yang dipilih
      duration: duration.value, // Kirim durasi yang dipilih
    },
  });
};
</script>

<template>
  <div
    class="bg-zinc-100 border-white border-4 rounded-2xl shadow-xl p-6 md:p-8 space-y-6"
  >
    <h3 class="text-3xl font-medium text-center text-gray-900">
      Mulai Booking
    </h3>

    <div>
      <span class="text-4xl font-bold text-blue-600"
        >Rp. {{ formattedPrice }}</span
      >
      <span class="text-xl text-gray-500">/jam</span>
    </div>

    <div class="space-y-3">
      <label class="font-medium text-gray-700"
        >Berapa lama anda akan memancing?</label
      >
      <div class="flex justify-between items-center bg-gray-100 rounded-lg p-2">
        <button
          @click="decreaseDuration"
          class="size-10 bg-red-500 text-white rounded-full text-2xl font-bold disabled:bg-gray-300"
          :disabled="duration <= 1"
        >
          -
        </button>
        <span class="text-xl font-bold text-gray-900">{{ duration }} jam</span>
        <button
          @click="increaseDuration"
          class="size-10 bg-green-500 text-white rounded-full text-2xl font-bold"
        >
          +
        </button>
      </div>
    </div>

    <div class="space-y-3">
      <label for="date-picker" class="font-medium text-gray-700"
        >Pilih Tanggal</label
      >
      <input
        id="date-picker"
        type="date"
        v-model="selectedDate"
        :min="getToday()"
        class="w-full bg-gray-100 rounded-lg p-3 text-lg font-medium text-gray-900 border-none outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>

    <div class="text-center">
      <p class="text-gray-600">
        Anda akan membayar
        <span class="font-bold text-blue-600">Rp. {{ totalPrice }}</span>
        untuk {{ duration }} jam
      </p>
    </div>

    <button
      @click="handleBooking"
      class="w-full bg-blue-600 text-white text-xl font-medium py-4 rounded-xl shadow-lg hover:bg-blue-700 transition-colors"
    >
      Lanjutkan booking
    </button>
  </div>
</template>
