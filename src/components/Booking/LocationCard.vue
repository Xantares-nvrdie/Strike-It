<script setup>
import { Icon } from '@iconify/vue';

defineProps({
  location: {
    type: Object,
    required: true
  }
})
</script>

<template>
  <div
    class="w-[95dvw] sm:w-[90dvw] md:w-[80dvw] lg:w-[70dvw] bg-[#eeeeee] rounded-3xl border-4 border-white shadow-xl p-8 flex flex-col lg:flex-row items-center gap-8">

    <div class="flex-shrink-0 flex flex-col items-center lg:items-start gap-2 md:gap-6 w-full lg:w-1/3">

      <h2 class="font-medium text-gray-800 leading-none mb-4 md:mb-0 break-words text-[clamp(2.25rem,5vw,3.75rem)] text-center md:text-left">
        {{ location.city }}
      </h2>

      <img :src="location.imageUrl" :alt="location.city" class="w-full h-48 object-cover rounded-xl shadow-md" />
    </div>

    <div class="flex flex-col justify-start items-center lg:items-start gap-3 lg:gap-6 flex-grow w-full">

      <div class="flex items-center">
        <Icon icon="mdi:map-marker" class="size-[2.5rem] text-gray-700" />
        <span class="text-[clamp(1.25rem,5vw,2rem)] font-medium text-gray-700">
          {{ location.address }}
        </span>
      </div>

      <div>
        <h3 class="text-2xl font-medium text-gray-700">Deskripsi:</h3>
        <p class="mt-2 text-base text-gray-700 text-[clamp(.25rem,4vw,1.25rem)] text-justify leading-none">
          {{ location.description }}
        </p>
      </div>

      <button
        class="w-fit px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-500 text-white text-xl font-medium rounded-2xl shadow-lg hover:from-blue-700 hover:to-blue-600 transition-all duration-300">
        Lihat Lebih Lanjut
      </button>
    </div>
  </div>
</template>