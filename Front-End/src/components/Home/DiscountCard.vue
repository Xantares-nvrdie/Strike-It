<template>
    <div
        class="card-diskon font-['Outfit'] w-full max-w-xs h-40 rounded-2xl border border-blue-200 flex overflow-hidden 
            shadow-xl transition-all duration-300 ease-in-out transform hover:scale-[1.02] hover:shadow-2xl cursor-pointer"
    >
        
        <div
        class="relative flex items-center justify-center flex-shrink-0 h-full p-2 text-sm font-bold text-white 
                bg-gradient-to-b from-blue-600 to-blue-800 rounded-r-2xl w-14 rotate-180 
                border-l-4 border-dashed border-white
                [writing-mode:vertical-rl] [text-orientation:mixed]"
        >
        DISKON
        </div>

        <div class ="flex-1 p-4 bg-white flex flex-col justify-center items-center ">
        
        <p class="mb-1 text-5xl font-extrabold text-blue-700 leading-none">
            {{ discount }}
        </p>
        
        <p class="mb-2 text-base text-gray-700 flex items-center gap-1">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-gray-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="18" y="18" width="4" height="4"/><rect x="2" y="18" width="4" height="4"/><path d="M10 18H6"/><path d="M18 14H6"/><path d="M18 10H6"/><path d="M18 6H2"/><path d="M22 14v-4"/></svg>
            Kode: <strong class="text-blue-600 tracking-wide">{{ code }}</strong>
        </p>
        
        <p class="text-xs text-gray-500 text-center px-2">
            {{ usage }}
        </p>
        </div>
    </div>
</template>

<script setup>
import { defineProps } from "vue";

const props = defineProps({
    discount: String,
    code: String,
    usage: String,
});
</script>

<style scoped>
/* Pastikan font 'Outfit' sudah di-import di file CSS global Anda */
</style>