<script setup>
// 1. IMPORT DEPENDENCIES
import { ref, computed, onMounted, watch } from "vue";
import { Icon } from "@iconify/vue"; // Library ikon
import { useRoute, useRouter } from "vue-router";
import api from "@/services/api.js"; // Import API Service (jembatan ke Back-End/routes/...)
import { useToast } from "vue-toastification"; // Untuk notifikasi popup (Success/Error)
import PaymentMethod from "@/components/Booking/PaymentMethod.vue"; // Import Komponen Child

// Inisialisasi Hooks
const route = useRoute(); // Untuk mengambil data dari URL (Query params dari BookingCard)
const router = useRouter(); // Untuk navigasi pindah halaman
const toast = useToast();

// 2. STATE MANAGEMENT (Reactivity)
// Mengontrol tampilan langkah wizard (1: Waktu, 2: Kursi, 3: Bayar)
const currentStep = ref(1);
const isSubmitting = ref(false); // Loading state saat tombol bayar ditekan

// Data yang akan di-fetch dari Backend
const locationData = ref(null);
const userData = ref(null);
const seats = ref([]);

// --- DATA BOOKING UTAMA ---
// [INTEGRASI] Mengambil data yang dikirim dari BookingCard.vue via URL Query
// Contoh URL: /location/1/book?duration=3&date=2025-11-25
const duration = ref(parseInt(route.query.duration) || 2);
const selectedDate = ref(
  route.query.date || new Date().toISOString().split("T")[0]
);
const selectedSeatId = ref(null);
const selectedSeatName = ref(""); // Disimpan untuk dikirim ke Backend (misal: "A1")

// State untuk Logika Jam (Time Slots)
const selectedStartHour = ref(null); // Jam mulai yang dipilih user (misal: "09:00")
const availableTimeSlots = ref([]); // Array menampung jadwal operasional 08:00 - 18:00

// Payment Data
const selectedPaymentMethod = ref(null);

// Data Diskon
const voucherCode = ref("");
const appliedVoucherCode = ref("");
const discountValue = ref(0);
const isVoucherApplied = ref(false);

// Helper Constants
// Mengarah ke folder 'uploads' di server Back-End
const baseUrl = "http://localhost:3000/uploads";
const getToday = () => new Date().toISOString().split("T")[0];
// Fungsi utilitas untuk memperbaiki URL gambar dari database
const getFullUrl = (path) =>
  path
    ? path.startsWith("http")
      ? path
      : `${baseUrl}/${path}`
    : "https://placehold.co/600x400";

// 3. LOGIC GENERATE JAM (08:00 - 18:00) ---
const generateTimeSlots = () => {
  const slots = [];
  const startHour = 8; // Buka jam 08.00
  const endHour = 18; // Tutup jam 18.00

  // Loop dari jam 8 sampai 18 untuk membuat slot per jam
  for (let i = startHour; i < endHour; i++) {
    const timeString = `${i.toString().padStart(2, "0")}:00`;

    // Simulasi Logic Backend: Cek apakah jam ini FULL BOOKED
    // Nanti logic ini diganti dengan data dari API (isFull: true/false)
    const isFullBooked = false; // Contoh: ubah jadi true untuk tes disable

    slots.push({
      time: timeString,
      display: `${timeString} - ${(i + 1).toString().padStart(2, "0")}:00`,
      disabled: isFullBooked,
    });
  }
  availableTimeSlots.value = slots;
};

// Cek apakah slot tertentu masuk dalam range durasi yang dipilih
// Logic Visual: Menandai slot mana saja yang terpilih berdasarkan durasi
// Jika pilih jam 09:00 durasi 3 jam, maka 09:00, 10:00, 11:00 akan ter-highlight.
const isSlotSelected = (slotTime) => {
  if (!selectedStartHour.value) return false;

  const startIndex = availableTimeSlots.value.findIndex(
    (s) => s.time === selectedStartHour.value
  );
  if (startIndex === -1) return false;

  const targetIndex = availableTimeSlots.value.findIndex(
    (s) => s.time === slotTime
  );

  // Return true jika slot ini berada dalam range (start) sampai (start + duration)
  return targetIndex >= startIndex && targetIndex < startIndex + duration.value;
};

