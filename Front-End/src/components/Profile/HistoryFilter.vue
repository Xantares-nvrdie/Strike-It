<script setup>
import { ref, defineEmits } from "vue";

// 1. Definisikan data reaktif untuk filter
const selectedTime = ref("bulan_ini"); // Default filter
const startDate = ref(""); 
const endDate = ref("");   

const allStatuses = [
  { id: "terbayar", text: "Terbayar", class: "bg-green-100 text-green-800" },
  {
    id: "belum_dibayar",
    text: "Belum Dibayar",
    class: "bg-yellow-100 text-yellow-800",
  },
  { id: "dibatalkan", text: "Dibatalkan", class: "bg-red-100 text-red-800" },
];
const selectedStatuses = ref(["terbayar", "belum_dibayar", "dibatalkan"]); 

// 2. Definisikan 'emit'
const emit = defineEmits(["apply-filters"]);

// 3. Fungsi untuk tombol-tombol Waktu Preset
const selectTime = (time) => {
  selectedTime.value = time;
  // UX: Jika pilih preset (Hari ini dll), kosongkan tanggal manual agar tidak bentrok
  startDate.value = "";
  endDate.value = "";
};

// Fungsi jika user mengubah tanggal manual, matikan preset
const onDateChange = () => {
    selectedTime.value = ""; // Matikan highlight tombol preset
};

// Fungsi toggle status
const toggleStatus = (statusId) => {
  const index = selectedStatuses.value.indexOf(statusId);
  if (index > -1) {
    selectedStatuses.value.splice(index, 1);
  } else {
    selectedStatuses.value.push(statusId);
  }
};

const isStatusActive = (statusId) => {
  return selectedStatuses.value.includes(statusId);
};

// 4. Fungsi tombol "Tampilkan Hasil"
const handleApplyFilters = () => {
  const filters = {
    time: selectedTime.value,
    startDate: startDate.value,
    endDate: endDate.value,
    statuses: selectedStatuses.value,
  };
  emit("apply-filters", filters);
};

// 5. Fungsi tombol "Hapus" (Clear) - PERBAIKAN UTAMA DISINI
const handleClearFilters = () => {
  selectedTime.value = "bulan_ini";
  startDate.value = ""; // Perbaikan: Jangan pakai 'const', langsung set value
  endDate.value = "";   // Perbaikan: Jangan pakai 'const', langsung set value
  selectedStatuses.value = ["terbayar", "belum_dibayar", "dibatalkan"];
  
  // Otomatis apply setelah clear
  handleApplyFilters();
};
</script>

<template>
  <div class="bg-white rounded-xl shadow p-4 md:p-6">
    <div class="flex justify-between items-center mb-6">
      <h3 class="text-xl font-semibold text-gray-900">Filters</h3>
      <button
        @click="handleClearFilters"
        class="text-sm font-medium text-blue-600 hover:text-blue-800"
      >
        Hapus
      </button>
    </div>

    <div class="mb-6">
      <h4 class="font-semibold text-gray-800 mb-3">Waktu</h4>
      <div class="flex flex-wrap gap-2">
        <button
          @click="selectTime('hari_ini')"
          :class="[
            selectedTime === 'hari_ini'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200',
          ]"
          class="px-4 py-1.5 text-sm rounded-full transition-colors"
        >
          Hari ini
        </button>
        <button
          @click="selectTime('minggu_ini')"
          :class="[
            selectedTime === 'minggu_ini'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200',
          ]"
          class="px-4 py-1.5 text-sm rounded-full transition-colors"
        >
          Minggu ini
        </button>
        <button
          @click="selectTime('bulan_ini')"
          :class="[
            selectedTime === 'bulan_ini'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200',
          ]"
          class="px-4 py-1.5 text-sm rounded-full transition-colors"
        >
          Bulan ini
        </button>
      </div>
    </div>

    <div class="mb-6">
      <h4 class="font-semibold text-gray-800 mb-3">Pilih Waktu</h4>
      <div class="flex flex-col md:flex-row items-center gap-2">
        <input
          type="date"
          v-model="startDate"
          @change="onDateChange" 
          class="w-full p-2.5 border border-gray-300 rounded-lg text-sm text-gray-700"
        />
        <span class="text-gray-500 rotate-90 md:rotate-0">-</span>
        <input
          type="date"
          v-model="endDate"
          @change="onDateChange"
          class="w-full p-2.5 border border-gray-300 rounded-lg text-sm text-gray-700"
        />
      </div>
    </div>

    <div class="mb-6">
      <h4 class="font-semibold text-gray-800 mb-3">Status</h4>
      <div class="flex flex-wrap gap-2">
        <button
          v-for="status in allStatuses"
          :key="status.id"
          @click="toggleStatus(status.id)"
          :class="[
            isStatusActive(status.id)
              ? status.class
              : 'bg-gray-100 text-gray-400 border border-gray-200',
          ]"
          class="px-4 py-1.5 text-sm rounded-full font-medium transition-all"
        >
          {{ status.text }}
        </button>
      </div>
    </div>

    <button
      @click="handleApplyFilters"
      class="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700"
    >
      Tampilkan Hasil
    </button>
  </div>
</template>
