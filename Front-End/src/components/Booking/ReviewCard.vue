<script setup>
import { Icon } from "@iconify/vue";

// Menerima data 'review' berupa Object dari parent (LocationDetail.vue).
// Wajib ada (required: true) agar tidak error saat rendering.
defineProps({
  review: {
    type: Object,
    required: true,
  },
});
</script>

<template>
  <div class="bg-white rounded-2xl shadow-lg p-4 sm:p-6">
    <div class="flex items-start justify-between gap-4">
      <div class="flex items-center gap-3 min-w-0">
        <img
          :src="review.avatarUrl"
          :alt="review.username"
          class="size-10 rounded-full object-cover flex-shrink-0"
        />
        <div class="min-w-0">
          <div class="flex items-center">
            <span class="font-semibold text-gray-900 truncate">{{
              review.username
            }}</span>
            <span
              v-if="review.isCurrentUser"
              class="ml-2 px-2 py-0.5 bg-blue-600 text-white text-xs font-medium rounded-md flex-shrink-0"
            >
              Anda
            </span>
          </div>
          <span class="text-sm text-gray-500">{{ review.date }}</span>
        </div>
      </div>

      <div v-if="review.rating" class="flex items-center gap-0.5 flex-shrink-0">
        <Icon
          v-for="n in 5"
          :key="n"
          icon="mdi:star"
          class="size-4 sm:size-5"
          :class="n <= review.rating ? 'text-yellow-400' : 'text-gray-300'"
        />
      </div>
    </div>

    <p
      class="mt-4 text-gray-700 leading-relaxed text-sm sm:text-base line-clamp-3"
    >
      "{{ review.comment }}"
    </p>

    <!-- <div class="mt-4 text-right">
            <button class="text-sm font-medium text-blue-600 hover:underline">
                Baca lebih lanjut
            </button>
        </div> -->
  </div>
</template>
