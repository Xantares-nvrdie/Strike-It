<template>
    <aside class="p-6 bg-white rounded-3xl shadow-lg flex flex-col gap-5 h-full">
        <form class="flex flex-col w-full gap-5" @submit.prevent="tampilkanHasil" @reset.prevent="resetFilter">
            
            <div class="flex items-center justify-between pb-4 border-b border-gray-100">
                <h2 class="text-xl font-bold text-gray-900">Filter</h2>
                
                <div class="flex items-center gap-4">
                    <button type="reset" class="text-base font-bold text-blue-600 transition-colors hover:text-blue-700">Hapus</button>

                    <button 
                        type="button" 
                        @click="emit('close')" 
                        class="lg:hidden p-1 text-gray-500 hover:text-gray-800"
                    >
                        <Icon icon="heroicons:x-mark-20-solid" class="w-6 h-6" />
                    </button>
                </div>
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
                                ? 'bg-blue-600 text-white border-blue-600'
                                : 'bg-gray-100 text-gray-800 border-gray-200 hover:bg-gray-200 hover:border-gray-300'
                        ]"
                    >
                        {{ jenis }}
                    </button>
                </div>
            </div>
            
            <div class="flex flex-col gap-3">
                <h3 class="text-lg font-semibold text-gray-800">Harga</h3>
                <div class="flex items-center gap-2">
                    <div class="relative flex-1">
                        <input
                            type="number"
                            v-model.number="filterHarga.min"
                            placeholder="Min"
                            class="w-full pl-8 pr-2 py-2 border border-gray-300 rounded-lg text-sm focus:ring-blue-500 focus:border-blue-500"
                        />
                        <Icon icon="heroicons:currency-dollar-20-solid" class="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                    </div>
                    <span class="text-gray-500">-</span>
                    <div class="relative flex-1">
                        <input
                            type="number"
                            v-model.number="filterHarga.max"
                            placeholder="Max"
                            class="w-full pl-8 pr-2 py-2 border border-gray-300 rounded-lg text-sm focus:ring-blue-500 focus:border-blue-500"
                        />
                        <Icon icon="heroicons:currency-dollar-20-solid" class="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                    </div>
                    <button type="submit" class="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">Cari</button>
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
                                ? 'bg-blue-600 text-white border-blue-600'
                                : 'bg-gray-100 text-gray-800 border-gray-200 hover:bg-gray-200 hover:border-gray-300'
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
import { ref, reactive, defineEmits } from 'vue'
import { Icon } from '@iconify/vue'; 

const emit = defineEmits(['close'])

// --- Data ---
const jenisAlat = ['Joran', 'Umpan', 'Kail', 'Senar', 'Reels Pancing'] // Diperbarui sesuai screenshot
const status = ['Sewa', 'Beli']
const selectedAlat = ref([])
const selectedStatus = ref(null)
const filterHarga = reactive({ min: null, max: null })

// --- Fungsi ---
function toggleAlat(alat) {
    const index = selectedAlat.value.indexOf(alat)
    if (index > -1) {
        selectedAlat.value.splice(index, 1)
    } else {
        selectedAlat.value.push(alat)
    }
}
function selectStatus(stat) {
    selectedStatus.value = stat
}

function tampilkanHasil() {
    console.log('Filter dikirim:', {
        alat: selectedAlat.value,
        status: selectedStatus.value,
        harga: filterHarga
    })
    emit('close') // Tutup sidebar setelah filter diterapkan
}

function resetFilter() {
    filterHarga.min = null
    filterHarga.max = null
    selectedAlat.value = []
    selectedStatus.value = null
    console.log('Filter direset')
    // Jangan emit 'close' di sini agar user bisa reset dan lanjut mengedit tanpa panel tertutup
}
</script>
