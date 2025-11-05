<script setup>
// Import Icon dari Iconify
import { Icon } from '@iconify/vue';

defineProps({
  comment: Object,
});
</script>

<template>
  <div class="bg-zinc-100 border-white shadow-md border-4 rounded-[2rem] p-5">
    <div class="flex justify-between items-start">
      <div class="flex items-center space-x-3">
        <img class="h-10 w-10 rounded-full" :src="comment.author.avatar" :alt="comment.author.name">
        <div>
          <a href="#" class="text-sm font-semibold text-gray-900 hover:underline">{{ comment.author.name }}</a>
          <p class="text-xs text-gray-500">{{ comment.time }}</p>
        </div>
      </div>
      <button class="text-gray-400 hover:text-gray-600">
        <Icon icon="heroicons-solid:ellipsis-vertical" class="h-5 w-5" />
      </button>
    </div>

    <p class="mt-3 text-sm text-gray-700">
      {{ comment.content }}
    </p>

    <div class="mt-4 flex space-x-6 text-xs font-medium text-gray-500">
      <button class="hover:text-gray-900">Sembunyikan balasan</button>
      <button class="hover:text-gray-900">Berikan balasan</button>
    </div>
  </div>
</template>