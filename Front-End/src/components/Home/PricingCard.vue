<script setup>
import { defineProps, defineEmits } from "vue";

const props = defineProps({
  title: String,
  subtitle: String,
  price: String,
  features: Array,
  isPopular: {
    type: Boolean,
    default: false,
  },
  // TAMBAHAN: Prop untuk cek status aktif
  isCurrent: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["subscribe"]);
</script>

<template>
  <div
    :class="[
      'card w-full max-w-xs font-[\'Outfit\'] p-6 rounded-2xl shadow-xl border border-gray-100 transition duration-300 ease-in-out hover:scale-[1.02] hover:shadow-2xl hover:border-black/50 flex flex-col',
      { 'bg-white/90 scale-[1.05] shadow-2xl': isPopular && !isCurrent },
      // Style khusus jika paket aktif
      { 'border-green-500 ring-2 ring-green-100 bg-green-50/20': isCurrent },
    ]"
  >
    <div class="card-header relative">
      <!-- Badge Popular (Hanya jika tidak sedang aktif) -->
      <span
        v-if="isPopular && !isCurrent"
        class="inline-block px-3 py-1 mb-2 text-xs font-bold tracking-wider text-white uppercase bg-blue-600 rounded-full"
        >POPULAR</span
      >

      <!-- Badge Aktif (Baru) -->
      <span
        v-if="isCurrent"
        class="inline-block px-3 py-1 mb-2 text-xs font-bold tracking-wider text-white uppercase bg-green-600 rounded-full"
        >AKTIF</span
      >

      <h3 class="mb-1 text-2xl font-bold text-gray-800">{{ title }}</h3>
      <p class="text-sm text-gray-600 min-h-[40px]">{{ subtitle }}</p>
    </div>

    <div class="mt-6 card-body flex-1 flex flex-col">
      <div class="mb-6 price flex items-baseline">
        <span class="text-xl font-normal text-gray-500">Rp</span>
        <span class="ml-1 text-5xl font-extrabold text-gray-800">{{
          price
        }}</span>
        <span class="ml-1 text-base font-normal text-gray-500">/bulan</span>
      </div>

      <ul class="p-0 space-y-3 text-left list-none features mb-8 flex-1">
        <li
          v-for="(feature, index) in features"
          :key="index"
          class="flex items-start text-sm text-gray-700"
        >
          <!-- Centang hijau lebih gelap jika aktif -->
          <span
            class="flex-shrink-0 mr-2 text-lg"
            :class="isCurrent ? 'text-green-700' : 'text-green-500'"
            >✔</span
          >
          <span>{{ feature }}</span>
        </li>
      </ul>

      <!-- Tombol Berubah -->
      <button
        type="button"
        class="w-full px-4 py-4 text-base font-bold text-center text-white transition duration-200 ease-in rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2"
        :class="[
          isCurrent
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 focus:ring-blue-500',
        ]"
        :disabled="isCurrent"
        @click="$emit('subscribe')"
      >
        {{ isCurrent ? "Sedang Aktif" : "Pilih Paket" }}
      </button>
    </div>
  </div>
</template>
