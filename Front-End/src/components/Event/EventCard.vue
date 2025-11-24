<script setup>
// Import defineProps untuk mendefinisikan data apa yang diterima dari parent
import { defineProps } from "vue";

// Mendefinisikan 'props' (properti) yang wajib dikirim saat menggunakan komponen ini.
// Validasi: event harus berupa Object dan wajib ada (required: true).
defineProps({
  event: {
    type: Object,
    required: true,
  },
});
</script>

<template>
  <div
    class="group bg-white rounded-lg shadow-md overflow-hidden transition-shadow hover:shadow-xl"
  >
    <div class="overflow-hidden relative">
      <img
        :src="event.imageUrl"
        :alt="event.title"
        class="w-full h-[35rem] object-cover transition-transform duration-300 group-hover:scale-105"
      />

      <div
        class="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300"
      >
        <a
          :href="event.externalLink"
          target="_blank"
          rel="noopener noreferrer"
          class="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
        >
          Lihat Lebih Lengkap
        </a>
      </div>
    </div>

    <div class="p-4">
      <h3
        class="text-base font-semibold text-gray-800 mb-2 truncate"
        :title="event.title"
      >
        {{ event.title }}
      </h3>

      <div class="flex justify-between items-center text-sm text-gray-500">
        <span>{{ event.author }}</span> <span>{{ event.date }}</span>
      </div>
    </div>
  </div>
</template>
