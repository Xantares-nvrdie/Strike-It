<template>
    <div class="card-penilaian bg-blue-500/85 backdrop-blur-md rounded-xl p-6 shadow-xl relative overflow-hidden transition duration-300 hover:shadow-2xl">

    <div class="absolute top-[-20px] right-4 text-[160px] text-white/10 font-serif leading-none z-10 select-none">”</div>

    <span class="block text-lg font-bold mb-2 text-white relative z-20">{{ name }}</span>

    <div class="flex mb-4 relative z-20">
        <div v-for="n in 5" :key="n" class="w-5 h-5 mr-1 bg-yellow-500" style="clip-path: polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%);"></div>
    </div>

    <p class="text-sm text-gray-200 leading-relaxed relative z-20">{{ comment }}</p>
    </div>
</template>

<script setup>
import { defineProps } from 'vue';

const props = defineProps({
    name: String,
    comment: String,
});
</script>