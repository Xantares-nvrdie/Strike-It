<script setup>
import { defineProps, defineEmits } from 'vue';
import { Icon } from '@iconify/vue';

// 1. Tentukan "prop" yang akan diterima dari Induk
// Kita hanya perlu satu prop, yaitu 'item'
const props = defineProps({
    item: {
        type: Object,
        required: true
    }
});

// 2. Tentukan "emits" (sinyal) yang akan dikirim ke Induk
const emit = defineEmits(['toggle-rating', 'submit-rating']);

// 3. Logika untuk status bisa kita pindah ke sini
// karena ini hanya relevan untuk kartu
const getStatusClass = (status) => {
    switch (status) {
        case 'terbayar': return 'text-green-600';
        case 'belum_dibayar': return 'text-yellow-600';
        case 'dibatalkan': return 'text-red-600';
        default: return 'text-gray-500';
    }
};
</script>

<template>
    <div class="bg-white rounded-xl shadow p-6 transition-all duration-300">
            
        <div class="flex flex-col sm:flex-row justify-between gap-4">
        <div class="flex-1">
            <h2 class="text-lg font-semibold text-gray-900">{{ props.item.title }}</h2>
            <p class="text-sm text-gray-500">{{ props.item.dateTime }}</p>
        </div>
        <div class="flex-shrink-0 text-left sm:text-right">
            <p class="text-lg font-semibold text-gray-900">{{ props.item.price }}</p>
            <span 
            class="text-sm font-medium" 
            :class="getStatusClass(props.item.status)"
            >
            {{ props.item.statusText }}
            </span>
        </div>
        </div>

        <div class="mt-4">
        <button 
            @click="emit('toggle-rating')"
            class="px-4 py-2 bg-blue-100 text-blue-700 text-sm font-medium rounded-lg hover:bg-blue-200 transition-colors"
        >
            Beri rating
        </button>
        </div>

        <div v-if="props.item.isRatingVisible" class="mt-6 border-t pt-6">
        
        <div class="flex flex-col gap-2">
            <label class="text-sm font-medium text-gray-700">Berikan jumlah bintang</label>
            <div class="flex items-center gap-1">
            <button
                v-for="star in 5"
                :key="star"
                @click="props.item.rating = star"
                class="p-1 rounded-full"
            >
                <Icon 
                icon="heroicons:star-20-solid" 
                class="w-8 h-8 transition-colors"
                :class="[star <= props.item.rating ? 'text-yellow-400' : 'text-gray-300 hover:text-yellow-300']"
                />
            </button>
            </div>
        </div>

        <div class="flex flex-col gap-2 mt-4">
            <label for="review" class="text-sm font-medium text-gray-700">Masukan rating anda...</label>
            <textarea 
            v-model="props.item.reviewText"
            id="review" 
            rows="4" 
            placeholder="Tulis ulasan Anda di sini..."
            class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            ></textarea>
        </div>

        <div class="flex items-center gap-4 mt-4">
            <button class="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-800 text-sm font-medium rounded-lg hover:bg-gray-300">
            <Icon icon="heroicons:photo-20-solid" class="w-5 h-5" />
            Tambahkan Gambar
            </button>
            <button 
            @click="emit('submit-rating')" 
            class="px-6 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700"
            >
            Kirimkan
            </button>
        </div>
        </div>
    </div>
</template>
