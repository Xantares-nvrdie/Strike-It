<template>
    <div class="card-diskon w-full max-w-xs h-40 rounded-2xl border-2 border-blue-300 flex overflow-hidden shadow-lg transition duration-300 ease-in-out hover:shadow-xl hover:scale-[1.02]">

    <div class="card-left bg-gradient-to-b from-blue-500 to-blue-700 text-white font-bold writing-vertical rotate-180 flex justify-center items-center p-2 text-sm relative rounded-r-2xl h-full w-14 flex-shrink-0">
        DISKON
    </div>

    <div class="card-right p-5 flex-1 text-left bg-white">
        <p class="text-4xl text-center mb-2 font-extrabold text-gray-800">{{ discount }}</p>
        <p class="text-base mb-1 text-gray-700">Kode: <strong class="text-blue-600">{{ code }}</strong></p>
        <p class="text-sm text-gray-500 text-center">{{ usage }}</p>
    </div>
    </div>
</template>

<script setup>
import { defineProps } from 'vue';

const props = defineProps({
discount: String,
code: String,
usage: String,
});
</script>

<style scoped>
/* Custom style for vertical text (writing-mode: vertical-rl in original CSS) */
.writing-vertical {
  writing-mode: vertical-rl;
  text-orientation: mixed;
}

  
</style>