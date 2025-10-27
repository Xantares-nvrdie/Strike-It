<template>
    <div 
    :class="['card w-72 p-8 rounded-2xl shadow-xl border border-gray-100 transition duration-300 ease-in-out hover:scale-[1.02] hover:shadow-2xl hover:border-black/50', {'bg-white/90 scale-[1.05] shadow-2xl': isPopular}]"
    >
    <div class="card-header">
        <h3 class="text-2xl font-bold text-gray-800 mb-1">{{ title }}</h3>
        <span v-if="isPopular" class="inline-block bg-blue-600 text-white text-xs font-bold tracking-wider px-3 py-1 rounded-full mb-3 uppercase">POPULAR</span>
        <p class="text-sm text-gray-600 mt-0">{{ subtitle }}</p>
    </div>

    <div class="card-body mt-5">
        <div class="price my-5">
        <span class="text-xl font-normal text-gray-500">Rp</span>
        <span class="text-5xl font-extrabold text-gray-800 ml-1">{{ price }}</span>
        <span class="text-base font-normal text-gray-500">/bulan</span>
        </div>
        
        <ul class="features list-none p-0 text-left my-5 space-y-3">
        <li v-for="(feature, index) in features" :key="index" class="text-sm text-gray-700 flex items-start">
            <span class="text-green-500 mr-3 text-lg">✔</span>
            <p>{{ feature }}</p>
        </li>
        </ul>
        
        <button class="bg-blue-600 text-white font-bold py-3 px-6 rounded-xl w-full hover:bg-blue-700 transition duration-300">
        Langganan disini
        </button>
    </div>
    </div>
</template>

<script setup>
import { defineProps } from 'vue';

const props = defineProps({
    title: String,
    subtitle: String,
    price: String,
    features: Array,
    isPopular: {
    type: Boolean,
    default: false
    }
});
</script>