// Validasi Logic: Mencegah user memilih jam yang durasinya menabrak jam tutup atau jam penuh
const isValidSelection = (slotTime) => {
  const startIndex = availableTimeSlots.value.findIndex(
    (s) => s.time === slotTime
  );
  if (startIndex === -1) return false;

  // Cek 1: Apakah durasi melebihi jam operasional? (Misal booking 2 jam di jam 17:00 -> Gagal)
  if (startIndex + duration.value > availableTimeSlots.value.length)
    return false;

  // Cek 2: Apakah ada slot "disabled" di tengah-tengah durasi tersebut?
  for (let i = 0; i < duration.value; i++) {
    if (availableTimeSlots.value[startIndex + i].disabled) return false;
  }

  return true;
};

// Handler saat user klik kotak jam
const selectTime = (slot) => {
  if (slot.disabled) {
    toast.warning("Jam ini sudah penuh.");
    return;
  }

  if (!isValidSelection(slot.time)) {
    toast.warning(
      `Durasi ${duration.value} jam tidak cukup atau melewati jam tutup.`
    );
    return;
  }

  selectedStartHour.value = slot.time;
};

// 4. LOGIC HARGA (COMPUTED)
// Mengambil harga dari data lokasi, hitung subtotal, dan pajak
const pricePerJam = computed(() => locationData.value?.price_per_hour || 0);
const formattedPrice = computed(() =>
  pricePerJam.value.toLocaleString("id-ID")
);
const subtotal = computed(() => pricePerJam.value * duration.value);
const taxRate = 0.1; // Pajak 10%
const tax = computed(() => Math.round(subtotal.value * taxRate));

// Menghitung total akhir setelah dikurangi diskon
const grandTotal = computed(() => {
  const total = subtotal.value + tax.value - discountValue.value;
  return total > 0 ? total : 0;
});

// 5. LOGIC VOUCHER
const applyVoucher = async () => {
  if (!voucherCode.value) {
    toast.warning("Masukkan kode voucher!");
    return;
  }

  try {
    // Request ke Backend untuk validasi kode
    const res = await api.checkVoucher(voucherCode.value);
    if (res.data.valid) {
      // Handle diskon persen (%) atau nominal tetap (Rp)
      const valStr = res.data.discount_value;
      if (valStr.includes("%")) {
        const percent = parseInt(valStr.replace("%", ""));
        discountValue.value = subtotal.value * (percent / 100);
      } else {
        discountValue.value = parseInt(valStr);
      }
      appliedVoucherCode.value = voucherCode.value;
      isVoucherApplied.value = true;
      toast.success(
        `Voucher diterapkan! Hemat Rp. ${discountValue.value.toLocaleString("id-ID")}`
      );
    }
  } catch (error) {
    // Reset jika gagal
    discountValue.value = 0;
    isVoucherApplied.value = false;
    appliedVoucherCode.value = "";
    toast.error("Kode voucher tidak valid.");
  }
};

// 6. FETCH DATA (API CALLS)
// Mengambil status kursi (Occupied/Available) dari Backend
const fetchSeatsStatus = async () => {
  if (!locationData.value?.id || !selectedDate.value) return;
  try {
    // Memanggil endpoint: GET /locations/:id/spots?date=...
    // Di masa depan: Tambahkan parameter jam (start & duration) ke API ini
    // agar kursi yang "occupied" benar-benar spesifik untuk jam yang dipilih
    const res = await api.getLocationSpots(
      locationData.value.id,
      selectedDate.value
    );
    seats.value = res.data;
  } catch (error) {
    console.error("Gagal load kursi:", error);
    seats.value = [];
  }
};

