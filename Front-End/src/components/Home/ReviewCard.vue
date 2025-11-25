<script setup>
import { computed } from "vue";

const props = defineProps({
  review: Object,
});

// Fungsi untuk menghasilkan bintang rating
const getStars = computed(() => {
  const stars = [];
  for (let i = 0; i < props.review.rating; i++) {
    stars.push("★"); // Bintang penuh
  }
  for (let i = props.review.rating; i < 5; i++) {
    stars.push("☆"); // Bintang kosong
  }
  return stars.join("");
});
</script>

<template>
  <div
    class="bg-white rounded-xl shadow-lg p-6 flex flex-col border border-gray-100 relative"
  >
    <div class="flex items-center mb-4">
      <img
        :src="review.avatar"
        :alt="review.author"
        class="w-10 h-10 rounded-full object-cover mr-3"
      />
      <div>
        <p class="font-semibold text-gray-900">{{ review.author }}</p>
        <p class="text-sm text-gray-500">{{ review.title }}</p>
      </div>
    </div>

    <div class="mb-4 text-yellow-500 text-xl tracking-wider">
      {{ getStars }}
    </div>

    <p class="text-gray-700 leading-relaxed text-base">
      "{{ review.content }}"
    </p>

    <div
      class="absolute top-4 right-4 text-gray-200 text-6xl font-serif select-none pointer-events-none opacity-80"
    >
      ”
    </div>
  </div>
</template>
