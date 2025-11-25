<script setup>
import { ref, watch } from "vue";

// Event Emitter: Mengirim data pilihan user ke parent (BookingPage)
const emit = defineEmits(["select"]);

// Tab aktif (default: transfer)
const activeTab = ref("transfer");

// State Sub-pilihan (Misal: Bank BCA/Mandiri) (UX Only)
const selectedBank = ref("bca");

// State Info Kartu (Jika pilih kartu kredit)
const cardInfo = ref({ number: "", expiry: "", cvv: "", name: "" });

// Logic: Mengubah Tab string menjadi ID yang dimengerti Database
const getPaymentMethodInfo = () => {
  switch (activeTab.value) {
    // ID 1: Kartu Kredit/Debit
    case "card":
      return { id: 1, name: "Kartu Debit/Kredit" };
    // ID 2: Bank Transfer
    case "transfer":
      return { id: 2, name: "Bank Transfer" };
    // ID 3: QRIS
    case "qris":
      return { id: 3, name: "QRIS" };
    // ID 4: COD
    case "cod":
      return { id: 4, name: "Cash on Delivery" };
    default:
      return { id: 2, name: "Bank Transfer" };
  }
};

// Pantau perubahan tab dan kirim Object ke parent
// Watcher: Setiap kali user ganti tab, otomatis kirim data terbaru ke parent
// immediate: true artinya saat pertama kali load, event langsung dikirim (default transfer)
watch(
  activeTab,
  () => {
    const methodData = getPaymentMethodInfo();
    emit("select", methodData);
  },
  { immediate: true },
);
</script>

<template>
  <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 md:p-8">
    <h3 class="text-2xl font-medium text-gray-900 mb-6 border-b pb-4">
      Metode Pembayaran
    </h3>

    <div class="border-b border-gray-200 mb-6 overflow-x-auto">
      <nav class="-mb-px flex space-x-6" aria-label="Tabs">
        <button
          @click="activeTab = 'transfer'"
          :class="[
            activeTab === 'transfer'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
            'whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors',
          ]"
        >
          Bank Transfer
        </button>
        <button
          @click="activeTab = 'qris'"
          :class="[
            activeTab === 'qris'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
            'whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors',
          ]"
        >
          QRIS
        </button>
        <button
          @click="activeTab = 'card'"
          :class="[
            activeTab === 'card'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
            'whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors',
          ]"
        >
          Kartu Debit/Kredit
        </button>
        <button
          @click="activeTab = 'cod'"
          :class="[
            activeTab === 'cod'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
            'whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors',
          ]"
        >
          COD
        </button>
      </nav>
    </div>

    <div class="min-h-[200px]">
      <div v-if="activeTab === 'transfer'" class="space-y-4 animate-fade-in">
        <p class="text-sm text-gray-500 mb-4">
          Pilih bank tujuan transfer (Virtual Account):
        </p>

        <label
          class="flex items-center justify-between p-4 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
          :class="{
            'border-blue-600 ring-1 ring-blue-600 bg-blue-50':
              selectedBank === 'bca',
          }"
        >
          <div class="flex items-center gap-4">
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/5/5c/Bank_Central_Asia.svg"
              alt="BCA"
              class="h-8 w-auto object-contain"
            />
            <span class="font-medium text-gray-900">BCA Virtual Account</span>
          </div>
          <input
            type="radio"
            value="bca"
            v-model="selectedBank"
            class="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
          />
        </label>

        <label
          class="flex items-center justify-between p-4 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
          :class="{
            'border-blue-600 ring-1 ring-blue-600 bg-blue-50':
              selectedBank === 'mandiri',
          }"
        >
          <div class="flex items-center gap-4">
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/a/ad/Bank_Mandiri_logo_2016.svg"
              alt="Mandiri"
              class="h-8 w-auto object-contain"
            />
            <span class="font-medium text-gray-900"
              >Mandiri Virtual Account</span
            >
          </div>
          <input
            type="radio"
            value="mandiri"
            v-model="selectedBank"
            class="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
          />
        </label>

        <label
          class="flex items-center justify-between p-4 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
          :class="{
            'border-blue-600 ring-1 ring-blue-600 bg-blue-50':
              selectedBank === 'bri',
          }"
        >
          <div class="flex items-center gap-4">
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/6/68/BANK_BRI_logo.svg"
              alt="BRI"
              class="h-8 w-auto object-contain"
            />
            <span class="font-medium text-gray-900">BRI Virtual Account</span>
          </div>
          <input
            type="radio"
            value="bri"
            v-model="selectedBank"
            class="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
          />
        </label>
      </div>

      <div
        v-if="activeTab === 'qris'"
        class="flex flex-col items-center justify-center space-y-6 py-4 animate-fade-in"
      >
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/Logo_QRIS.svg/1200px-Logo_QRIS.svg.png"
          alt="QRIS"
          class="h-8 mb-2"
        />

        <div class="bg-white p-4 rounded-xl shadow-lg border border-gray-200">
          <img
            src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=StrikeItPayment"
            alt="QR Code"
            class="w-48 h-48"
          />
        </div>

        <p class="text-center text-gray-600 text-sm max-w-xs">
          Scan QR code di atas menggunakan GoPay, OVO, Dana, atau Mobile Banking
          Anda.
        </p>
      </div>

      <div v-if="activeTab === 'card'" class="space-y-4 animate-fade-in">
        <div class="flex justify-end gap-2 mb-2">
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/d/d6/Visa_2021.svg"
            alt="Visa"
            class="h-6"
          />
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg"
            alt="Mastercard"
            class="h-6"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1"
            >Nomor Kartu</label
          >
          <input
            type="text"
            v-model="cardInfo.number"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder="0000 0000 0000 0000"
          />
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1"
              >Berlaku Hingga</label
            >
            <input
              type="text"
              v-model="cardInfo.expiry"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="MM / YY"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1"
              >CVV</label
            >
            <input
              type="text"
              v-model="cardInfo.cvv"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="123"
            />
          </div>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1"
            >Nama di Kartu</label
          >
          <input
            type="text"
            v-model="cardInfo.name"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder="Nama Pemilik"
          />
        </div>
      </div>

      <div
        v-if="activeTab === 'cod'"
        class="flex flex-col items-center justify-center space-y-4 py-8 animate-fade-in"
      >
        <img
          src="https://cdn-icons-png.flaticon.com/512/2331/2331941.png"
          alt="COD"
          class="w-20 h-20 opacity-70"
        />
        <h4 class="text-lg font-semibold text-gray-900">Bayar di Tempat</h4>
        <p class="text-center text-gray-600 text-sm max-w-sm">
          Anda dapat melakukan pembayaran secara tunai di lokasi pemancingan
          saat melakukan registrasi ulang / check-in.
        </p>
        <div
          class="bg-yellow-50 text-yellow-800 p-3 rounded-lg text-sm border border-yellow-200"
        >
          <span class="font-bold">Catatan:</span> Pastikan membawa uang pas
          untuk mempercepat proses.
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.3s ease-in-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(5px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