// Reset pilihan jam saat tanggal berubah
// Watcher: Jika tanggal berubah, reset jam & kursi, lalu ambil data kursi baru
watch(selectedDate, () => {
  selectedStartHour.value = null;
  selectedSeatId.value = null;
  selectedSeatName.value = "";
  fetchSeatsStatus();
});

// Reset pilihan jam saat durasi berubah
// Watcher: Jika durasi berubah, reset jam mulai (karena validasi slot berubah)
watch(duration, () => {
  selectedStartHour.value = null;
});

// Lifecycle Hook: Saat halaman dimuat
onMounted(async () => {
  generateTimeSlots();
  const locId = route.params.id; // Ambil ID lokasi dari URL (/location/:id/book)
  if (!locId) {
    router.push("/location");
    return;
  }

  try {
    // Parallel Requests untuk efisiensi waktu
    // 1. Ambil detail lokasi
    const locRes = await api.getLocationDetail(locId);
    const loc = locRes.data;
    locationData.value = { ...loc, imageUrl: getFullUrl(loc.img) };

    // 2. Ambil profil user (untuk auto-fill nama & email)
    const userRes = await api.getMyProfile();
    userData.value = userRes.data;

    // 3. Ambil status kursi
    await fetchSeatsStatus();
  } catch (error) {
    toast.error("Gagal memuat data.");
  }
});

// 7. NAVIGASI WIZARD (STEP 1 -> 2 -> 3)
const goToStep = (step) => (currentStep.value = step);
const resetFlow = () => router.push("/location");

// Validasi Step 1 (Info & Waktu) sebelum lanjut ke Step 2 (Kursi)
const handleStep1Submit = () => {
  if (!userData.value) return toast.error("Data user belum siap.");
  if (!selectedStartHour.value)
    return toast.warning("Silakan pilih jam mulai.");

  goToStep(2);
};

// Logic pilih kursi (Klik kursi di UI)
const selectSeat = (seat) => {
  if (seat.status === "occupied") {
    toast.warning("Kursi ini sudah dipesan pada tanggal ini.");
    return;
  }
  // Toggle selection (pilih/batal pilih)
  if (selectedSeatId.value === seat.id) {
    selectedSeatId.value = null;
    selectedSeatName.value = "";
  } else {
    selectedSeatId.value = seat.id;
    selectedSeatName.value = seat.name;
  }
};

// Validasi Step 2 sebelum lanjut ke Step 3 (Pembayaran)
const handleStep2Submit = () => {
  if (!selectedSeatId.value)
    return toast.warning("Silakan pilih kursi terlebih dahulu.");
  goToStep(3);
};

// 8. FINAL SUBMIT (CREATE BOOKING)
const handlePayment = async () => {
  if (isSubmitting.value) return;
  if (!selectedPaymentMethod.value)
    return toast.warning("Silakan pilih metode pembayaran!");

  isSubmitting.value = true;

  try {
    // Format Tanggal & Jam: "YYYY-MM-DD HH:MM:SS"
    const finalStartTime = `${selectedDate.value} ${selectedStartHour.value}:00`;

    // Menyusun Payload (Data yang dikirim ke Backend)
    // Sesuai dengan struktur tabel 'orders' dan 'bookings' di database
    const payload = {
      id_location: locationData.value.id,
      booking_date: selectedDate.value,
      booking_start: finalStartTime,
      duration: duration.value,
      spot_number: selectedSeatName.value,
      first_name: userData.value.name.split(" ")[0],
      last_name: userData.value.name.split(" ").slice(1).join(" ") || "",
      email: userData.value.email,
      phone: "08123456789", // Hardcoded sementara atau ambil dari userData jika ada
      voucher_code: isVoucherApplied.value ? appliedVoucherCode.value : null,
      payment_method: selectedPaymentMethod.value.id,
    };

    // Kirim ke endpoint POST /orders
    const response = await api.createBooking(payload);
    toast.success(`Booking Berhasil! Invoice: ${response.data.invoice}`); // Sukses -> Redirect ke halaman History
    router.push("/history");
  } catch (error) {
    toast.error(error.response?.data?.message || "Gagal membuat booking.");
  } finally {
    isSubmitting.value = false;
  }
};

