<script setup>
import { ref, defineEmits } from 'vue';

// 1. Definisikan data reaktif untuk filter
const selectedTime = ref('bulan_ini'); // Untuk tombol aktif
const startDate = ref('2025-12-11'); // Sesuai screenshot
const endDate = ref('2025-12-20'); // Sesuai screenshot

// Kita buat filter status menjadi multi-pilih
const allStatuses = [
    { id: 'terbayar', text: 'Terbayar', class: 'bg-green-100 text-green-800' },
    { id: 'belum_dibayar', text: 'Belum Dibayar', class: 'bg-yellow-100 text-yellow-800' },
    { id: 'dibatalkan', text: 'Dibatalkan', class: 'bg-red-100 text-red-800' },
];
const selectedStatuses = ref(['terbayar', 'belum_dibayar', 'dibatalkan']); // Status yang dipilih

// 2. Definisikan 'emit' untuk mengirim data ke Induk
const emit = defineEmits(['apply-filters']);

// 3. Fungsi untuk tombol-tombol
const selectTime = (time) => {
    selectedTime.value = time;
};

// Fungsi untuk menambah/menghapus status dari array
const toggleStatus = (statusId) => {
    const index = selectedStatuses.value.indexOf(statusId);
    if (index > -1) {
        // Jika sudah ada, hapus
        selectedStatuses.value.splice(index, 1);
    } else {
        // Jika belum ada, tambahkan
        selectedStatuses.value.push(statusId);
    }
};

// Fungsi untuk mengecek apakah status aktif (untuk styling)
const isStatusActive = (statusId) => {
    return selectedStatuses.value.includes(statusId);
};

// 4. Fungsi untuk tombol "Tampilkan Hasil"
const handleApplyFilters = () => {
    // Kumpulkan semua data filter ke dalam satu objek
    const filters = {
        time: selectedTime.value,
        startDate: startDate.value,
        endDate: endDate.value,
        statuses: selectedStatuses.value
    };
    
    // Kirim (emit) objek filter ke Induk (HistoryPage.vue)
    emit('apply-filters', filters);
};

// 5. Fungsi untuk tombol "Clear"
const handleClearFilters = () => {
    selectedTime.value = 'bulan_ini';
    startDate.value = '2025-12-11';
    endDate.value = '2025-12-20';
    selectedStatuses.value = ['terbayar', 'belum_dibayar', 'dibatalkan'];
    // Beritahu induk bahwa filter di-reset
    handleApplyFilters();
};

</script>

<template>
    <div class="bg-white rounded-xl shadow p-6">
        
        <div class="flex justify-between items-center mb-6">
        <h3 class="text-xl font-semibold text-gray-900">Filters</h3>
        <button 
            @click="handleClearFilters"
            class="text-sm font-medium text-blue-600 hover:text-blue-800"
        >
            Clear
        </button>
        </div>

        <div class="mb-6">
        <h4 class="font-semibold text-gray-800 mb-3">Waktu</h4>
        <div class="flex flex-wrap gap-2">
            <button 
            @click="selectTime('hari_ini')"
            :class="[selectedTime === 'hari_ini' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200']"
            class="px-4 py-1.5 text-sm rounded-full transition-colors"
            >
            Hari ini
            </button>
            <button 
            @click="selectTime('minggu_ini')"
            :class="[selectedTime === 'minggu_ini' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200']"
            class="px-4 py-1.5 text-sm rounded-full transition-colors"
            >
            Minggu ini
            </button>
            <button 
            @click="selectTime('bulan_ini')"
            :class="[selectedTime === 'bulan_ini' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200']"
            class="px-4 py-1.5 text-sm rounded-full transition-colors"
            >
            Bulan ini
            </button>
            </div>
        </div>

        <div class="mb-6">
        <h4 class="font-semibold text-gray-800 mb-3">Pilih Waktu</h4>
        <div class="flex items-center gap-2">
            <input 
            type="date" 
            v-model="startDate" 
            class="w-full p-2 border border-gray-300 rounded-lg text-sm text-gray-700"
            >
            <span class="text-gray-500">-</span>
            <input 
            type="date" 
            v-model="endDate" 
            class="w-full p-2 border border-gray-300 rounded-lg text-sm text-gray-700"
            >
        </div>
        </div>

        <div class="mb-6">
        <h4 class="font-semibold text-gray-800 mb-3">Status</h4>
        <div class="flex flex-wrap gap-2">
            <button
            v-for="status in allStatuses"
            :key="status.id"
            @click="toggleStatus(status.id)"
            :class="[isStatusActive(status.id) ? status.class : 'bg-gray-100 text-gray-400 border border-gray-200']"
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
