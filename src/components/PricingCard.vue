<template>
    <div
        :class="[
        'card w-full max-w-xs font-[\'Outfit\'] p-6 rounded-2xl shadow-xl border border-gray-100 transition duration-300 ease-in-out hover:scale-[1.02] hover:shadow-2xl hover:border-black/50',
        { 'bg-white/90 scale-[1.05] shadow-2xl': isPopular },
        ]"
    >
        <div class="card-header">
        <span
            v-if="isPopular"
            class="inline-block px-3 py-1 mb-2 text-xs font-bold tracking-wider text-white uppercase bg-blue-600 rounded-full"
            >POPULAR</span
        >
        <h3 class="mb-1 text-2xl font-bold text-gray-800">{{ title }}</h3>
        <p class="text-sm text-gray-600">{{ subtitle }}</p>
        </div>

        <div class="mt-6 card-body">
        <div class="mb-6 price flex items-baseline">
            <span class="text-xl font-normal text-gray-500">Rp</span>
            <span class="ml-1 text-5xl font-extrabold text-gray-800">{{
            price
            }}</span>
            <span class="ml-1 text-base font-normal text-gray-500">/bulan</span>
        </div>

        <ul class="p-0 space-y-3 text-left list-none features mb-8">
            <li
            v-for="(feature, index) in features"
            :key="index"
            class="flex items-start text-sm text-gray-700"
            >
            <span class="flex-shrink-0 mr-2 text-lg text-green-500">✔</span>
            <span>{{ feature }}</span>
            </li>
        </ul>

        <button
            class="w-full px-6 py-3 font-bold text-white transition duration-300 bg-blue-600 rounded-xl hover:bg-blue-700"
        >
            Langganan disini
        </button>
        </div>
    </div>
</template>

<script setup>
import { defineProps } from "vue";

const props = defineProps({
    title: String,
    subtitle: String,
    price: String,
    features: Array,
    isPopular: {
        type: Boolean,
        default: false,
    },
});
</script>