// // 9. UI HELPERS
function increaseDuration() {
  duration.value++;
}
function decreaseDuration() {
  if (duration.value > 1) duration.value--;
}

// Filter kursi berdasarkan posisi untuk dirender di layout visual (Atas, Bawah, Kiri, Kanan)
const topSeats = computed(() =>
  seats.value.filter((s) => s.name.startsWith("T"))
);
const bottomSeats = computed(() =>
  seats.value.filter((s) => s.name.startsWith("B"))
);
const leftSeats = computed(() =>
  seats.value.filter((s) => s.name.startsWith("L"))
);
const rightSeats = computed(() =>
  seats.value.filter((s) => s.name.startsWith("R"))
);

// Dynamic Class untuk warna kursi (Merah=Isi, Biru=Dipilih, Putih=Kosong)
const getSeatClass = (seat) => {
  if (seat.status === "occupied")
    return "bg-red-500 text-white cursor-not-allowed border-red-600";
  if (selectedSeatId.value === seat.id)
    return "bg-blue-600 text-white border-blue-700";
  return "bg-white border border-gray-300 hover:bg-gray-100";
};

const getStepClass = (step) => {
  if (step < currentStep.value) return "bg-green-500 text-white";
  if (step === currentStep.value) return "bg-blue-600 text-white";
  return "bg-gray-200 text-gray-500";
};
</script>

