<template>
    <aside class="p-6 bg-white rounded-3xl shadow-lg flex flex-col gap-5">
        <form class="flex flex-col w-full gap-5" @submit.prevent="tampilkanHasil" @reset.prevent="resetFilter">
            
            <div class="flex items-center justify-between pb-4 border-b border-gray-100">
                <h2 class="text-xl font-bold text-gray-900">Filter</h2>
                <button type="reset" class="text-base font-bold text-blue-600 transition-colors hover:text-blue-700">Hapus</button>
            </div>
            
            <div class="flex flex-col gap-3">
                <h3 class="text-lg font-semibold text-gray-800">Jenis Alat</h3>
                <div class="flex flex-wrap gap-2.5">
                    <button 
                        v-for="jenis in jenisAlat"
                        :key="jenis"
                        type="button"
                        @click="toggleAlat(jenis)"
                        :class="[
                            'px-4 py-2 text-sm font-medium rounded-lg transition-colors border',
                            selectedAlat.includes(jenis)
                                ? 'bg-blue-600 text-white border-blue-600' // <-- STATE AKTIF (BIRU)
                                : 'bg-gray-100 text-gray-800 border-gray-200 hover:bg-gray-200 hover:border-gray-300' // <-- STATE NORMAL
                        ]"
                    >
                        {{ jenis }}
                    </button>
                </div>
            </div>
            
            <div class="flex flex-col gap-3">
                <div class="flex items-center gap-2">
                    <div class="relative flex-1">
                        <span class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                            <i class="fas fa-dollar-sign text-gray-400"></i>
                        </span>
                        <input 
                            v-model="filterHarga.min"
                            type="number"
                            id="min-price"
                            class="w-full p-2.5 pl-10 bg-gray-100 border border-gray-200 rounded-lg text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
                            placeholder="Min">
                    </div>
                    
                    <span class="text-gray-400">-</span>
                    
                    <div class="relative flex-1">
                        <span class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                            <i class="fas fa-dollar-sign text-gray-400"></i>
                        </span>
                        <input 
                            v-model="filterHarga.max"
                            type="number"
                            id="max-price"
                            class="w-full p-2.5 pl-10 bg-gray-100 border border-gray-200 rounded-lg text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
                            placeholder="Max">
                    </div>
                    
                    </div>
            </div>
            
            <div class="flex flex-col gap-3">
                <h3 class="text-lg font-semibold text-gray-800">Status</h3>
                <div class="flex flex-wrap gap-2.5">
                    <button 
                        v-for="stat in status"
                        :key="stat"
                        type="button"
                        @click="selectStatus(stat)"
                        :class="[
                            'px-4 py-2 text-sm font-medium rounded-lg transition-colors border',
                            selectedStatus === stat
                                ? 'bg-blue-600 text-white border-blue-600' // <-- STATE AKTIF (BIRU)
                                : 'bg-gray-100 text-gray-800 border-gray-200 hover:bg-gray-200 hover:border-gray-300' // <-- STATE NORMAL
                        ]"
                    >
                        {{ stat }}
                    </button>
                </div>
            </div>
            
            <button 
                type="submit"
                class="w-full px-4 py-2 bg-gradient-to-tr from-blue-800 to-blue-500/90 rounded-xl inline-flex justify-center items-center gap-2.5 text-white text-base font-medium font-['Outfit'] hover:from-blue-700 hover:to-blue-400 transition duration-300"
            >
                Tampilkan Hasil
            </button>
                    
        </form>
    </aside>
</template>

<script setup>
import { ref, reactive } from 'vue'

// --- Data untuk v-for ---
const jenisAlat = ['Joran', 'Umpan', 'Kail', 'Reels Pancing']
const status = ['Sewa', 'Beli']

// --- State untuk melacak apa yang dipilih ---
const selectedAlat = ref([]) // Pakai array agar bisa multi-select
const selectedStatus = ref(null) // Pakai null/string agar single-select

const filterHarga = reactive({
    min: null,
    max: null
})

// --- Fungsi untuk Toggle Multi-Select (Jenis Alat) ---
function toggleAlat(alat) {
    const index = selectedAlat.value.indexOf(alat)
    if (index > -1) {
        // Jika sudah ada -> Hapus dari array
        selectedAlat.value.splice(index, 1)
    } else {
        // Jika belum ada -> Tambahkan ke array
        selectedAlat.value.push(alat)
    }
}

// --- Fungsi untuk Toggle Single-Select (Status) ---
function selectStatus(stat) {
    if (selectedStatus.value === stat) {
        // Jika diklik lagi -> Batal pilih
        selectedStatus.value = null
    } else {
        // Pilih yang baru
        selectedStatus.value = stat
    }
}

// --- Fungsi untuk Submit Form ---
function tampilkanHasil() {
    console.log('Filter dikirim:', {
        alat: selectedAlat.value,
        status: selectedStatus.value,
        harga: filterHarga
    })
}

// --- Fungsi untuk Reset Form ---
function resetFilter() {
    filterHarga.min = null
    filterHarga.max = null
    selectedAlat.value = []
    selectedStatus.value = null
    console.log('Filter direset')
}
</script>