<template>
  <div
    class="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8 font-['Outfit']"
  >
    <div class="flex flex-col items-center">
      <div class="flex items-center justify-center w-full max-w-xl mb-12">
        <div class="flex items-center">
          <div
            :class="getStepClass(1)"
            class="w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold transition-all shadow-sm"
          >
            <Icon v-if="currentStep > 1" icon="mdi:check" class="w-6 h-6" />
            <span v-else>1</span>
          </div>
        </div>
        <div
          class="flex-auto border-t-2 transition-all duration-500 mx-2"
          :class="currentStep > 1 ? 'border-green-500' : 'border-gray-300'"
        ></div>
        <div class="flex items-center">
          <div
            :class="getStepClass(2)"
            class="w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold transition-all shadow-sm"
          >
            <Icon v-if="currentStep > 2" icon="mdi:check" class="w-6 h-6" />
            <span v-else>2</span>
          </div>
        </div>
        <div
          class="flex-auto border-t-2 transition-all duration-500 mx-2"
          :class="currentStep > 2 ? 'border-green-500' : 'border-gray-300'"
        ></div>
        <div class="flex items-center">
          <div
            :class="getStepClass(3)"
            class="w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold transition-all shadow-sm"
          >
            <span>3</span>
          </div>
        </div>
      </div>

      <div class="w-full flex justify-center">
        <div
          v-if="currentStep === 1 && locationData"
          class="bg-zinc-100 border-white shadow-md border-4 rounded-[2rem] p-8 w-full max-w-4xl animate-fade-in"
        >
          <h2 class="text-2xl font-semibold text-center text-gray-800 mb-2">
            Informasi Booking
          </h2>
          <p class="text-center text-gray-500 mb-8">
            Tentukan waktu mancing Anda
          </p>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div
              class="bg-[#eeeeee] border-4 border-white rounded-2xl overflow-hidden shadow flex flex-col"
            >
              <img
                :src="locationData.imageUrl"
                class="w-full h-64 object-cover"
              />
              <div class="p-6 bg-transparent flex-1">
                <h3 class="text-xl text-black font-semibold mb-2">
                  {{ locationData.name }}
                </h3>
                <p class="text-gray-600 mb-4">
                  {{ locationData.city }}, Indonesia
                </p>
                <p class="text-2xl font-bold text-blue-600">
                  Rp. {{ formattedPrice
                  }}<span class="text-lg font-normal text-gray-500">
                    / jam</span
                  >
                </p>

                <div class="mt-6 space-y-2">
                  <label
                    class="font-bold text-gray-700 text-sm uppercase tracking-wide"
                    >Durasi (Jam)</label
                  >
                  <div
                    class="flex justify-between items-center bg-white border border-gray-300 rounded-xl p-2 shadow-sm"
                  >
                    <button
                      @click="decreaseDuration"
                      class="size-10 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 text-2xl font-bold transition"
                      :disabled="duration <= 1"
                    >
                      -
                    </button>
                    <span class="text-2xl font-bold text-gray-900"
                      >{{ duration }} Jam</span
                    >
                    <button
                      @click="increaseDuration"
                      class="size-10 bg-green-100 text-green-600 rounded-lg hover:bg-green-200 text-2xl font-bold transition"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div class="space-y-2 mt-4">
                  <label
                    class="font-bold text-gray-700 text-sm uppercase tracking-wide"
                    >Tanggal</label
                  >
                  <input
                    type="date"
                    v-model="selectedDate"
                    :min="getToday()"
                    class="w-full bg-white rounded-xl p-3 font-medium text-gray-900 border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none shadow-sm"
                  />
                </div>

                <div class="space-y-2 mt-4">
                  <label
                    class="font-bold text-gray-700 text-sm uppercase tracking-wide"
                  >
                    Pilih Jam Mulai
                    <span class="text-xs font-normal text-gray-500 normal-case"
                      >(Otomatis blok {{ duration }} kolom)</span
                    >
                  </label>

                  <div class="grid grid-cols-3 gap-2">
                    <button
                      v-for="slot in availableTimeSlots"
                      :key="slot.time"
                      type="button"
                      @click="selectTime(slot)"
                      :disabled="
                        slot.disabled ||
                        (!isSlotSelected(slot.time) &&
                          !isValidSelection(slot.time))
                      "
                      class="py-3 px-2 rounded-lg text-xs font-bold border-2 transition-all relative overflow-hidden group"
                      :class="[
                        isSlotSelected(slot.time)
                          ? 'bg-blue-600 text-white border-blue-600 shadow-md scale-105 z-10'
                          : slot.disabled
                            ? 'bg-gray-200 text-gray-400 border-gray-200 cursor-not-allowed decoration-slice line-through'
                            : 'bg-white text-gray-700 border-gray-200 hover:border-blue-400 hover:bg-blue-50',
                      ]"
                    >
                      {{ slot.time }}
                      <div
                        v-if="isSlotSelected(slot.time)"
                        class="absolute inset-0 bg-white/10"
                      ></div>
                    </button>
                  </div>
                  <p
                    v-if="selectedStartHour"
                    class="text-sm text-blue-600 font-medium mt-1 text-right"
                  >
                    Terpilih: {{ selectedStartHour }} s/d
                    {{ parseInt(selectedStartHour) + duration }}:00
                  </p>
                </div>
              </div>
            </div>

            <form
              @submit.prevent="handleStep1Submit"
              class="flex flex-col h-full"
            >
              <div
                class="bg-[#eeeeee] border-4 border-white rounded-2xl space-y-6 p-6 mb-6 flex-1 shadow"
              >
                <div
                  class="p-4 bg-blue-50 border border-blue-200 rounded-lg text-blue-800 text-sm mb-4 flex items-start gap-2"
                >
                  <Icon icon="mdi:information" class="size-5 shrink-0 mt-0.5" />
                  <span>Data diri diambil otomatis dari akun Anda.</span>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700"
                    >Nama Lengkap</label
                  >
                  <input
                    :value="userData?.name"
                    disabled
                    class="mt-1 block w-full px-4 py-3 border border-gray-300 bg-gray-100 text-gray-500 rounded-lg cursor-not-allowed"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700"
                    >Email</label
                  >
                  <input
                    :value="userData?.email"
                    disabled
                    class="mt-1 block w-full px-4 py-3 border border-gray-300 bg-gray-100 text-gray-500 rounded-lg cursor-not-allowed"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700"
                    >Nomor Telp</label
                  >
                  <input
                    type="tel"
                    value="08123456789"
                    class="mt-1 block w-full px-4 py-3 border border-gray-300 text-black rounded-lg focus:ring-blue-500 focus:border-blue-500 outline-none"
                  />
                </div>
              </div>
              <div class="mt-auto flex flex-col space-y-3">
                <button
                  type="submit"
                  class="w-full bg-blue-600 text-white font-bold py-4 px-6 rounded-xl hover:bg-blue-700 transition duration-300 shadow-lg shadow-blue-200"
                >
                  Lanjut Pilih Kursi
                </button>
                <button
                  type="button"
                  @click="resetFlow"
                  class="w-full bg-red-100 text-red-600 font-bold py-4 px-6 rounded-xl hover:bg-red-200 transition duration-300"
                >
                  Batalkan
                </button>
              </div>
            </form>
          </div>
        </div>

        <div
          v-if="currentStep === 1 && !locationData"
          class="text-center py-20"
        >
          <div
            class="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-600 border-gray-200 mx-auto"
          ></div>
          <p class="mt-4 text-gray-600 font-medium">Memuat data booking...</p>
        </div>

        <div
          v-if="currentStep === 2"
          class="bg-zinc-100 border-white shadow-md border-4 rounded-[2rem] p-4 md:p-8 w-full max-w-4xl animate-fade-in"
        >
          <div
            class="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-3"
          >
            <div>
              <h2 class="text-xl md:text-2xl font-semibold text-gray-800">
                Pilih Spot Mancing
              </h2>
              <p
                class="text-sm md:text-base text-gray-500 mt-1 flex items-center gap-2"
              >
                <Icon icon="mdi:calendar-clock" />
                {{ selectedDate }} | {{ selectedStartHour }} -
                {{ parseInt(selectedStartHour) + duration }}:00
              </p>
            </div>
            <div
              class="bg-blue-100 text-blue-700 px-4 py-2 rounded-lg font-bold text-sm md:text-lg self-start"
            >
              {{ duration }} Jam
            </div>
          </div>

          <div
            class="flex flex-col items-center w-full bg-white rounded-xl p-4 md:p-6 border border-gray-200 shadow-inner"
          >
            <div
              class="flex flex-wrap justify-center gap-1.5 md:gap-2 mb-2 md:mb-4 w-full"
            >
              <button
                v-for="seat in topSeats"
                :key="seat.id"
                @click="selectSeat(seat)"
                :class="getSeatClass(seat)"
                class="w-7 h-7 md:w-10 md:h-10 flex items-center justify-center rounded-lg shadow-sm cursor-pointer transition-all transform active:scale-95 border-2 relative group"
              >
                <Icon icon="mdi:fish" class="w-4 h-4 md:w-6 md:h-6" />
              </button>
            </div>

            <div
              class="grid grid-cols-[auto_1fr_auto] w-full gap-2 md:gap-4 h-auto md:h-48"
            >
              <div class="flex flex-col justify-center gap-1.5 md:gap-2">
                <button
                  v-for="seat in leftSeats"
                  :key="seat.id"
                  @click="selectSeat(seat)"
                  :class="getSeatClass(seat)"
                  class="w-7 h-7 md:w-10 md:h-10 flex items-center justify-center rounded-lg shadow-sm cursor-pointer transition-all transform active:scale-95 border-2"
                >
                  <Icon icon="mdi:fish" class="w-4 h-4 md:w-6 md:h-6" />
                </button>
              </div>

              <div
                class="relative rounded-xl bg-blue-50 border-2 border-blue-200 w-full flex flex-col items-center justify-center text-blue-400 overflow-hidden min-h-[120px]"
              >
                <Icon
                  icon="mdi:water"
                  class="w-16 h-16 md:w-24 md:h-24 opacity-20 absolute"
                />
                <div class="relative z-10 text-center px-1">
                  <span class="block font-bold text-sm md:text-lg text-blue-400"
                    >KOLAM PEMANCINGAN</span
                  >
                  <span class="block text-[10px] md:text-xs text-blue-300"
                    >Area Air Tenang</span
                  >
                </div>
              </div>

              <div class="flex flex-col justify-center gap-1.5 md:gap-2">
                <button
                  v-for="seat in rightSeats"
                  :key="seat.id"
                  @click="selectSeat(seat)"
                  :class="getSeatClass(seat)"
                  class="w-7 h-7 md:w-10 md:h-10 flex items-center justify-center rounded-lg shadow-sm cursor-pointer transition-all transform active:scale-95 border-2"
                >
                  <Icon icon="mdi:fish" class="w-4 h-4 md:w-6 md:h-6" />
                </button>
              </div>
            </div>

            <div
              class="flex flex-wrap justify-center gap-1.5 md:gap-2 mt-2 md:mt-4 w-full"
            >
              <button
                v-for="seat in bottomSeats"
                :key="seat.id"
                @click="selectSeat(seat)"
                :class="getSeatClass(seat)"
                class="w-7 h-7 md:w-10 md:h-10 flex items-center justify-center rounded-lg shadow-sm cursor-pointer transition-all transform active:scale-95 border-2"
              >
                <Icon icon="mdi:fish" class="w-4 h-4 md:w-6 md:h-6" />
              </button>
            </div>
          </div>

          <div
            class="flex flex-wrap justify-center gap-4 md:gap-6 mt-6 text-xs md:text-sm font-medium"
          >
            <div class="flex items-center gap-2">
              <div
                class="w-4 h-4 md:w-5 md:h-5 rounded bg-blue-600 border border-blue-700"
              ></div>
              <span class="text-gray-800"
                >Pilihan: {{ selectedSeatName || "-" }}</span
              >
            </div>
            <div class="flex items-center gap-2">
              <div
                class="w-4 h-4 md:w-5 md:h-5 rounded bg-white border border-gray-300"
              ></div>
              <span class="text-gray-800">Tersedia</span>
            </div>
            <div class="flex items-center gap-2">
              <div
                class="w-4 h-4 md:w-5 md:h-5 rounded bg-red-500 border border-red-600"
              ></div>
              <span class="text-gray-800">Terisi</span>
            </div>
          </div>

          <div
            class="mt-8 flex flex-col-reverse sm:flex-row sm:justify-between gap-3"
          >
            <button
              @click="goToStep(1)"
              class="w-full sm:w-auto bg-gray-200 text-gray-700 font-bold py-3.5 px-8 rounded-xl hover:bg-gray-300 transition duration-300"
            >
              Kembali
            </button>
            <button
              @click="handleStep2Submit"
              class="w-full sm:w-auto bg-blue-600 text-white font-bold py-3.5 px-8 rounded-xl hover:bg-blue-700 transition duration-300 shadow-lg shadow-blue-200"
            >
              Lanjut Pembayaran
            </button>
          </div>
        </div>
        <div v-if="currentStep === 3" class="w-full max-w-5xl animate-fade-in">
          <h2 class="text-3xl font-bold text-center text-gray-800 mb-8">
            Pembayaran
          </h2>
          <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div class="lg:col-span-2 space-y-8">
              <PaymentMethod
                @select="(method) => (selectedPaymentMethod = method)"
              />

              <div
                class="bg-zinc-100 border-white shadow-md border-4 rounded-[2rem] p-6 w-full"
              >
                <h3
                  class="text-xl text-black font-bold mb-4 flex items-center gap-2"
                >
                  <Icon icon="mdi:ticket-percent-outline" class="w-6 h-6" />
                  Voucher Promo
                </h3>
                <div class="flex flex-col sm:flex-row gap-3">
                  <input
                    v-model="voucherCode"
                    :disabled="isVoucherApplied"
                    type="text"
                    class="flex-grow px-4 py-3 border border-gray-300 rounded-xl text-black focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-200 uppercase font-medium"
                    placeholder="Punya kode voucher?"
                  />
                  <button
                    @click="applyVoucher"
                    :disabled="isVoucherApplied"
                    class="bg-gray-800 text-white font-bold py-3 px-6 rounded-xl hover:bg-black transition duration-300 disabled:bg-green-600 whitespace-nowrap"
                  >
                    {{ isVoucherApplied ? "Terpasang" : "Gunakan" }}
                  </button>
                </div>
              </div>
            </div>

            <div class="lg:col-span-1">
              <div
                class="bg-white border border-gray-200 shadow-xl rounded-[2rem] p-6 sticky top-8"
              >
                <h3 class="text-xl font-bold mb-6 border-b pb-4 text-gray-800">
                  Ringkasan Pesanan
                </h3>
                <div class="space-y-4 text-sm">
                  <div class="flex justify-between">
                    <span class="text-gray-500">Lokasi</span
                    ><span class="font-bold text-gray-900 text-right">{{
                      locationData.name
                    }}</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-gray-500">Waktu</span
                    ><span class="font-bold text-gray-900"
                      >{{ selectedDate }} / {{ selectedStartHour }}</span
                    >
                  </div>
                  <div class="flex justify-between">
                    <span class="text-gray-500">Spot</span
                    ><span class="font-bold text-gray-900">{{
                      selectedSeatName
                    }}</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-gray-500">Durasi</span
                    ><span class="font-bold text-gray-900"
                      >{{ duration }} Jam</span
                    >
                  </div>

                  <div class="border-t border-gray-100 my-2"></div>

                  <div class="flex justify-between">
                    <span class="text-gray-500">Subtotal</span
                    ><span class="font-medium text-gray-800"
                      >Rp. {{ subtotal.toLocaleString("id-ID") }}</span
                    >
                  </div>
                  <div class="flex justify-between">
                    <span class="text-gray-500">Pajak (10%)</span
                    ><span class="font-medium text-gray-800"
                      >Rp. {{ tax.toLocaleString("id-ID") }}</span
                    >
                  </div>

                  <div
                    v-if="discountValue > 0"
                    class="flex justify-between text-green-600 bg-green-50 p-2 rounded-lg"
                  >
                    <span class="font-bold">Diskon Voucher</span>
                    <span class="font-bold"
                      >- Rp. {{ discountValue.toLocaleString("id-ID") }}</span
                    >
                  </div>

                  <div
                    class="border-t-2 border-dashed border-gray-300 my-4"
                  ></div>
                  <div class="flex justify-between text-lg">
                    <span class="font-bold text-gray-700">Total Bayar</span>
                    <span class="font-bold text-blue-600 text-xl"
                      >Rp. {{ grandTotal.toLocaleString("id-ID") }}</span
                    >
                  </div>
                </div>

                <button
                  @click="handlePayment"
                  :disabled="isSubmitting"
                  class="w-full bg-blue-600 text-white font-bold py-4 px-6 rounded-xl hover:bg-blue-700 transition duration-300 mt-8 shadow-lg shadow-blue-200 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <Icon
                    v-if="isSubmitting"
                    icon="eos-icons:loading"
                    class="animate-spin"
                  />
                  {{ isSubmitting ? "Memproses..." : "Bayar Sekarang" }}
                </button>
                <button
                  @click="goToStep(2)"
                  class="w-full text-gray-500 font-semibold py-3 mt-2 hover:text-gray-700 transition text-sm"
                >
                  Kembali ubah kursi
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.4s ease-out forwards;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
